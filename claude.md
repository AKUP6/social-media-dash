# CLAUDE.md — Content Dashboard Redesign

Three Claudes work this build. **Claude 1 is the manager. Claude 2 and Claude 3 are the workers.**
Read this whole file before writing code. If you are not sure a file is yours, it is not — ask Claude 1.

## Mission

Redesign all three tabs to look intentional and human-made, not AI-generated. Every visual change lives in
`tokens.css` and per-component styling. No logic, no contracts, no data-flow changes.

## Global design language — applies to every tab

- **Zero corner radius on everything.** No rounded corners anywhere — cards, buttons, inputs, selects, images.
- **No borders, no rings. Soft black glow instead of shadows.** Delete every `border` / `border-radius` rule
  on containers, and never add a `0 0 0 1px` ring to fake one. The only edge treatment is a glow from the
  tokens — `var(--glow-sm)`, `var(--glow)`, or `var(--glow-strong)`. They are symmetric black blooms at low
  opacity, built from `--glow-rgb`: never fully opaque, never offset like a hard drop shadow.
- **Poppins everywhere.** Replaces Space Grotesk and JetBrains Mono across the whole app, numbers included.
- **All color comes from `tokens.css`.** Zero hardcoded hex or rgba in any component — the glow ships as a
  token, and `--glow-rgb` / `--primary-rgb` exist so nobody needs to restate a color to change an opacity.
- No emojis in UI. Sentence case labels. Buttons say what they do ("Log reel", "Generate ideas").

## Hard constraints — do not cross

- Do not edit anything in `src/lib/`.
- Do not change `src/shared/types.js` or any data shape.
- Do not touch `useReels`, `rankReel`, `buildPrompt`, `addReel`, `onLogged`, `getPerformanceInsights`, or any
  state flow. This is styling and markup only.
- Never edit a file owned by another Claude. If you need a change there, file a request (see "Cross-Claude requests").

---

## Claude 1 — Manager (me)

**Owns exclusively:**

```
index.html
src/main.jsx
src/App.jsx
src/shared/tokens.css
src/shared/TabNav.jsx
src/shared/ReelCard.jsx        (new — the shared reel card)
src/shared/types.js
src/shared/mockData.js
src/shared/useReels.js
CLAUDE.md
```

**Tasks, in order:**

1. Swap the font link in `index.html` to Poppins (weights 400/500/600/700). Remove the Space Grotesk and
   JetBrains Mono links.
2. Rewrite the token block in `tokens.css`:
   - `--font-display` and `--font-mono` both point at Poppins so existing `.mono` usages don't break.
   - `--radius-card: 0`.
   - Add `--glow-rgb` / `--primary-rgb` / `--primary-deep-rgb` channel tokens, then `--glow-sm`, `--glow`,
     and `--glow-strong` built from `--glow-rgb`. `--shadow-card` stays as an alias of `--glow`.
   - `.card`: drop the border, radius `0`, glow.
   - Add a `.surface` / `.field` utility set so workers restyle inputs and selects without inventing values.
3. Build `src/shared/ReelCard.jsx` — the single reusable top-reel card. Props: `{ reel }`. Renders top to
   bottom: reel title (the `hook`), view count, niche, then the reel image at the bottom.
4. Resolve the image gap: `Reel` has no image field today. As the only Claude allowed to touch `types.js` and
   `mockData.js`, add `thumbnail: string` to the `Reel` typedef and seed URLs (or a token-colored placeholder
   block) in `mockData.js`, then tell Claude 2 the field name. Nobody else adds this field.
5. Restyle `TabNav.jsx` as Google-style tabs — underline on the active tab, muted inactive labels, no pill
   backgrounds, no radius.
6. Commit tokens + `ReelCard` + `TabNav` **before** unblocking the workers.
7. After both workers land: review every tab against the design language, hunt for stray hex, stray radius,
   stray borders, leftover Space Grotesk / JetBrains Mono, and fix only inside manager-owned files. Anything
   wrong inside a worker's file goes back to that worker.

Claude 1 never writes the internals of a tab.

---

## Claude 2 — Home tab

**Owns exclusively:**

```
src/tabs/Home/Home.jsx
src/tabs/Home/components/ViewsCard.jsx
src/tabs/Home/components/FollowerCard.jsx
src/tabs/Home/components/TopReelsCard.jsx
src/tabs/Home/components/*        (any new Home components)
```

**Tasks:**

1. `Home.jsx` — replace the current two-column CSS grid with a flex column layout.
2. `ViewsCard.jsx` and `FollowerCard.jsx` — plain rectangles, zero radius, no border, `var(--glow)`,
   **stacked vertically using flex**. Views on top, follower increase below. Label + number, nothing decorative.
3. `TopReelsCard.jsx` — render the top three reels through the shared `ReelCard` from
   `src/shared/ReelCard.jsx`, laid out with flex. Do not write your own card markup; do not edit `ReelCard`.
4. Numbers stay in the `.mono` utility class (which now resolves to Poppins) — do not set `font-family` yourself.
5. Empty state stays directional: "No reels logged yet — add your first above."

**Do not touch:** `TabNav`, `tokens.css`, `ReelCard`, `App.jsx`, anything under `ReelInput/`, `AIChat/`, or `lib/`.

---

## Claude 3 — Reel Input and AI Chat tabs

**Owns exclusively:**

```
src/tabs/ReelInput/ReelInput.jsx
src/tabs/ReelInput/components/ReelForm.jsx
src/tabs/ReelInput/components/StatField.jsx
src/tabs/ReelInput/components/RankResult.jsx
src/tabs/AIChat/AIChat.jsx
src/tabs/AIChat/ideaGenerator.js        (styling-adjacent only — no logic changes)
src/tabs/AIChat/components/TypeGoalControls.jsx
src/tabs/AIChat/components/IdeaList.jsx
src/tabs/AIChat/components/IdeaCard.jsx
```

**Tasks:**

1. Restyle every container in both tabs to the global language: zero radius, no borders, soft black glow,
   Poppins, colors from tokens only.
2. `ReelForm` / `StatField` — inputs and selects get square corners, no border, the shared field styling from
   `tokens.css`. Keep them controlled inputs; keep `onClick`/`onChange` handlers exactly as they are.
3. `RankResult` — same card treatment as Home's stat boxes so the two tabs read as one system. Tier labels use
   token colors, no new hex.
4. `TypeGoalControls` — the two dropdowns match the restyled form fields.
5. `IdeaList` / `IdeaCard` — 3–5 idea cards, square, hard-shadowed, flex layout, consistent with `ReelCard`'s
   visual weight without importing or duplicating it.
6. Leave `onLogged`, `getPerformanceInsights`, `rankReel`, and `buildPrompt` call sites untouched.

**Do not touch:** `tokens.css`, `ReelCard`, `TabNav`, `App.jsx`, anything under `Home/` or `lib/`.

---

## Sequence

1. **Claude 1 solo.** Poppins in `index.html`, tokens rewritten, `ReelCard` built, `TabNav` restyled,
   `thumbnail` added to the contract. Committed.
2. **Claude 2 and Claude 3 in parallel**, against frozen tokens. They never edit shared files.
3. **Claude 1 reviews last** and integrates.

## Cross-Claude requests

- Need a new token, a shadow variant, or a change to `ReelCard`? Write one line —
  `REQUEST(Claude 1): add --glow-inset token` — and wait. Do not add it locally.
- Need a new field on `Reel`? Same thing. Claude 1 edits `types.js` and `mockData.js`; nobody else does.
- Two Claudes think they own the same file? Ownership above wins. If this file is silent, Claude 1 decides and
  records it here.

## Definition of done

- All three tabs render and switch cleanly from the Google-style `TabNav`.
- Zero rounded corners, zero container borders or 1px rings, soft black glows throughout — never a fully
  opaque or offset drop shadow.
- Poppins is the only font family in the app; no Space Grotesk or JetBrains Mono references remain.
- Home stacks views and follower increase vertically with flex, and renders top reels through the shared
  `ReelCard` (title → views → niche → image).
- Reel Input and AI Chat match Home visually, with every handler and data flow unchanged.
- No hardcoded hex in any component — every color resolves through `tokens.css`.
