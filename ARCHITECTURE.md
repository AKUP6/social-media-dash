# Architecture — Content Creation Dashboard

This document describes the current state of the codebase precisely enough that
someone (or some AI) with zero prior context can understand every file's
purpose and how data flows through the app, without needing to read the
source first.

## What this app is

A single-page React app (built with Vite, no router, no backend) for an
Instagram reel creator to track their content performance and get AI-assisted
reel ideas. It has three tabs, switched client-side with local component
state — no URL routing:

1. **Home** — read-only dashboard of aggregate stats.
2. **Reel Input** — a form to log a new reel's stats; scores it against
   existing reels.
3. **AI Chat** — dropdown controls that generate 3–5 templated reel ideas,
   grounded in the performance data from the logged reels.

There is no server and no real LLM call. "AI Chat" generates ideas from a
local, rule-based template generator (`src/tabs/AIChat/ideaGenerator.js`), not
a live model.

## Full file tree

```
index.html                          entry HTML, loads fonts + src/main.jsx
package.json / package-lock.json    deps: react, react-dom, vite, @vitejs/plugin-react
vite.config.js                      minimal Vite config (React plugin only)

src/
  main.jsx                          React root; mounts <App/>, imports tokens.css
  App.jsx                           top-level shell: owns activeTab state + all reel state,
                                     renders TabNav + whichever tab is active

  shared/                           cross-cutting: design tokens, data contracts, seed data,
                                     the tab bar, and the one shared state hook
    tokens.css                      CSS custom properties (colors/fonts), global reset,
                                     .card and .mono utility classes
    types.js                        JSDoc type definitions for Reel, Metrics, RankResult
                                     (documentation only — no runtime code, just `export {}`)
    mockData.js                     seed array of 8 Reel objects + derived Metrics object
    useReels.js                     React hook: holds the live list of reels in state,
                                     derives Metrics from it, exposes addReel()
    TabNav.jsx                      the tab bar UI (Home / Reel input / AI chat buttons)

  lib/                              framework-agnostic business logic, no React
    ranking.js                      rankReel() — scores one reel against a set of reels
                                     getPerformanceInsights() — aggregates stats across all reels
    promptBuilder.js                buildPrompt() — turns controls + ranking insights into a
                                     natural-language prompt string (built but currently unused —
                                     see "Known dead code" below)

  tabs/
    Home/
      Home.jsx                      tab entry; renders the 3 metric cards from `metrics` prop
      components/
        ViewsCard.jsx                "Views this month" stat card
        FollowerCard.jsx             "Follower increase" stat card
        TopReelsCard.jsx             "Top 3 performing reels" list card

    ReelInput/
      ReelInput.jsx                  tab entry; holds local `lastResult` state, renders
                                      ReelForm + RankResult
      components/
        ReelForm.jsx                  the log-a-reel form; on submit builds a Reel object,
                                       calls rankReel(), then addReel()
        StatField.jsx                 generic labeled input (text/number/date) used by ReelForm
        RankResult.jsx                 displays the RankResult returned by rankReel()

    AIChat/
      AIChat.jsx                     tab entry; holds reelType/goal/ideas state, calls
                                      getPerformanceInsights() + generateIdeas() on "Generate ideas"
      ideaGenerator.js               generateIdeas() — local template engine producing 3–5
                                      idea objects (not a real AI call)
      components/
        TypeGoalControls.jsx          the two <select> dropdowns + "Generate ideas" button
        IdeaList.jsx                  renders IdeaCard list, or an empty-state message
        IdeaCard.jsx                   one reel idea: hook, concept, 3-beat structure, CTA
```

## Data flow (the important part)

### 1. State lives in one place: `App.jsx`

```
App.jsx
 ├─ useState('home')          → activeTab
 └─ useReels()                → { reels, metrics, addReel }
```

`App.jsx` calls the `useReels()` hook **once**, at the top level, and passes
`reels`, `metrics`, and `addReel` down as props to whichever tab component is
currently mounted:

```jsx
<ActiveTabComponent reels={reels} metrics={metrics} addReel={addReel} />
```

This is deliberate and non-obvious: `App.jsx` only ever mounts ONE tab
component at a time (it swaps which component renders based on `activeTab`,
it does not keep all three mounted and hide the inactive ones). If each tab
called `useReels()` independently instead of receiving it as a prop, each tab
would get its own separate state, and switching tabs would unmount/remount
components — silently discarding any reel logged in Reel Input the moment the
user switched to Home and back. This was caught and fixed during development;
`useReels()` must only ever be called in `App.jsx`.

- **Home** reads `metrics` (ignores `reels` and `addReel`).
- **ReelInput** reads `reels` and calls `addReel` (ignores `metrics`).
- **AIChat** reads `reels` (ignores `metrics` and `addReel`).

### 2. `useReels()` (src/shared/useReels.js)

```js
export function useReels() {
  const [reels, setReels] = useState(mockReels)   // seeded from mockData.js
  const metrics = useMemo(() => computeMetrics(reels), [reels])
  function addReel(reel) { setReels(prev => [...prev, reel]) }
  return { reels, metrics, addReel }
}
```

`metrics` is **derived**, not stored — it's recomputed from `reels` every
time `reels` changes (`computeMetrics` sums views, sums follower gains, and
takes the top 3 reels by view count). There is no separate "metrics state" to
keep in sync.

### 3. Reel Input flow

1. User fills out `ReelForm` (controlled inputs, no native form submit/reload
   — everything is `onClick`/`onChange`).
2. On "Log reel" click, `ReelForm` builds a `Reel` object matching the shape
   in `types.js` (percent fields like share rate are typed as whole numbers
   in the UI, e.g. `4.1`, and divided by 100 before being stored, so the
   stored `Reel.shareRate` is always `0..1`).
3. `ReelForm` calls `rankReel(newReel, reels)` from `src/lib/ranking.js` —
   this scores the new reel against the existing `reels` array and returns a
   `RankResult` (`{ overallRank, nicheRank, score, tier }`). This is computed
   **before** the reel is added to the shared list.
4. `ReelForm` calls `addReel(newReel)` (the prop from `App.jsx`), which
   updates the shared `reels` state — this is what makes the new reel show
   up in Home's metrics and top-reels list.
5. `ReelForm` calls `onLogged(result)`, a callback passed down from
   `ReelInput.jsx`, which stores the `RankResult` in local state
   (`lastResult`) so `RankResult.jsx` can render it.

### 4. AI Chat flow

1. User picks `reelType` (educational/broad/niche) and `goal`
   (views/followers) via `TypeGoalControls`.
2. On "Generate ideas" click, `AIChat.jsx`:
   - calls `getPerformanceInsights(reels)` (from `ranking.js`) to get an
     aggregate summary of what's performed well (best reel overall, best per
     niche, average engagement rates, tier counts).
   - calls `buildPrompt({ reelType, goal, rankContext })` (from
     `promptBuilder.js`) — this builds a prompt string, but **the return
     value is discarded and never used or displayed**. This is dead code
     left over from — or a stand-in for — a real LLM integration that
     doesn't exist yet. See "Known dead code" below.
   - after a 350ms simulated delay, calls
     `generateIdeas({ reelType, goal, rankContext })` from
     `ideaGenerator.js`, which template-generates 3–5 idea objects from
     hardcoded phrase banks keyed by `reelType` and `goal`, using
     `rankContext` only to pick which niches/subjects to reference.
3. Ideas are stored in local state and rendered by `IdeaList` → `IdeaCard`.

**Important:** there is no live AI model anywhere in this app.
`generateIdeas` is a deterministic template function. `buildPrompt` exists
and is called but its output goes nowhere.

## The data contracts (`src/shared/types.js`)

This file has zero runtime code (just `export {}`) — it exists purely to
document three JSDoc shapes that every other file conforms to by convention,
not by static enforcement (this is plain JS, not TypeScript):

```js
Reel = {
  id: string,
  hook: string,                // opening line/hook text
  views: number,
  shareRate: number,           // 0..1
  saveRate: number,            // 0..1
  likeRate: number,            // 0..1
  followsFromReel: number,
  niche: string,                // e.g. "front ensemble", "broad"
  datePosted: string,          // ISO date string
}

Metrics = {
  monthViews: number,
  followerIncrease: number,
  topReels: Reel[],            // length 3, sorted desc by views
}

RankResult = {
  overallRank: number,         // 1 = best among all reels
  nicheRank: number,           // 1 = best within its niche
  score: number,                // 0..100 composite
  tier: "top" | "strong" | "average" | "weak",
}
```

Function signatures that are treated as frozen contracts across files:

```js
// src/lib/ranking.js
rankReel(newReel: Reel, allReels: Reel[]) => RankResult
getPerformanceInsights(reels: Reel[]) => {
  totalReels, best, bestByNiche, averages, tierCounts
}  // shape consumed only by promptBuilder.js and ideaGenerator.js, not in types.js

// src/lib/promptBuilder.js
buildPrompt({ reelType: string, goal: string, rankContext: object }) => string
```

## Ranking algorithm (`src/lib/ranking.js`)

`rankReel(newReel, allReels)`:
1. Merges `newReel` into `allReels` (replacing by `id` if it already exists,
   otherwise appending) to form `combined`.
2. For each of 5 weighted metrics (`views` 0.35, `shareRate` 0.25, `saveRate`
   0.15, `likeRate` 0.15, `followsFromReel` 0.10), min-max normalizes every
   reel's value in `combined` to a 0..1 range, multiplies by the weight, and
   sums — giving each reel a 0..100 `score`.
3. Sorts `combined` by score descending; `overallRank` is `newReel`'s
   1-indexed position in that sort. `nicheRank` is its 1-indexed position
   within only the reels sharing its `niche`.
4. `tier` is derived from `score`: `>=80` "top", `>=60` "strong", `>=40`
   "average", else "weak".

`getPerformanceInsights(reels)` calls `rankReel` once per reel (ranking each
reel against all the *other* reels) to find the single best-performing reel
overall, the best reel per niche, average engagement rates across all reels,
and a count of reels per tier. Returns `{ totalReels: 0, best: null,
bestByNiche: {}, averages: null, tierCounts: {} }` if `reels` is empty.

## Design tokens (`src/shared/tokens.css`)

Loaded once, globally, via `src/main.jsx`. Every component in the app must
use these — there should be no hardcoded hex colors anywhere else in `src/`.

```css
--bg: #f5f9ff;          /* page background */
--surface: #e8f1fe;     /* card background */
--primary: #4da3ff;     /* accent */
--primary-deep: #1e6fd9;/* accent, stronger (buttons, emphasis text) */
--ink: #0b2a4a;         /* primary text */
--muted: #6b8cae;       /* secondary text */
--line: #cfe2fa;        /* borders */

--font-display: 'Space Grotesk', sans-serif;   /* headings, UI, labels */
--font-mono: 'JetBrains Mono', monospace;      /* numbers/stats — use .mono class */
```

Two shared classes are defined once here and reused everywhere:
- `.card` — the standard card surface (background, border, radius, shadow,
  padding) used by every stat card, form, and list panel in the app.
- `.mono` — applies `--font-mono`, used to wrap any rendered number/stat.

Fonts are loaded once via `<link>` tags in `index.html` (Google Fonts,
Space Grotesk + JetBrains Mono) — no other file imports fonts.

## Mock/seed data (`src/shared/mockData.js`)

`mockReels` is a hardcoded array of 8 `Reel` objects spanning niches
`"front ensemble"`, `"broad"`, and `"battery"`, with views ranging from
~53k to ~313k. `mockMetrics` is a `Metrics` object derived from
`mockReels` at module load time (used only as documentation/reference —
`useReels.js` recomputes its own metrics live and does not import
`mockMetrics`, only `mockReels`, as the initial `useState` seed).

## Known dead code / rough edges

- **`buildPrompt()`'s return value is discarded** in
  `AIChat.jsx::handleGenerate` — it's called (so `promptBuilder.js` is
  exercised) but the resulting string is never stored, displayed, or passed
  to `generateIdeas`. `generateIdeas` gets its grounding data directly from
  `rankContext`, not from the built prompt. Flagged, not yet fixed.
- **No persistence**: all state (`reels`) lives in a single `useState` in
  `App.jsx` / `useReels.js`. A full page reload resets everything back to
  the 8 seed reels in `mockData.js`. There is no localStorage, no backend,
  no database.
- **No routing**: `activeTab` is plain component state in `App.jsx`, not
  reflected in the URL. Reloading the page always returns to the Home tab.
