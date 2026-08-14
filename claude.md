CLAUDE.md — Content Creation Dashboard

This file governs a 3-agent build. Read it fully before writing any code. If you are unsure whether a file is yours to touch, it is not — ask the Manager.

0. The Product (shared understanding)

A React content-creation dashboard for an Instagram reel creator. Three tabs:

Home — overall metrics as cards: views in the past month, follower increase, top 3 performing reels.
Reel Input — a form to log a reel (hook, views, share rate, and standard IG stats), submit it, and have a ranking algorithm score it against overall / niche categories. The ranking output influences the AI prompt.
AI Chat — dropdowns for reel type (educational / broad / niche) and goal (high view count / high follower count); outputs 3–5 well-formatted reel ideas.
Design language (NON-NEGOTIABLE — every agent obeys)
Color: light-blue monochromatic, techy. Use ONLY the tokens in src/shared/tokens.css. Never hardcode a hex value in a component. Palette:
--bg: #F5F9FF (near-white blue), --surface: #E8F1FE (card), --primary: #4DA3FF, --primary-deep: #1E6FD9, --ink: #0B2A4A (text), --muted: #6B8CAE, --line: #CFE2FA.
Font: modern/techy. Display + UI: Space Grotesk. Data/numbers/captions: JetBrains Mono. Loaded once by the Manager in index.html + tokens.css. Do not import fonts anywhere else.
Cards: --surface bg, 16px radius, 1px --line border, soft blue shadow. Define the .card class once in tokens.css; everyone reuses it.
No emojis in UI. Sentence case labels. Buttons say what they do ("Log reel", "Generate ideas").
1. Roles & Ownership (the anti-collision rule)

The golden rule: you may only create/edit files inside YOUR owned paths. Touching another agent's path is a hard stop.

🧠 MANAGER — Claude 1

Owns the skeleton and the contracts. Runs FIRST and ALONE in Phase 1, then coordinates. Owns exclusively:

index.html
src/main.jsx
src/App.jsx                 (tab shell + routing/tab state ONLY)
src/shared/                 (ALL of it)
  tokens.css                (colors, fonts, .card, global reset)
  types.js                  (JSDoc data shapes — the contracts)
  mockData.js               (seed reels/metrics all agents read from)
  TabNav.jsx                (the tab bar component)
  useReels.js               (shared reel state hook, if needed)

Responsibilities: scaffold the repo, define data shapes, wire the three tabs into App.jsx by importing each worker's entry component, resolve any integration issues, final review. The Manager NEVER writes the internals of a tab.

🐝 WORKER BEE A — Claude 2

Owns the two data tabs. Owns exclusively:

src/tabs/Home/
  Home.jsx                  (tab entry — Manager imports this)
  components/
    ViewsCard.jsx
    FollowerCard.jsx
    TopReelsCard.jsx
    (any more Home components)
src/tabs/ReelInput/
  ReelInput.jsx             (tab entry — Manager imports this)
  components/
    ReelForm.jsx
    StatField.jsx
    RankResult.jsx
    (any more input components)
🐝 WORKER BEE B — Claude 3

Owns the AI tab and the algorithm that feeds it. Owns exclusively:

src/tabs/AIChat/
  AIChat.jsx                (tab entry — Manager imports this)
  components/
    TypeGoalControls.jsx    (the dropdowns)
    IdeaList.jsx
    IdeaCard.jsx
src/lib/
  ranking.js                (the ranking algorithm)
  promptBuilder.js          (turns ranking + controls into the AI prompt)

Bee B owns ranking.js even though Bee A's Reel Input tab calls it. Reason: the algorithm and the AI prompt are one logical unit. Bee A imports the function; Bee B defines it. See §3 for the contract.

2. Phased Execution Order (do NOT run all three at once)

Phase 1 — Manager solo. Manager builds index.html, main.jsx, App.jsx shell, and the entire src/shared/ folder including types.js, tokens.css, and mockData.js. Manager creates EMPTY placeholder entry files (Home.jsx, ReelInput.jsx, AIChat.jsx) that export a stub <div> so App.jsx compiles. Workers do nothing until Phase 1 is committed.

Phase 2 — Workers in parallel. A and B build their owned trees against the frozen contracts from shared/. They never edit shared/. If a contract is wrong, they file a request to the Manager (see §4), they do not fix it themselves.

Phase 3 — Manager integrates. Manager confirms all three entry components render inside App.jsx, checks the design tokens are applied everywhere, and does the final critique pass.

3. The Contracts (frozen — only Manager may change)

These live in src/shared/types.js as JSDoc. Everyone codes to these exact shapes.

js
/** @typedef {Object} Reel
 *  @property {string} id
 *  @property {string} hook          // the opening line/hook text
 *  @property {number} views
 *  @property {number} shareRate      // 0..1
 *  @property {number} saveRate        // 0..1
 *  @property {number} likeRate         // 0..1
 *  @property {number} followsFromReel
 *  @property {string} niche           // e.g. "front ensemble", "broad"
 *  @property {string} datePosted       // ISO string
 */

/** @typedef {Object} Metrics
 *  @property {number} monthViews
 *  @property {number} followerIncrease
 *  @property {Reel[]} topReels         // length 3, pre-sorted desc
 */

/** Ranking contract — Bee B implements, Bee A calls.
 *  @typedef {Object} RankResult
 *  @property {number} overallRank      // 1 = best among all reels
 *  @property {number} nicheRank         // 1 = best within its niche
 *  @property {number} score              // 0..100 composite
 *  @property {string} tier                // "top" | "strong" | "average" | "weak"
 */

// Bee B exports EXACTLY this signature from src/lib/ranking.js:
// export function rankReel(newReel /* Reel */, allReels /* Reel[] */) => RankResult

// Bee B exports EXACTLY this from src/lib/promptBuilder.js:
// export function buildPrompt({ reelType, goal, rankContext }) => string

Shared state: the current list of reels lives in useReels.js (Manager). Bee A's form calls addReel(reel) from that hook; Home reads reels and metrics from it. Bee B's algorithm receives reels as a plain argument — it does not import the hook.

4. Cross-agent requests (how to not step on each other)
You need a new field on Reel? → Do NOT add it. Write a one-line request: REQUEST(Manager): add "audioTrack: string" to Reel typedef. Manager updates types.js, then you proceed.
You need a function another agent owns? → Import it by its contracted signature (§3). If it doesn't exist yet, code against the signature and stub locally is FORBIDDEN — instead the Manager sequences you after that function lands.
Two agents think they need the same file? → It belongs to whoever §1 assigns. If §1 is silent, Manager decides and records it here.
Never edit shared/, App.jsx, or another agent's tabs/ or lib/ folder. No exceptions.
5. Component & code rules (all agents)
Every tab folder has a single entry file (TabName.jsx) that the Manager imports; all sub-pieces live in that tab's components/. Keep components small and single-purpose.
One component per file. Named for what it shows (ViewsCard, not Card2).
Functional components + hooks only. Default export the component.
Pull all color/spacing/font from tokens.css classes or CSS vars. Zero inline hex.
Numbers and stats render in JetBrains Mono (use the .mono utility from tokens).
No <form> submit-reload behavior — use onClick/onChange handlers and controlled inputs.
Keep copy plain and active. Empty states give direction ("No reels logged yet — add your first above").
6. Final file structure (target)
index.html
src/
  main.jsx
  App.jsx
  shared/
    tokens.css
    types.js
    mockData.js
    TabNav.jsx
    useReels.js
  tabs/
    Home/
      Home.jsx
      components/{ViewsCard,FollowerCard,TopReelsCard}.jsx
    ReelInput/
      ReelInput.jsx
      components/{ReelForm,StatField,RankResult}.jsx
    AIChat/
      AIChat.jsx
      components/{TypeGoalControls,IdeaList,IdeaCard}.jsx
  lib/
    ranking.js
    promptBuilder.js
7. Definition of done
All three tabs render and switch cleanly from TabNav.
Home shows the three metric cards from mockData/useReels.
Reel Input submits a reel, calls rankReel, shows RankResult.
AI Chat dropdowns drive buildPrompt and render 3–5 idea cards.
Light-blue monochrome + Space Grotesk/JetBrains Mono applied everywhere via tokens. No stray hex.