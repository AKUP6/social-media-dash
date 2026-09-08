import { useEffect, useMemo, useState } from 'react'
import { mockReels } from './mockData.js'
import { isSupabaseConfigured, supabase } from './supabaseClient.js'

function computeMetrics(reels) {
  const topReels = [...reels].sort((a, b) => b.views - a.views).slice(0, 3)
  return {
    monthViews: reels.reduce((sum, reel) => sum + reel.views, 0),
    followerIncrease: reels.reduce((sum, reel) => sum + reel.followsFromReel, 0),
    topReels,
  }
}

// DB rows are snake_case; the rest of the app only ever sees the Reel shape
// from types.js.
function rowToReel(row) {
  return {
    id: row.id,
    hook: row.hook,
    views: row.views,
    shareRate: row.share_rate,
    skipRate: row.skip_rate,
    likeRate: row.like_rate,
    followsFromReel: row.follows_from_reel,
    niche: row.niche,
    datePosted: row.date_posted,
    thumbnail: row.thumbnail ?? undefined,
    description: row.description ?? undefined,
  }
}

function reelToRow(reel) {
  return {
    id: reel.id,
    hook: reel.hook,
    views: reel.views,
    share_rate: reel.shareRate,
    skip_rate: reel.skipRate,
    like_rate: reel.likeRate,
    follows_from_reel: reel.followsFromReel,
    niche: reel.niche,
    date_posted: reel.datePosted,
    thumbnail: reel.thumbnail ?? null,
    description: reel.description ?? null,
  }
}

/**
 * Shared reel state. Home reads `reels` and `metrics`.
 * Reel Input calls `addReel(reel)` on submit.
 *
 * Backed by Supabase when VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are
 * set (see .env.example + supabase/schema.sql); falls back to the local
 * mock seed with no persistence otherwise, so the app still runs without
 * that setup.
 */
export function useReels() {
  const [reels, setReels] = useState(isSupabaseConfigured ? [] : mockReels)

  useEffect(() => {
    if (!isSupabaseConfigured) return
    let cancelled = false

    supabase
      .from('reels')
      .select('*')
      .order('date_posted', { ascending: true })
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          console.error('useReels: failed to load reels from Supabase', error)
          return
        }
        setReels(data.map(rowToReel))
      })

    return () => {
      cancelled = true
    }
  }, [])

  const metrics = useMemo(() => computeMetrics(reels), [reels])

  function addReel(reel) {
    setReels((prev) => [...prev, reel])

    if (!isSupabaseConfigured) return
    supabase
      .from('reels')
      .insert(reelToRow(reel))
      .then(({ error }) => {
        if (error) console.error('useReels: failed to save reel to Supabase', error)
      })
  }

  function updateReel(reel) {
    setReels((prev) => prev.map((r) => (r.id === reel.id ? reel : r)))

    if (!isSupabaseConfigured) return
    supabase
      .from('reels')
      .update(reelToRow(reel))
      .eq('id', reel.id)
      .then(({ error }) => {
        if (error) console.error('useReels: failed to update reel in Supabase', error)
      })
  }

  function deleteReel(id) {
    setReels((prev) => prev.filter((r) => r.id !== id))

    if (!isSupabaseConfigured) return
    supabase
      .from('reels')
      .delete()
      .eq('id', id)
      .then(({ error }) => {
        if (error) console.error('useReels: failed to delete reel in Supabase', error)
      })
  }

  return { reels, metrics, addReel, updateReel, deleteReel }
}
