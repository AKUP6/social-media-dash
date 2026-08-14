# CLAUDE.md — Content Dashboard

Claude 1 is the manager. Claude 2 and Claude 3 are the workers. If you are not sure a file is yours, it is
not — ask Claude 1.

Current phase: **housekeeping pass over the three tabs.** Styling and markup only. No logic, no contracts,
no data-flow changes.

## Design language — applies everywhere

- **Zero corner radius.** Nothing is rounded: cards, buttons, inputs, selects, images, chips.
- **No borders, no rings.** Never a `border` on a container, never a `0 0 0 1px` ring faking one. The only
  edge treatment is a glow token: `var(--glow-sm)`, `var(--glow)`, `var(--glow-strong)`. They are tight,
  symmetric deep-blue blooms — never black, never opaque, never offset. Do not invent new ones.
- **Poppins only.** No Space Grotesk, no JetBrains Mono. Numbers use the `.mono` class, which is Poppins with
  tabular figures — do not set `font-family` yourself.
- **Color comes from `tokens.css`.** Zero hex or rgba in any component. `--glow-rgb` / `--primary-rgb` /
  `--primary-deep-rgb` exist so you never restate a color to change its opacity.
- No emojis. Sentence case labels. Buttons say what they do ("Log reel", "Generate ideas").

## Hard constraints

- Do not edit `src/lib/` or `src/shared/types.js`.
- Do not touch `useReels`, `rankReel`, `buildPrompt`, `addReel`, `onLogged`, or `getPerformanceInsights`.
  Keep every handler and prop exactly as it is.
- Never edit a file owned by another Claude.

## Ownership

**Claude 1 — manager**

```
index.html                 src/shared/tokens.css
src/main.jsx               src/shared/ReelCard.jsx
src/App.jsx                src/shared/types.js
src/components/  (all)     src/shared/mockData.js
  TabNav.jsx               src/shared/useReels.js
CLAUDE.md
```

**Claude 2 — Home tab**

```
src/tabs/Home/Home.jsx
src/tabs/Home/components/*      (ViewsCard, FollowerCard, TopReelsCard, any new ones)
```

**Claude 3 — Reel Input tab**

```
src/tabs/ReelInput/ReelInput.jsx
src/tabs/ReelInput/components/*   (ReelForm, StatField, RankResult)
```

**AI chat tab — split between Claude 2 and Claude 3**

Ownership inside that tab is per-component, not per-tab. It is spelled out in
`src/tabs/AIChat/AICHAT.md`; read that file before touching anything under `src/tabs/AIChat/`.
`AIChat.jsx` and `ideaGenerator.js` belong to Claude 1.

## Done already (Claude 1)

Poppins wired in `index.html`; `tokens.css` rewritten with the glow tokens and the `.card` / `.card-inset` /
`.field` / `.btn` utilities; `thumbnail` added to `Reel` and seeded in `mockData.js`; `ReelCard` built;
`TabNav` restyled as fixed-order folder tabs. Tokens are frozen — build against them.

## Claude 2 — Home

1. `Home.jsx` — flex column layout, no CSS grid.
2. `ViewsCard` / `FollowerCard` — plain rectangles on `.card`, stacked vertically with flex, views on top.
   Label plus number, nothing decorative.
3. `TopReelsCard` — render the top three reels through `src/shared/ReelCard.jsx`, laid out with flex. Do not
   write your own card markup and do not edit `ReelCard`.
4. Empty state: "No reels logged yet — add your first above."

## Claude 3 — Reel Input

1. Every container moves to the design language above.
2. `ReelForm` / `StatField` — inputs and selects use `.field` from `tokens.css`. They stay controlled; leave
   `onChange` / `onClick` alone.
3. `RankResult` — same treatment as Home's stat boxes so the tabs read as one system. Tier labels use token
   colors.

Known violations to clear: inline `borderRadius` in `StatField.jsx` and `ReelForm.jsx`, plus several
`border: '1px solid var(--line)'`. Inline styles beat the global radius reset, so they have to be deleted by
hand.

## AI chat — both workers

See `src/tabs/AIChat/AICHAT.md`. Claude 2 builds the message thread, Claude 3 builds the composer, and they
run in parallel against contracts Claude 1 freezes in `AIChat.jsx` first.

## Requests

Need a new token, a change to `ReelCard`, or a new field on `Reel`? Write one line —
`REQUEST(Claude 1): add --glow-inset token` — and wait. Do not add it locally.

## Done means

- Zero rounded corners, zero borders or 1px rings; tight deep-blue glows throughout.
- Poppins is the only font family; no hex or rgba outside `tokens.css`.
- Home stacks views and follower increase vertically and renders top reels through `ReelCard`.
- Reel Input and AI Chat match Home visually, with every handler and data flow unchanged.
