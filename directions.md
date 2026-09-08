# Reel input → reels overview — build spec (Revision 3)

Manager AI wrote this. Claude 1 and Claude 2 build it **in parallel**, same domain split as Revisions 1–2.
Read the whole file before touching anything. Root `CLAUDE.md` still applies — zero corner radius (the
global reset already forces `border-radius: 0` on everything; don't fight it with an inline override), no
borders or 1px rings, glow tokens only, Nunito only, color from `tokens.css` only (no hex, no rgba
literals), no emojis, sentence case, and its hard constraints (below) are non-negotiable.

**Revision 3 supersedes Revision 2.** The right-hand form is being pulled out of the two-column layout
entirely and moved into a modal. Read this whole file even if you built Revision 2.

## What we are building now

```
Reel input tab (default state)
 ┌───────────────────────────────┬─────────────────────────────┐
 │  reels list (left)            │  verbose reel card (right)   │
 │  header: "All reels" + [+]    │  title (hook)                │
 │  every reel, one row each,    │  niche                       │
 │  click a row to select it     │  view count                  │
 │                                │  thumbnail                   │
 └───────────────────────────────┴─────────────────────────────┘

Clicking [+] →
 ┌───────────────────────────────────────────────────────────────┐
 │  same layout behind a dark, semi-transparent backdrop          │
 │  ┌─────────────────────────────────────────┐                  │
 │  │  [×]                                     │  ← modal, foreground
 │  │  ReelForm + RankResult (unchanged)       │
 │  └─────────────────────────────────────────┘                  │
 └───────────────────────────────────────────────────────────────┘
```

Three product decisions, already made — don't re-litigate them:

1. **Detail card selection.** The right-side card shows the top-ranked reel (by `views`, descending) by
   default. Clicking any row in the left list switches the right card to that reel. There is no "nothing
   selected" empty state once at least one reel exists — it always falls back to top-ranked.
2. **The `+` lives inside the reels list card's header**, where the old "Add new reel" button used to be —
   next to the "All reels" label, not floating elsewhere on the page.
3. **The modal closes two ways**: clicking the dark backdrop, or an explicit `×` button on the modal itself.
   Both must work.

## Why you cannot collide

```
src/tabs/ReelInput/ReelInput.jsx                    Claude 1   state + orchestration (exists — edit in place)
src/tabs/ReelInput/components/AddReelModal.jsx       Claude 1   the modal (new)

src/tabs/ReelInput/components/ReelsOverview.jsx      Claude 2   the list (exists — edit in place)
src/tabs/ReelInput/components/ReelDetailCard.jsx     Claude 2   the verbose card (new)
```

Same domain split as before: Claude 1 owns state/orchestration + anything that hosts the form. Claude 2 owns
reel-display components. No shared file. Build against the frozen contracts below rather than each other's
actual code — you don't need to wait for the other to land before starting.

**Neither of you touches:** `ReelForm.jsx`, `RankResult.jsx`, `StatField.jsx`, `TopReelsCard.jsx`,
`ReelThumb.jsx`, `TopReelsBox.jsx`, anything in `src/lib/`, `src/shared/types.js`, `useReels.js`, `Home.jsx`,
`AIChat.jsx`, `tokens.css`, or `BackButton.jsx`. Per root `CLAUDE.md`: never change the signature or call
sites of `addReel`, `onLogged`, or `rankReel` — `ReelForm`/`RankResult` keep receiving exactly the props
they receive today, just from inside `AddReelModal.jsx` instead of directly inside `ReelInput.jsx`.

`TopReelsCard.jsx` and `ReelThumb.jsx` are shared with the Home tab — do not edit either. If a list row
needs to be clickable, add the click handler to the wrapper `<div>` that already surrounds each
`TopReelsCard` in `ReelsOverview.jsx`, not to `TopReelsCard` itself.

## Frozen contracts

### `ReelsOverview.jsx` props (Claude 2 implements, Claude 1 imports against this)

```js
/**
 * @param {{
 *   reels: import('../../../shared/types.js').Reel[],
 *   selectedReelId: string | null,
 *   onSelectReel: (reel: import('../../../shared/types.js').Reel) => void,
 *   onAddClick: () => void,
 * }} props
 */
export default function ReelsOverview({ reels, selectedReelId, onSelectReel, onAddClick }) { ... }
```

### `ReelDetailCard.jsx` props (Claude 2 implements, new file)

```js
/**
 * @param {{ reel: import('../../../shared/types.js').Reel | null }} props
 */
export default function ReelDetailCard({ reel }) { ... }
```

### `AddReelModal.jsx` props (Claude 1 implements, new file)

```js
/**
 * @param {{
 *   onClose: () => void,
 *   reels: import('../../../shared/types.js').Reel[],
 *   addReel: (reel: import('../../../shared/types.js').Reel) => void,
 *   onLogged: (result: import('../../../shared/types.js').RankResult) => void,
 *   result: import('../../../shared/types.js').RankResult | null,
 * }} props
 */
export default function AddReelModal({ onClose, reels, addReel, onLogged, result }) { ... }
```

`reels`, `addReel`, `onLogged` pass straight through to `<ReelForm reels={reels} addReel={addReel}
onLogged={onLogged} />` unchanged. `result` passes straight through to `<RankResult result={result} />`
unchanged. `AddReelModal` has no `isOpen` prop — its presence in the tree *is* "open"; `ReelInput.jsx`
mounts it conditionally.

### `ReelInput.jsx` state (Claude 1 owns)

```js
const [selectedReelId, setSelectedReelId] = useState(null)
const [isAddOpen, setIsAddOpen] = useState(false)
const [lastResult, setLastResult] = useState(null)   // unchanged from earlier revisions

const topRankedReel = reels.length > 0 ? [...reels].sort((a, b) => b.views - a.views)[0] : null
const displayedReel = reels.find((r) => r.id === selectedReelId) ?? topRankedReel
```

Render: `BackButton` ("Back to home") → two-column row (`ReelsOverview` left, `ReelDetailCard` right,
`reel={displayedReel}`) → `{isAddOpen && <AddReelModal onClose={() => setIsAddOpen(false)} reels={reels}
addReel={addReel} onLogged={setLastResult} result={lastResult} />}`. Wire `ReelsOverview`'s
`onSelectReel={(reel) => setSelectedReelId(reel.id)}` and `onAddClick={() => setIsAddOpen(true)}`.

## Claude 2 — `ReelsOverview.jsx` and `ReelDetailCard.jsx`

1. **Header row** becomes a flex row again: `"All reels"` label on the left, a `+` button on the right,
   `onClick={onAddClick}`. It's icon-only now (not "Add new reel" text) — give it `aria-label="Add new
   reel"`. Reuse `.btn`/`.btn-primary` for the button surface; content can be a literal `+` character or a
   small inline SVG plus, your call.
2. **Row selection**: each row is already wrapped in `<div key={reel.id}>` around its `TopReelsCard` — add
   `onClick={() => onSelectReel(reel)}` and `style={{ cursor: 'pointer' }}` to that wrapper (don't touch
   `TopReelsCard.jsx`). When `reel.id === selectedReelId`, give the wrapper a background of
   `var(--surface-deep)` so the selection is visible — that's the only visual-selection requirement, no glow
   or border needed.
3. Sorting, divider pattern, and empty state are unchanged from Revision 2.
4. **New file** `ReelDetailCard.jsx`: a `.card` (`background: var(--surface-alt)`, matching
   `ReelsOverview`'s surface so the two columns read as a pair). Top to bottom, in this exact order:
   - Title — `reel.hook`, prominent (e.g. similar weight to `.stat`/heading text, not `.label` size).
   - Niche — `reel.niche`, quiet styling (e.g. the same uppercase `.label`-adjacent treatment
     `TopReelsCard` uses for niche today).
   - View count — `reel.views`, compact-formatted the same way `TopReelsCard` does
     (`Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })`), in `.mono`.
   - Thumbnail — **do not import `ReelThumb`** (it's fixed at 56×56, too small for a "verbose" card and
     it's shared with Home). Build a bigger image block inline here: `<img src={reel.thumbnail} />` at a
     large fixed size or a square aspect box (e.g. 240×240, `object-fit: cover`), falling back — when
     `reel.thumbnail` is absent — to a `var(--surface-deep)` block with `var(--glow-sm)` at the same size,
     same fallback spirit as `ReelThumb` but not the same component.
   - When `reel` is `null` (only possible if `reels` is empty): a single `.caption` line, "No reels logged
     yet.", no other content.

## Claude 1 — `ReelInput.jsx` and `AddReelModal.jsx`

1. Wire the state and render described in the frozen contract above. Delete the old right-column
   `ReelForm`/`RankResult` block from Revision 2 — it moves into `AddReelModal.jsx`.
2. **New file** `AddReelModal.jsx`. Structure as two sibling fixed-position elements (not nested — this
   avoids needing `stopPropagation` for backdrop-click-to-close):
   - Backdrop: `position: fixed`, `inset: 0`, `background: var(--ink)`, CSS `opacity: 0.6` (opacity, not an
     rgba literal — there's no `--ink-rgb` token and this task doesn't need one), a high `zIndex` (e.g.
     `100`), `onClick={onClose}`, class `fade-in` (already defined in `tokens.css`) for the entrance.
   - Modal card: `position: fixed`, centered (`top: 50%, left: 50%, transform: translate(-50%, -50%)`),
     `zIndex: 101` (above the backdrop), class `fade-in`, a `.card` surface containing an explicit `×` close
     button top-right (`onClick={onClose}`) followed by `<ReelForm .../>` and `<RankResult .../>` with the
     exact props from the frozen contract.
   - Because the card is a sibling of the backdrop, not a child, clicking inside the card never reaches the
     backdrop's `onClick` — don't add `stopPropagation` anywhere, it isn't needed with this structure.
3. `ReelForm`/`RankResult` keep the exact props they receive today — you're relocating them into the modal,
   not rewriting them. Logging a reel still doesn't auto-close the modal (frozen `onLogged` behavior is
   unchanged) — the user sees `RankResult` in place and closes manually.

## Done when

- `npm run build` passes.
- Landing on the Reel input tab shows the reels list on the left and the top-ranked reel's detail card
  (title, niche, views, thumbnail, in that order) on the right — no click required to see a detail card.
- Clicking any reel row swaps the right-side card to that reel and visibly marks the row as selected.
- Clicking `+` in the list header opens the modal: background dims, `ReelForm` + `RankResult` appear in the
  foreground.
- The modal closes via backdrop click or the `×` button; either way returns to the two-column view
  unchanged.
- No file outside `src/tabs/ReelInput/` changed, and `TopReelsCard.jsx`/`ReelThumb.jsx` are untouched.

---

## Revision 4 — two bugfixes

Small, surgical, same ownership as Revision 3. No new contracts, no layout changes.

### Bug 1 (Claude 2 — `ReelsOverview.jsx`)

The selected-row highlight (`background: reel.id === selectedReelId ? 'var(--surface-deep)' : undefined`)
reads too dark against the white `--surface-alt` card. Swap it to `var(--surface)` — same token vocabulary,
noticeably lighter, still a clearly visible tint against `--surface-alt`. Don't introduce a new token or an
rgba literal for this; `var(--surface)` is already the right shade and already exists.

### Bug 2 (Claude 1 — `ReelInput.jsx`)

The detail card auto-displays the top-ranked reel on first render (via the `displayedReel` fallback), but
the list's selection highlight doesn't reflect that until the user actually clicks a row — `selectedReelId`
starts `null`, so no row shows as selected even though one *is* effectively showing on the right.

Fix: pass the derived value, not the raw state, to `ReelsOverview`:

```js
<ReelsOverview
  reels={reels}
  selectedReelId={displayedReel?.id ?? null}   // was: selectedReelId={selectedReelId}
  onSelectReel={(reel) => setSelectedReelId(reel.id)}
  onAddClick={() => setIsAddOpen(true)}
/>
```

No new state — `displayedReel` already exists and already falls back to `topRankedReel`. This makes the
highlighted row always match whatever the detail card is actually showing, including on first load before
any click.

### Done when

- On first load, before any click, the top-ranked reel's row is visibly highlighted in the list AND is the
  reel shown in the detail card on the right — they always agree.
- The highlight color is `var(--surface)`, not `var(--surface-deep)`.
- `npm run build` passes.
