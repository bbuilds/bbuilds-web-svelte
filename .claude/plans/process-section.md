# Process Section — Implementation Plan

## Context

The site is being rebuilt from a Claude Design handoff in `llm_docs/brandenbuilds-claude-design/`. Hero and Services are already in place ([+page.svelte](../../src/routes/+page.svelte)). The next section — Process — is currently labeled `04.process` in the design source, but since the Stack section hasn't been built yet, on the live page it becomes section **03**. This change implements that section as a new Svelte 5 component, faithful to the design but using Tailwind utilities over scoped CSS wherever practical.

The design is an animated, dark-background ("ink-bg") section with four phase cards (Discover → Research → Create → Ship) that auto-advance every 4.2s on a loop, a git-branch SVG above the cards reflecting active state, a spinning "iterate" loop badge, and dot navigation.

## Source references

- Design React component: [sections.jsx:403-528](../../llm_docs/brandenbuilds-claude-design/project/sections.jsx#L403-L528)
- Phase data array: [sections.jsx:95-116](../../llm_docs/brandenbuilds-claude-design/project/sections.jsx#L95-L116)
- Design CSS (process block): [index.html:225-301](../../llm_docs/brandenbuilds-claude-design/project/index.html#L225-L301)
- Responsive rules: [index.html:331-348](../../llm_docs/brandenbuilds-claude-design/project/index.html#L331-L348)

## What to build

### 1. New component: `src/lib/components/Process.svelte`

**Data** — top of `<script lang="ts">`, mirror the design exactly:

```ts
const PROCESS = [
	{ n: '01', title: 'Discover', copy: 'Aligning on the actual problem...' },
	{ n: '02', title: 'Research', copy: 'Survey the landscape...' },
	{ n: '03', title: 'Create', copy: 'Design and build in vertical slices...' },
	{ n: '04', title: 'Ship', copy: 'Production rollout, instrumentation...' }
] as const;
const DURATION = 4200;
```

**State** (Svelte 5 runes):

- `let active = $state(0)` — index of the currently-highlighted card.
- `let paused = $state(false)` — set true on hover over the grid, false on leave.
- `$effect(() => { ... setTimeout ... })` — advances `active` after `DURATION` ms unless `paused`; reads `active` and `paused` so the timer resets on each change. Return a cleanup that calls `clearTimeout`.

**Markup outline:**

```
<section id="process" class="ink-bg relative pt-30 pb-25">
  <div class="container">
    <!-- header: eyebrow "// 03.process" + h2 "How we work together." (teal accent on "work together") + lede + spinning loop badge -->
    <header class="mb-14 flex flex-wrap items-end justify-between gap-8">
      <div>
        <div class="font-mono ... before:content-['●'] before:text-yellow ...">// 03.process</div>
        <h2 class="mt-2 text-paper">How we <span class="text-teal">work together</span>.</h2>
        <p class="mt-3.5 max-w-145 font-mono text-[0.8125rem] leading-[1.7] text-muted-dark">
          Every engagement runs the same loop...
        </p>
      </div>
      <div class="loop-badge ..."><svg ...>...</svg><div>↻ iterative</div></div>
    </header>

    <!-- git-tree SVG (desktop only, hidden md:block on mobile per design responsive rules) -->
    <div class="phase-gittree relative mb-1.5 h-16 hidden md:block" aria-hidden="true">
      <svg ...>{#each [125,375,625,875] as x, i}...{/each}</svg>
      <span class="phase-gittree-label ...">$ git checkout main · ↻ iterate & repeat</span>
    </div>

    <!-- 4 phase cards -->
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-3.5 lg:grid-cols-4"
         onmouseenter={() => paused = true}
         onmouseleave={() => paused = false}>
      {#each PROCESS as p, i (p.n)}
        {@const isActive = i === active}
        {@const isDone = i < active}
        <article class="phase relative flex min-h-60 cursor-pointer flex-col overflow-hidden rounded-[0.875rem] border border-white/8 bg-white/[0.025] px-5.5 pt-5.5 pb-5.5 transition ..."
                 class:is-active={isActive}
                 class:is-done={isDone}
                 style="--i: {i}"
                 onclick={() => active = i}>
          <header class="mb-7 flex items-center">
            <span class="phase-no font-mono text-[0.6875rem] ...">{p.n}</span>
          </header>
          <h3 class="font-medium text-[1.75rem] tracking-[-0.02em] text-paper">{p.title}</h3>
          <p class="mt-2.5 mb-5.5 flex-1 font-mono text-[0.78125rem] leading-[1.65] text-[#cfc4ad]">{p.copy}</p>
          <div class="phase-track absolute inset-x-0 bottom-0 h-[0.1875rem] bg-white/[0.06]" aria-hidden="true">
            <div class="phase-fill h-full bg-gradient-to-r from-yellow to-[#ffd982] ..."
                 style="width: {isActive || isDone ? '100%' : '0%'};
                        transition: {isActive ? `width ${DURATION}ms linear` : isDone ? 'none' : 'width 0.35s ease'}"></div>
          </div>
        </article>
      {/each}
    </div>

    <!-- dot navigation -->
    <div class="phase-dots mt-6 flex items-center justify-center gap-3.5 font-mono text-[0.6875rem] text-muted-dark" role="tablist" aria-label="process step">
      {#each PROCESS as p, i (p.n)}
        <button type="button"
                class:on={i === active}
                class="rounded-full border border-white/20 px-3 py-[0.3125rem] ..."
                onclick={() => active = i}
                aria-label={`go to step ${p.n} ${p.title}`}>
          <span>{p.n}</span>
        </button>
      {/each}
      <span class="phase-dot-loop ml-1.5 inline-block text-sm text-yellow" aria-hidden="true">↻</span>
    </div>
  </div>
</section>
```

**What stays in a Svelte `<style>` block** (Tailwind can't express these cleanly):

- `@keyframes spin` (28s linear infinite) applied to `.loop-badge svg`, the git-tree icon, and `.phase-dot-loop`.
- `@keyframes phase-enter` (initial fade-up entry on `.phase`, delayed by `--i * 90ms`).
- `.phase.is-active` background/border/box-shadow tint (yellow glow), and `.phase.is-done` border tweak.
- `.phase-no::before` 8px circle dot, plus its active/done color swaps.
- `.phase-gittree-label` absolutely-positioned, ink-background pill that sits centered over the SVG line.
- `.phase-dot.on` filled-yellow active state.

Everything else (layout, spacing, typography, container, dark bg) uses Tailwind utilities and the existing `.ink-bg` / `.container` / `text-paper` / `text-yellow` / `text-teal` / `text-muted-dark` / `font-mono` tokens already in [src/lib/styles/design.css](../../src/lib/styles/design.css).

**Sizing reminder**: every dimensional value (Tailwind arbitrary values like `text-[0.8125rem]`, custom CSS in `<style>`, inline SVG `width`/`height` attributes if you choose to expose them) must be rem, not px. SVG `viewBox`/coordinate numbers are unitless and stay as-is.

### 2. Wire it into the page

[src/routes/+page.svelte](../../src/routes/+page.svelte) — add the import and place it after `<Services />`:

```svelte
<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import Services from '$lib/components/Services.svelte';
	import Process from '$lib/components/Process.svelte';
</script>

<Hero />
<Services />
<Process />
```

The mobile bottom nav already links to `/#process` ([BottomNav.svelte:70](../../src/lib/components/BottomNav.svelte#L70)), so the anchor will start working as soon as the section mounts.

### 3. Tests: `src/lib/components/Process.svelte.spec.ts`

Mirror the shape of [Services.svelte.spec.ts](../../src/lib/components/Services.svelte.spec.ts) (browser project, `vitest-browser-svelte`):

- renders the eyebrow `// 03.process`
- renders the h2 matching `/how we work together/i`
- renders the lede matching `/every engagement runs the same loop/i`
- renders all four phase titles as h3s (Discover, Research, Create, Ship)
- first phase is active by default — assert `aria-pressed` or a `.is-active` class on the first card
- clicking a different phase makes it active and deactivates the first
- clicking a dot in the dot-nav row activates that phase

Note: the auto-advance `$effect` runs in the browser test env, so use click flows rather than waiting on the timer. Simplest: assert via direct click and use a class/`aria-current` rather than timing.

## Use existing primitives

- `.ink-bg` and `.container` — [src/lib/styles/design.css:135-177](../../src/lib/styles/design.css#L135-L177)
- Tailwind theme tokens: `text-paper`, `text-yellow`, `text-teal`, `text-ink`, `text-muted-dark`, `text-charcoal`, `font-mono` — [src/lib/styles/design.css:7-25](../../src/lib/styles/design.css#L7-L25)
- The eyebrow pattern `font-mono text-sm ... before:content-['●']` is reused verbatim from Services ([Services.svelte:117-121](../../src/lib/components/Services.svelte#L117-L121))
- Section padding convention `pt-30 pb-25` matches Services' rhythm ([Services.svelte:114](../../src/lib/components/Services.svelte#L114))

## Svelte MCP usage

Per [CLAUDE.md](../../CLAUDE.md) and the project's Svelte MCP guidance, before finalizing the component:

1. Call `mcp__svelte__list-sections` once to confirm the right docs sections (especially `$effect` cleanup semantics and `class:` directive usage).
2. Fetch relevant sections with `mcp__svelte__get-documentation`.
3. After writing `Process.svelte`, run it through `mcp__svelte__svelte-autofixer` and iterate until clean.

## Verification

1. `npm run dev` — open `http://localhost:5173/`, scroll to the process section, verify:
   - dark background with the noise/radial-gradient overlay
   - eyebrow reads `// 03.process`, h2 reads "How we work together." with "work together" in teal
   - spinning loop badge in the header (rotates over ~28s)
   - desktop only: git-tree SVG above the cards with 4 nodes; active node yellow, done nodes green
   - 4 cards auto-advance every ~4.2s, progress bar fills smoothly on the active card, completed cards stay filled in a muted green
   - hovering the grid pauses the cycle; mouseleave resumes
   - clicking a card or a numbered dot jumps to that phase and the progress bar resets correctly
   - resize to <768px: git-tree hides, cards stack 1 column (then 2 cols on md, 4 on lg)
   - mobile bottom-nav "process" link scrolls here and highlights
2. `npm run check` — no type errors.
3. `npm run lint` — prettier + eslint clean.
4. `npm run test:unit -- --run src/lib/components/Process.svelte.spec.ts` — all assertions pass.
5. `npm run test:unit -- --run` — full suite still green (Services tests, etc).

## Files touched

- **new**: [src/lib/components/Process.svelte](../../src/lib/components/Process.svelte)
- **new**: [src/lib/components/Process.svelte.spec.ts](../../src/lib/components/Process.svelte.spec.ts)
- **edit**: [src/routes/+page.svelte](../../src/routes/+page.svelte) — import + render `<Process />` after `<Services />`
