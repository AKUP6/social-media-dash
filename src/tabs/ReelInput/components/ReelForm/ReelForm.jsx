import { useRef, useState } from 'react'
import { rankReel } from '../../../../lib/ranking.js'
import StatField from './StatField.jsx'

const EMPTY_FORM = {
  hook: '',
  views: '',
  shareRate: '',
  skipRate: '',
  likeRate: '',
  followsFromReel: '',
  niche: '',
  datePosted: new Date().toISOString().slice(0, 10),
  description: '',
  thumbnail: '',
}

function formFromReel(reel) {
  return {
    hook: reel.hook,
    views: String(reel.views),
    shareRate: String(reel.shareRate * 100),
    skipRate: String(reel.skipRate * 100),
    likeRate: String(reel.likeRate * 100),
    followsFromReel: String(reel.followsFromReel),
    niche: reel.niche,
    datePosted: reel.datePosted.slice(0, 10),
    description: reel.description ?? '',
    thumbnail: reel.thumbnail ?? '',
  }
}

function readImageAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * @param {{
 *   reels: import('../../../../shared/types.js').Reel[],
 *   addReel: (reel: import('../../../../shared/types.js').Reel) => void,
 *   onLogged: (result: import('../../../../shared/types.js').RankResult) => void,
 *   mode?: 'add' | 'edit',
 *   initialReel?: import('../../../../shared/types.js').Reel | null,
 *   updateReel?: (reel: import('../../../../shared/types.js').Reel) => void,
 *   onSaved?: () => void,
 *   onDelete?: (id: string) => void,
 * }} props
 */
export default function ReelForm({ reels, addReel, onLogged, mode = 'add', initialReel = null, updateReel, onSaved, onDelete }) {
  const [form, setForm] = useState(() => (initialReel ? formFromReel(initialReel) : EMPTY_FORM))
  const [thumbnailName, setThumbnailName] = useState(initialReel?.thumbnail ? 'Current image' : '')
  const fileInputRef = useRef(null)

  function update(field) {
    return (value) => setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleImageChange(event) {
    const file = event.target.files?.[0]
    if (!file) return
    setThumbnailName(file.name)
    const dataUrl = await readImageAsDataUrl(file)
    setForm((prev) => ({ ...prev, thumbnail: dataUrl }))
  }

  function handleRemoveThumbnail() {
    update('thumbnail')('')
    setThumbnailName('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const canSubmit = form.hook.trim() !== '' && form.views !== '' && form.niche.trim() !== ''

  function buildReel(id) {
    return {
      id,
      hook: form.hook.trim(),
      views: Number(form.views) || 0,
      shareRate: (Number(form.shareRate) || 0) / 100,
      skipRate: (Number(form.skipRate) || 0) / 100,
      likeRate: (Number(form.likeRate) || 0) / 100,
      followsFromReel: Number(form.followsFromReel) || 0,
      niche: form.niche.trim(),
      datePosted: new Date(form.datePosted).toISOString(),
      description: form.description.trim() || undefined,
      thumbnail: form.thumbnail || undefined,
    }
  }

  function handleSubmit() {
    if (!canSubmit) return

    if (mode === 'edit') {
      updateReel(buildReel(initialReel.id))
      onSaved?.()
      return
    }

    const newReel = buildReel(crypto.randomUUID())
    const result = rankReel(newReel, reels)
    addReel(newReel)
    onLogged(result)
    setForm(EMPTY_FORM)
    setThumbnailName('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function handleDelete() {
    if (!window.confirm('Delete this reel? This can\'t be undone.')) return
    onDelete(initialReel.id)
  }

  return (
    <div className="card-inset" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <StatField label="Hook" type="text" value={form.hook} onChange={update('hook')} placeholder="The opening line viewers see first" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 'var(--space-4)' }}>
        <StatField label="Views" type="number" min={0} step={1} value={form.views} onChange={update('views')} placeholder="0" />
        <StatField label="Follows from reel" type="number" min={0} step={1} value={form.followsFromReel} onChange={update('followsFromReel')} placeholder="0" />
        <StatField label="Share rate" type="number" min={0} max={100} step={0.1} suffix="%" value={form.shareRate} onChange={update('shareRate')} placeholder="0" />
        <StatField label="Skip rate" type="number" min={0} max={100} step={0.1} suffix="%" value={form.skipRate} onChange={update('skipRate')} placeholder="0" />
        <StatField label="Like rate" type="number" min={0} max={100} step={0.1} suffix="%" value={form.likeRate} onChange={update('likeRate')} placeholder="0" />
        <StatField label="Date posted" type="date" value={form.datePosted} onChange={update('datePosted')} />
      </div>
      <StatField label="Niche" type="text" value={form.niche} onChange={update('niche')} placeholder="e.g. front ensemble, broad" />
      <StatField
        label="Description"
        type="textarea"
        value={form.description}
        onChange={update('description')}
        placeholder="Longer notes: what worked, context, follow-up ideas..."
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <span className="label">Cover image</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          {form.thumbnail ? (
            <img
              src={form.thumbnail}
              alt=""
              style={{ width: 64, height: 64, objectFit: 'cover', boxShadow: 'var(--glow-sm)', flexShrink: 0 }}
            />
          ) : (
            <div style={{ width: 64, height: 64, background: 'var(--surface-deep)', boxShadow: 'var(--glow-sm)', flexShrink: 0 }} />
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', opacity: 0, pointerEvents: 'none' }}
          />
          <button type="button" onClick={() => fileInputRef.current?.click()} className="btn" style={{ flexShrink: 0 }}>
            Choose image
          </button>
          <span className="caption" style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {thumbnailName || 'No file chosen'}
          </span>
          {form.thumbnail ? (
            <button type="button" onClick={handleRemoveThumbnail} className="btn" style={{ flexShrink: 0 }}>
              Remove
            </button>
          ) : null}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="btn btn-primary"
          style={{ alignSelf: 'flex-start' }}
        >
          {mode === 'edit' ? 'Save changes' : 'Log reel'}
        </button>

        {mode === 'edit' ? (
          <button type="button" onClick={handleDelete} className="btn btn-danger" style={{ alignSelf: 'flex-start' }}>
            Delete reel
          </button>
        ) : null}
      </div>
    </div>
  )
}
