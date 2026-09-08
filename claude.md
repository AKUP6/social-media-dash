# CLAUDE.md — Content Dashboard

## Overview

A React + Vite single-page dashboard for content creators. It tracks reel performance, logs new reels with
manual stats, ranks them, and generates content ideas with AI assistance. Three tabs, switched by a folder-style
nav bar:

- **Home** — views/follower summary and top-performing reels.
- **Reel input** — log a new reel's stats and see it ranked against past performance.
- **AI chat** — a chat-style interface that generates reel ideas from a reel type + goal, using past
  performance as context.

## Tech stack

React 18 on Vite. No CSS framework and no CSS-in-JS library — components use inline `style` objects plus a
small set of utility classes (`.card`, `.card-inset`, `.field`, `.btn`) defined in `src/shared/tokens.css`.
No test runner is configured; `npm run build` (vite build) is the correctness check.

## Project structure

```
src/
  main.jsx, App.jsx            bootstrap and tab switcher
  components/TabNav.jsx        folder-tab navigation bar
  shared/
    tokens.css                 design tokens + utility classes (color, spacing, .card/.field/.btn)
    types.js                   shared type definitions (Reel, ChatMessage, Idea, ...)
    mockData.js                seed data
    useReels.js                reel state hook
    ReelCard.jsx                shared reel display component, used by Home and AI chat
  lib/
    ranking.js                  rankReel, getPerformanceInsights
    promptBuilder.js             buildPrompt, REEL_TYPES, GOALS
  tabs/
    Home/                        performance overview tab
    ReelInput/                   reel logging + ranking tab
    AIChat/                      AI-assisted idea generation tab — see AICHAT.md for its internal
                                  component breakdown (thread vs. composer)
```

## Design language — applies everywhere

- **Zero corner radius.** as a default unless otherwise directed
- **No borders, no rings.** Never a `border` on a container, never a `0 0 0 1px` ring faking one. The only
  edge treatment is a glow token: `var(--glow-sm)`, `var(--glow)`, `var(--glow-strong)`. They are tight,
  symmetric deep-blue blooms — never black, never opaque, never offset. Do not invent new ones.
- **Nunito only.** No Space Grotesk, no JetBrains Mono. Numbers use the `.mono` class, which is Nunito with
  tabular figures — do not set `font-family` yourself.
- **Color comes from `tokens.css`.** Zero hex or rgba in any component. `--glow-rgb` / `--primary-rgb` /
  `--primary-deep-rgb` exist so you never restate a color to change its opacity.
- No emojis. Sentence case labels. Buttons say what they do ("Log reel", "Generate ideas").

## Hard constraints

- Do not edit `src/lib/` or `src/shared/types.js`.
- Do not touch `useReels`, `rankReel`, `buildPrompt`, `addReel`, `onLogged`, or `getPerformanceInsights` —
  keep every handler and prop exactly as it is.
- A new token, a change to `ReelCard`, or a new field on `Reel` is a shared, cross-tab surface — extend
  `tokens.css` / `ReelCard.jsx` / `types.js` deliberately and update every call site, rather than
  reimplementing the same thing locally inside one tab.
