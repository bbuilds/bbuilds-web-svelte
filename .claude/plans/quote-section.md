# Static Quote Section — Implementation Plan

## Context

The home page currently ends at the Process section. The design reference includes a `// 03.proof` testimonials block (carousel of 3 quotes) right after Process — but for this iteration we want **one static quote with no slider, no dots, no rotation timer**. It serves as social proof, breaks up the page rhythm after the dark Process section by returning to the paper background, and gives visitors a credibility anchor before whatever comes next.

The component follows the same conventions as the existing section components ([Hero](../../src/lib/components/Hero.svelte), [Services](../../src/lib/components/Services.svelte), [Process](../../src/lib/components/Process.svelte)): Svelte 5 runes, scoped `<style>` block, `.paper-bg` / `.container` utilities from [design.css](../../src/lib/styles/design.css), rem everywhere.

## Approach

- **Static, no CMS.** Hard-code the quote, attribution name, and role at the top of the component as a plain const. Skip the Storyblok `content` prop pattern — this is intentionally static for now.
- **No carousel.** No `active`/`paused` state, no `$effect` timer, no dots row. Just: eyebrow → quote glyph SVG → blockquote → attribution line.
- **Component owns its styles.** Hero / Services / Process all keep section-specific styles in their own `<style>` block while using shared utilities (`.paper-bg`, `.container`, `.scribble`) from `design.css`. Follow that pattern — don't bloat `design.css` with `.quote-*` rules.

## Source references

- Design React component: [sections.jsx:453-531](../../llm_docs/brandenbuilds-claude-design/project/sections.jsx#L453-L531) — note the design has a carousel; we render only the single-quote shape.
- Design CSS (testimonials block): [index.html:320-371](../../llm_docs/brandenbuilds-claude-design/project/index.html#L320-L371)

## Files to modify / create

- **new**: [src/lib/components/Quote.svelte](../../src/lib/components/Quote.svelte) — singular noun matches Hero / Services / Process
- **new**: [src/lib/components/Quote.svelte.spec.ts](../../src/lib/components/Quote.svelte.spec.ts) — browser project, `vitest-browser-svelte`
- **edit**: [src/routes/+page.svelte](../../src/routes/+page.svelte) — import `Quote` and render `<Quote />` after `<Process />`

## Content (decided)

- **Eyebrow**: `// 04.proof` — renumbered from the design's `03.proof` to avoid collision with Process's `03.process`.
- **Quote body** (~4 sentences, preserves the "thinking a few steps ahead / future-proofs" beat):

  > "I've had the chance to work with Branden for 4+ years. Everything he touches is thoughtful, scalable, and intentionally set up to last. He's always thinking a few steps ahead, which means his work doesn't just solve the immediate need — it actually future-proofs whatever we're building so we're not backtracking later. Reliable, collaborative, and consistently raises the bar."

- **Attribution**: Kat Williams · Sr. Manager, Digital Experience at The Trade Desk
- **Name links out** to the LinkedIn recommendations page in a new tab (`target="_blank"`, `rel="noopener noreferrer"`).

## Component structure

```svelte
<script lang="ts">
	const QUOTE = {
		body: "I've had the chance to work with Branden for 4+ years. Everything he touches is thoughtful, scalable, and intentionally set up to last. He's always thinking a few steps ahead, which means his work doesn't just solve the immediate need — it actually future-proofs whatever we're building so we're not backtracking later. Reliable, collaborative, and consistently raises the bar.",
		name: 'Kat Williams',
		role: 'Sr. Manager, Digital Experience at The Trade Desk',
		href: 'https://www.linkedin.com/in/branden-builds/details/recommendations/'
	} as const;
</script>

<section id="proof" class="paper-bg quote-section relative overflow-hidden pt-20 pb-18">
	<div class="quote-inner container">
		<div
			class="mb-7 font-mono text-sm tracking-wider text-muted uppercase before:mr-2 before:text-yellow before:content-['●']"
		>
			// 04.proof
		</div>

		<!-- hand-drawn open-quote glyph -->
		<svg class="quote-glyph" viewBox="0 0 60 60" aria-hidden="true">
			<path
				d="M 14 44 C 6 38, 6 26, 12 18 C 18 12, 26 10, 32 12 L 30 18 C 24 18, 18 22, 16 28 C 22 27, 28 32, 28 38 C 28 44, 22 48, 14 44 Z M 38 44 C 30 38, 30 26, 36 18 C 42 12, 50 10, 56 12 L 54 18 C 48 18, 42 22, 40 28 C 46 27, 52 32, 52 38 C 52 44, 46 48, 38 44 Z"
				fill="none"
				stroke="var(--color-ink)"
				stroke-width="1.4"
				stroke-linejoin="round"
				opacity="0.45"
			/>
		</svg>

		<blockquote class="quote-body">{QUOTE.body}</blockquote>

		<div class="quote-attr">
			<a class="quote-name" href={QUOTE.href} target="_blank" rel="noopener noreferrer">
				<span class="scribble">
					{QUOTE.name}
					<svg viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden="true">
						<path
							d="M2 9 C 40 2, 80 12, 120 6 S 180 10, 198 5"
							stroke="var(--color-yellow)"
							stroke-width="4"
							fill="none"
							stroke-linecap="round"
							opacity="0.9"
						/>
					</svg>
				</span>
			</a>
			<span class="quote-sep">·</span>
			<span class="quote-role">{QUOTE.role}</span>
		</div>
	</div>
</section>
```

Scoped styles cover (in `<style>`):

- `.quote-section::after` — horizon bridge (dotted line + yellow dot) that joins the dark Process slab into the paper. Uses `var(--color-yellow)` and `var(--color-paper-line)`. Lives on `::after` rather than `::before` so it doesn't fight `.paper-bg::before` (the noise overlay).
- `.quote-inner` — centered flex column, `max-width: 52rem`.
- `.quote-glyph` — `2.75rem` square, `0.5rem` bottom margin.
- `.quote-body` — italic mono, `clamp(1rem, 1.55vw, 1.25rem)`, line-height `1.7`, `max-width: 46rem`, `var(--color-ink-soft)`. Runs the `quoteIn` fade-up keyframe on mount.
- `@keyframes quoteIn { from { opacity: 0; transform: translateY(0.5rem) } to { opacity: 1; transform: none } }`.
- `.quote-attr` — mono `0.8125rem`, inline-flex centered row, gap `0.5rem`, `var(--color-charcoal)`.
- `.quote-name` — anchor reset, weight 600, fades to `opacity: 0.75` on hover/focus, yellow focus ring (`0.125rem` solid, `0.25rem` offset).
- `.quote-name :global(.scribble svg)` — overrides the global `.scribble` SVG sizing to the smaller variant (`bottom: -0.5rem`, `height: 0.625rem`) only inside the name.
- `.quote-sep` (`opacity: 0.5`) and `.quote-role` (`var(--color-charcoal)`).

**Notes on tokens:**

- Use `var(--color-*)` not `var(--*)` — `design.css` declares tokens via Tailwind v4 `@theme`, which prefixes them as `--color-yellow`, etc. Same applies to `--font-mono`.
- `:global(.scribble svg)` is needed because `.scribble` is defined in `design.css` (global) — we want to override its SVG sizing only inside `.quote-name`.
- `id="proof"` enables the in-page anchor (matches Process's `id="process"` pattern).

## Wiring into the page

[src/routes/+page.svelte](../../src/routes/+page.svelte):

```svelte
<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import Services from '$lib/components/Services.svelte';
	import Process from '$lib/components/Process.svelte';
	import Quote from '$lib/components/Quote.svelte';
	import type { StoryblokHomePage } from '$lib/types/storyblok';

	let { data } = $props();
	const content = $derived(data.story?.content as StoryblokHomePage | undefined);
</script>

<Hero {content} />
<Services {content} />
<Process />
<Quote />
```

## Tests

[Quote.svelte.spec.ts](../../src/lib/components/Quote.svelte.spec.ts) — browser project, `vitest-browser-svelte`:

- renders the eyebrow `// 04.proof`
- renders the quote body (substring match: `/work with Branden for 4\+ years/i`)
- the attribution name is a link to the LinkedIn recommendations URL with `target="_blank"` and `rel="noopener noreferrer"`
- renders the role string

## Reused utilities (not re-implemented)

- `.paper-bg` — [src/lib/styles/design.css:143](../../src/lib/styles/design.css#L143)
- `.container` — [src/lib/styles/design.css:135](../../src/lib/styles/design.css#L135)
- `.scribble` — [src/lib/styles/design.css:180](../../src/lib/styles/design.css#L180) (we override the SVG sizing locally via `:global`)
- Tailwind v4 color tokens (`--color-yellow`, `--color-ink`, `--color-ink-soft`, `--color-charcoal`, `--color-muted`, `--color-paper-line`) and font tokens (`--font-mono`) from the `@theme` block in `design.css`

## What's NOT in scope

- No Storyblok schema changes, no `+page.server.ts` updates, no type additions
- No carousel state, dots, auto-rotate timer, or pause-on-hover
- No multi-quote data structure (single quote, single hardcoded object)
- No `design.css` edits (component owns its styles)
- No BottomNav update — the mobile nav doesn't currently list a "proof" link and that's a separate decision

## Verification

1. **Visual check**: `npm run dev`, open `localhost:5173`, scroll past Process:
   - Quote section appears after Process on the paper background
   - Horizon bridge (dotted line + yellow dot) sits at the top of the section
   - Quote glyph SVG renders at ~`2.75rem` above the blockquote
   - Blockquote is italic mono, centered, max ~`46rem` wide, plays the `quoteIn` fade-up animation on load
   - Attribution row: scribbled name as a link (opens LinkedIn recommendations in a new tab) · role
   - Hovering / focusing the name fades it to `0.75` opacity; tab-focus shows the yellow outline
   - Eyebrow reads `● // 04.proof` with the yellow dot
2. **Responsive check**: Resize to ≤ `47.9375rem`. Section stays centered, text wraps cleanly, no horizontal scroll.
3. **Type check**: `npm run check` — no svelte-check errors.
4. **Lint**: `npm run lint` — no prettier / eslint issues (the 2 pre-existing warnings in the auto-generated `worker-configuration.d.ts` are unrelated).
5. **Svelte MCP autofixer**: `mcp__svelte__svelte-autofixer` on `Quote.svelte` returns clean (per [CLAUDE.md](../../CLAUDE.md) rule).
6. **Rem rule**: Spot-check no `px` values were introduced in either the new component or the page wiring.

## Files touched

- **new**: [src/lib/components/Quote.svelte](../../src/lib/components/Quote.svelte)
- **new**: [src/lib/components/Quote.svelte.spec.ts](../../src/lib/components/Quote.svelte.spec.ts)
- **edit**: [src/routes/+page.svelte](../../src/routes/+page.svelte) — import + render `<Quote />` after `<Process />`
