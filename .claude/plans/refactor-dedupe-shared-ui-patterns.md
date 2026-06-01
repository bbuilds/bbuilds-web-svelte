# Refactor Pass: Dedupe shared UI patterns

## Context

Continuing the ongoing refactoring effort (recent commits cleaned up duplicated SVGs and dead
code). A sweep of the codebase surfaced four repeated patterns that are copy-pasted across many
components with small variations. Consolidating them reduces maintenance surface, makes the design
language consistent, and modernizes a few hand-rolled bits. The large per-pillar illustration files
(`services/illustrations/*`, ~5,800 lines) are **out of scope** for this pass by decision.

Svelte version is **5.55** (runes forced project-wide). All new components must pass the
`svelte-autofixer` MCP tool. All sizes in `rem`, never `px` (per CLAUDE.md / memory).

---

## A — Shared `<Eyebrow>` label component

**Problem:** The mono-uppercase eyebrow with a yellow `●` dot is duplicated 6× in two different
implementations (Tailwind `before:content-['●']` vs a `.meta-dot` CSS class):

- [SectionHeader.svelte:37-41](src/lib/components/SectionHeader.svelte#L37-L41) — renders eyebrow inline, optional `// ` prefix
- [home/Quote.svelte:15-19](src/lib/components/home/Quote.svelte#L15-L19) — `// 04.proof`
- [home/Process.svelte:36-39](src/lib/components/home/Process.svelte#L36-L39) — `text-muted-dark` (dark bg)
- [home/Hero.svelte:78-82](src/lib/components/home/Hero.svelte#L78-L82) — `flex items-center` + `md:text-base`
- [services/Pillars.svelte:24](src/lib/components/services/Pillars.svelte#L24) + `.meta-dot` style at L70-74
- [services/OtherServices.svelte:22](src/lib/components/services/OtherServices.svelte#L22) + `.meta-dot` style at L122-126

**Approach:** Create `src/lib/components/Eyebrow.svelte` rendering the dot + label. Props:

```ts
interface Props {
	text?: string; // label text (or use children snippet)
	prefix?: boolean; // prepend "// " (default false)
	tone?: 'light' | 'dark'; // text-muted vs text-muted-dark (default 'light')
	class?: string; // caller overrides (size/tracking/margin/flex)
	children?: Snippet; // alternative to text
}
```

Base classes: `font-mono uppercase tracking-wider before:mr-2 before:text-yellow before:content-['●']`
plus tone-derived color; `class` is appended last so callers can override size (`text-sm` vs
`text-[0.8125rem]` vs `md:text-base`), tracking, and spacing (`mb-7`, `mb-4`).

- Refactor `SectionHeader` to render `<Eyebrow>` (replacing its inline `{#if eyebrow}` block, keeping the `eyebrowPrefix` → `prefix` mapping).
- Replace the inline eyebrow markup in Quote, Process, Hero.
- Replace `.meta-dot` divs in Pillars and OtherServices, and **delete** the now-unused `.meta-dot` `<style>` blocks in both.

Note: Process uses `tone="dark"`. Hero needs `class="flex items-center ... md:text-base"`.

---

## B — Shared reduced-motion helper

**Problem:** `window.matchMedia('(prefers-reduced-motion: reduce)')` is hand-rolled in 4 places:

- [home/Hero.svelte:40](src/lib/components/home/Hero.svelte#L40) (onMount, one-shot read)
- [svgs/illustrations/FallingLeaves.svelte:5](src/lib/components/svgs/illustrations/FallingLeaves.svelte#L5) (one-shot read)
- [error/ErrorTerminal.svelte:12](src/lib/components/error/ErrorTerminal.svelte#L12) and the per-slot helper (one-shot read)
- [Footer.svelte:79,107](src/lib/components/Footer.svelte#L79-L114) — **special case: this one _subscribes_** to `mq.addEventListener('change', start)` to restart the animation when the user toggles the OS setting

**Approach:** Three of the four (Hero, FallingLeaves, ErrorTerminal) are **one-shot reads** inside
attachments / `onMount` (client-only), not reactive subscriptions. Add a tiny client-safe util:

```ts
// src/lib/utils/motion.ts
export const prefersReducedMotion = (): boolean =>
	typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

Replace those 3 call sites: `const mq = window.matchMedia(...)` → use `prefersReducedMotion()`
directly where `mq.matches` was read. Add a `motion.spec.ts` (server project) covering the
`typeof window` guard.

**Leave Footer as-is** (or only swap its initial read): it genuinely listens for `change` events
and re-runs `start()`, so collapsing it to the one-shot helper would drop that live behavior. If you
want to modernize it, that's a `createSubscriber` job (see Phase E), not this helper.

> Not using `MediaQuery` from `svelte/reactivity`: it's for _reactive_ reads inside effects, and a
> module-level instance would call `matchMedia` during SSR import and crash. These sites only need a
> one-time boolean. Note this rationale so it isn't "modernized" incorrectly later.

---

## C — Shared `<Icon>` base for stroke icons

**Problem:** 7 stroke icons repeat an identical SVG wrapper, differing only in inner paths:
Blog, Close, Copy, Mail, Process, Search, Tools (all in
[svgs/icons/](src/lib/components/svgs/icons/)). Each is `viewBox="0 0 24 24" fill="none"
stroke="currentColor" stroke-width="2" stroke-linecap/linejoin="round" aria-hidden class={...}`.

**Approach:** Create `src/lib/components/svgs/icons/Icon.svelte`:

```ts
interface Props {
	class?: string;
	viewBox?: string; // default '0 0 24 24'
	children: Snippet; // the inner <path>/<line>/<circle> elements
}
```

Renders the shared stroke `<svg>` wrapper with `{@render children()}`. Each of the 7 stroke icons
becomes a thin wrapper:

```svelte
<script lang="ts">
	import Icon from './Icon.svelte';
	let { class: className = 'h-5 w-5' }: Props = $props();
</script>

<Icon class={className}>
	<path d="..." />
</Icon>
```

Keep each icon's existing default `class` value. **Leave the fill icons as-is** (Logo, LinkedIn,
Twitter, LinkIcon, QuoteMark use `fill="currentColor"`, different viewBoxes — not enough shared
shape to justify forcing them through the wrapper).

---

## D — Extract Storyblok richtext traversal into a util

**Problem:** Richtext tree-walking is spread out and partly duplicated:

- `collectText` lives in [format.ts:10-13](src/lib/utils/format.ts#L10-L13)
- [home/Services.svelte:17-37](src/lib/components/home/Services.svelte#L17-L37) hand-walks
  `bullet_list → list_item → paragraph → text` runs (with bold/link marks) inline in the component

**Approach:** Create `src/lib/utils/richtext.ts` operating on a minimal structural node type
(compatible with both `RichTextNode` from [post.ts](src/lib/types/post.ts) and `StoryblokRichtext`):

- Move `collectText` here; re-export from `format.ts` (or update format.ts imports) so existing
  callers/tests keep working.
- Add `parseListItems(doc)` (lifted from Services.svelte) returning `{ runs: { text, bold, href }[] }[]`.
- Refactor `Services.svelte` to import `parseListItems` from the util; drop the inline `Run`/`Item`
  types and the local function.
- Add `richtext.spec.ts` (server project) covering `collectText` and `parseListItems` (bold marks,
  link marks, empty/missing content).

Keep the renderer components (`RichTextRenderer`, `RichTextText`) as-is — their per-node markup
mapping is presentational and not duplicated elsewhere. This step is purely about lifting the
**parsing** logic out of the component into a tested util. Watch type friction between the two node
shapes — prefer a small structural interface over `as` casts (per annotations-over-assertions memory).

---

## E — Best-practice alignment (from `/svelte-core-bestpractices` review)

A review against the core best practices found the codebase already clean of legacy syntax and using
modern idioms (`{@attach}`, self-import recursion, `$derived`, clsx class arrays;
[BottomNav.svelte](src/lib/components/BottomNav.svelte) is the model — `<svelte:window bind:scrollY>`

- `$derived.by`). Three actionable deviations remain:

**E1 — Manual `window` listeners in `$effect` → `<svelte:window>`** (best practice: don't use
`onMount`/`$effect` to attach window/document listeners):

- [ReadingProgress.svelte:4-17](src/lib/components/posts/ReadingProgress.svelte#L4-L17) — replace the
  scroll/resize effect with `<svelte:window bind:scrollY bind:innerHeight />` and compute `progress`
  as a `$derived` (reads `document.body.scrollHeight`/`documentElement.scrollHeight` + `scrollY`).
  Eliminates the effect entirely.
- [TableOfContents.svelte:12-35](src/lib/components/posts/TableOfContents.svelte#L12-L35) — replace
  with `<svelte:window onscroll={update} onresize={update} />`. Keep an initial `update()` call
  (e.g. via a one-line `$effect` that just runs it once, or compute `active` as a `$derived` of
  `scrollY` bound from `<svelte:window>`). Prefer the `$derived` form if clean.

**E2 — `document` keydown listener in `$effect` → `<svelte:document>`**:

- [SuccessBanner.svelte:18-30](src/lib/components/SuccessBanner.svelte#L18-L30) — replace with
  `<svelte:document onkeydown={...} />`. **Keep** the auto-dismiss timer effect (L6-16) — that's a
  legitimate timer effect.

**E3 — `class:` directive → clsx-style array** (best practice prefers clsx arrays over `class:`):

- [SuccessBanner.svelte:38](src/lib/components/SuccessBanner.svelte#L38) — `class:visible={...}` →
  `class={['toast …', { visible: banner.visible }]}` (only `class:` directive in the repo).

**Noted but no action** (deliberate / acceptable):

- Index-keyed `{#each}` blocks (Services runs/items, RichTextRenderer, SEO jsonLd, SVG geometry
  arrays) — these never reorder and lack stable IDs, so index keys are acceptable here.
- [banner.svelte.ts](src/lib/state/banner.svelte.ts) module-level `$state` — best practice suggests
  context to avoid cross-user leakage under SSR. Low risk here (mutated only client-side), but if we
  ever set it server-side, migrate to context with a root-layout provider. Left as a known trade-off.

Validate each edited component with `svelte-autofixer` until clean.

---

## Execution order

1. **B** (util + 3 swaps; Footer left as-is) — smallest, isolated.
2. **C** (Icon base + 7 wrappers).
3. **A** (Eyebrow component + 6 call sites + delete 2 `.meta-dot` styles).
4. **D** (richtext util + Services refactor + tests).
5. **E** (svelte:window / svelte:document / class-array fixes).

Each step is independent; commit per step.

## Verification

- Run `svelte-autofixer` MCP on every new/edited `.svelte` file (`Eyebrow`, `Icon`, the icon
  wrappers, Services, SectionHeader, Quote, Process, Hero, Pillars, OtherServices, and the Phase E
  files: ReadingProgress, TableOfContents, SuccessBanner) until clean.
- `npm run check` — type checking (svelte-check).
- `npm run lint` — prettier + eslint.
- `npm run test:unit -- --run` — full unit suite, incl. new `motion.spec.ts` and `richtext.spec.ts`
  and existing `format.spec.ts` / `Services.svelte.spec.ts` (must still pass).
- `npm run dev` and visually confirm: home page eyebrows (hero/services/process/proof), contact
  section, services pillars + "other pillars", 404 terminal animation, footer, and falling leaves
  all render and animate as before (and respect reduced-motion when toggled in OS settings).
- Phase E checks: scroll the blog post page — reading-progress bar fills and the table-of-contents
  active heading highlights on scroll/resize as before; submit the contact form and press `Escape`
  to confirm the success banner still dismisses; toggle reduced-motion and confirm the banner
  transition is suppressed.
