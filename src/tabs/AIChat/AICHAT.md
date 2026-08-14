# AI chat tab — rebuild spec

Claude 1 wrote this. Claude 2 and Claude 3 build it **in parallel**. Read the whole file first.

Root `CLAUDE.md` still applies: zero corner radius, no borders or 1px rings, glow tokens only, Poppins only,
color from `tokens.css` only, no emojis, sentence case.

## What we are building

The tab becomes a normal AI chat window:

```
┌──────────────────────────────────────────────┐
│                                              │
│   thread — scrolls, grows downward           │  ← Claude 2
│   user turn on the right                     │
│   assistant turn on the left, full width     │
│                                              │
├──────────────────────────────────────────────┤
│  [ type a message…                        ]  │  ← Claude 3
│  [ Reel type: Educational ] [ Goal: Views ]  │     parameters live INSIDE
│                                  [ Send ]    │     the composer box
└──────────────────────────────────────────────┘
```

The one thing that is not a stock chat window: **the parameter controls sit inside the text insert box**,
below the textarea, on the same surface — not in a separate card above the thread. That is the whole point
of the redesign. The composer is one box containing textarea + parameters + send.

## Why you cannot collide

Claude 1 owns `AIChat.jsx` and lands the shell, state, and wiring **before either of you starts**. It renders
exactly two children and passes the props below. Neither of you edits it, and neither of you imports the
other's files. You have no shared file.

```
AIChat.jsx            Claude 1   shell, state, handlers  ← frozen when you start
  MessageThread.jsx   Claude 2
  Composer.jsx        Claude 3
```

**Claude 2 owns exclusively**

```
src/tabs/AIChat/components/MessageThread.jsx   (new)
src/tabs/AIChat/components/MessageBubble.jsx   (new)
src/tabs/AIChat/components/IdeaCard.jsx        (exists — rework in place)
src/tabs/AIChat/components/IdeaList.jsx        (exists — rework or delete)
```

**Claude 3 owns exclusively**

```
src/tabs/AIChat/components/Composer.jsx        (new)
src/tabs/AIChat/components/ParamControl.jsx    (new)
src/tabs/AIChat/components/TypeGoalControls.jsx (exists — delete once Composer replaces it)
```

Nobody touches `AIChat.jsx`, `ideaGenerator.js`, `src/lib/`, `tokens.css`, `ReelCard.jsx`, or the Home and
Reel Input tabs.

## Frozen contracts

Code against these. They will not change while you work.

### Message shape

`AIChat.jsx` holds `messages: ChatMessage[]` and hands the array to `MessageThread`.

```js
/** @typedef {Object} ChatMessage
 *  @property {string} id
 *  @property {'user' | 'assistant'} role
 *  @property {string} text                                  // user: what they typed. assistant: one-line preamble.
 *  @property {{ reelType: string, goal: string }} [params]  // user turns only — the parameters that turn was sent with
 *  @property {Idea[]} [ideas]                               // assistant turns only — render as cards
 *  @property {string} [prompt]                              // assistant turns only — the built prompt, collapsed by default
 *  @property {boolean} [pending]                            // assistant turn still generating — render a thinking state
 */
```

`Idea` is what `ideaGenerator.js` already returns and is unchanged:
`{ id, hook, concept, structure: string[], cta, angleTag }`.

### Props

```jsx
<MessageThread messages={messages} />

<Composer
  value={draft}                 // string, controlled
  onChange={setDraft}           // (string) => void — takes the value, not the event
  reelType={reelType}           // string
  goal={goal}                   // string
  onReelTypeChange={...}        // (string) => void
  onGoalChange={...}            // (string) => void
  onSend={handleSend}           // () => void — no arguments; the shell reads its own state
  isGenerating={isGenerating}   // boolean — disable send, show the generating label
/>
```

Parameter options come from `src/lib/promptBuilder.js`, already exported and already imported by the current
`TypeGoalControls`:

```js
import { REEL_TYPES, GOALS } from '../../../lib/promptBuilder.js'
// each is [{ value, label }]
```

### What the typed text does

`buildPrompt` in `src/lib/` is frozen and only consumes `reelType` and `goal`. So: the typed message is
displayed as the user's turn and nothing more; ideas are still generated from the two parameters. Do not
route the draft into `buildPrompt`, and do not add parameters beyond reel type and goal — a third parameter
needs a lib change, which is a `REQUEST(Claude 1)`.

---

## Claude 2 — the thread

1. `MessageThread.jsx` — flex column, `gap: var(--space-5)`, messages oldest to newest. The container
   scrolls; the composer below it does not move.
2. `MessageBubble.jsx` — one turn.
   - **User turn:** `alignSelf: flex-end`, max width around 70%, filled with `var(--primary-deep)`, text in
     `var(--surface-alt)`. Below the text, echo `params` as small quiet chips ("Educational · Views") so you
     can see what each turn was generated with.
   - **Assistant turn:** `alignSelf: flex-start`, full width, on `var(--surface)` with `var(--glow-sm)`.
     Preamble text, then the idea cards, then the collapsed `prompt` in a `<details>` labeled "Prompt used".
   - `pending: true` renders a quiet "Generating ideas…" turn in place of the content. No spinner graphics.
3. `IdeaCard.jsx` — keep the content (hook, angle tag, concept, structure beats, CTA); restyle it to sit
   *inside* an assistant turn rather than float on the page. It is a nested surface now: `var(--surface-alt)`,
   `var(--glow-sm)`, lighter than the turn around it. Delete the inline `border-radius` and any border.
4. Empty thread: one centered line, `.caption` — "No ideas yet — set a reel type and goal below, then send."
   No card around it.

## Claude 3 — the composer

1. `Composer.jsx` — one box: `var(--surface-alt)`, `var(--glow)`, zero radius, no border, padding
   `var(--space-4)`, flex column with `gap: var(--space-3)`. Top to bottom: textarea, then a parameter row,
   then send on the right of that row.
2. The textarea is bare — transparent background, `border: none`, `outline: none`, `resize: none`, 2 rows,
   grows to about 6. It must not look like a separate field inside the box; the box *is* the field. Do not
   put `.field` on it.
3. Parameters render as inline controls on the same surface, reading `Reel type: Educational`. Label in
   `.label`, value in `var(--ink)`. Use a real `<select>` so it stays keyboard accessible and controlled —
   strip its chrome (`appearance: none`, no border, no radius, transparent background) so it reads as text
   inside the composer, not a form widget. `ParamControl.jsx` is one such control, used twice.
4. Send: `.btn .btn-primary`, label "Send", disabled while `isGenerating` or when nothing would be sent.
   Enter sends, Shift+Enter makes a newline.
5. Delete `TypeGoalControls.jsx` once nothing imports it.

---

## Rules while you work

- Do not read or import the other Claude's files. If you need something from that half, it goes through
  `AIChat.jsx`, which means `REQUEST(Claude 1)`.
- Do not change `AIChat.jsx` to make your half fit. File the request instead.
- Do not add state that belongs in the shell. Both components are presentational: props in, callbacks out.
  Local UI state (textarea height, an open `<details>`) is fine.
- Every color from `tokens.css`. No hex, no rgba, no new glow values.
- Run `npm run build` before you report done.

## Done means

- The tab reads as a chat window: thread above, one composer box pinned below.
- Reel type and goal live inside that composer box, not in a card of their own.
- Sending appends a user turn, then an assistant turn with idea cards and the collapsed prompt.
- Zero rounded corners, zero borders, glow tokens only, Poppins only.
- `getPerformanceInsights`, `buildPrompt`, and `generateIdeas` are called exactly as they are today.
