# Services Section — Chapter Variant

## Context

The hero is built and shipped. The next static section is **Services**, rendered as the "chapter" accordion variant from the design canvas at [llm_docs/brandenbuilds-claude-design/project/brandenbuilds-claude-design/project/sections.jsx](../../llm_docs/brandenbuilds-claude-design/project/brandenbuilds-claude-design/project/sections.jsx). The screenshot in chat shows tab-switchers (`chapters | editor | cards | timeline`) — those are part of the design's variant explorer and will **not** ship to production; only the `chapters` rendering does.

The section answers "what I build for you" with five numbered practices. Each row is a click-to-toggle accordion. One open at a time; first row open by default. Source data (5 practices × ~4 items each) lives in `sections.jsx` lines 3-66 and gets copied verbatim into the new Svelte component.

Constraints: Svelte 5 runes mode (forced project-wide), Tailwind v4 utilities preferred over custom CSS, rem everywhere (px is banned by CLAUDE.md including in Tailwind arbitrary values).

---

## Files

| File                                                                                           | Action                                              |
| ---------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| [src/lib/components/Services.svelte](../../src/lib/components/Services.svelte)                 | **Create** — section component                      |
| [src/lib/components/Services.svelte.spec.ts](../../src/lib/components/Services.svelte.spec.ts) | **Create** — tests                                  |
| [src/routes/+page.svelte](../../src/routes/+page.svelte)                                       | **Modify** — render `<Services />` below `<Hero />` |

Reference patterns to mirror:

- [src/lib/components/Hero.svelte](../../src/lib/components/Hero.svelte) — section composition, eyebrow pattern, scoped style usage, `paper-bg` wrapping
- [src/lib/components/Hero.svelte.spec.ts](../../src/lib/components/Hero.svelte.spec.ts) — `vitest-browser-svelte` shape
- [src/lib/styles/design.css](../../src/lib/styles/design.css) — tokens (`text-yellow`, `text-ink`, `text-muted`, `text-charcoal`, `text-body`, `font-mono`, `border-paper-line`, `.paper-bg`, `.container`)

---

## Component Design — Services.svelte

### Data

Top-level `const SERVICES` array copied verbatim from `sections.jsx` lines 3-66. Five practices with `{ n, title, sub, items: [{ b, t }] }`. Use `as const`. Drop the `file` field (used by the editor variant only).

### State

```ts
let openIdx = $state(0);
function toggle(i: number) {
	openIdx = openIdx === i ? -1 : i;
}
```

Single index, `-1` = none open. First chapter open by default.

### Markup outline

```svelte
<section id="services" class="paper-bg relative pt-30 pb-25">
	<div class="container">
		<!-- section head: eyebrow + h2 + lede (no tab bar) -->
		<div class="mb-12">
			<div
				class="font-mono text-sm tracking-[0.06em] text-muted uppercase
                  before:mr-2 before:text-yellow before:content-['●']"
			>
				// 02.services
			</div>
			<h2 class="mt-2">What I build for you.</h2>
			<p class="mt-3.5 max-w-140 font-mono text-[0.8125rem] leading-[1.7] text-charcoal">
				Five practices, one operator. Pick a layer or hand me the whole stack.
			</p>
		</div>

		<!-- chapter list -->
		<div class="border-t border-ink">
			{#each SERVICES as s, i (s.n)}
				{@const isOpen = openIdx === i}
				{@const bodyId = `chapter-body-${s.n}`}
				{@const titleId = `chapter-title-${s.n}`}
				<div class="relative overflow-hidden border-b border-ink">
					<button
						type="button"
						onclick={() => toggle(i)}
						aria-expanded={isOpen}
						aria-controls={bodyId}
						class="ease grid w-full cursor-pointer grid-cols-[3.75rem_1fr_auto] items-center
                   gap-6 px-1 py-[1.125rem]
                   text-left transition-[padding,background] duration-[350ms]
                   hover:bg-yellow/12 hover:pl-[1.75rem]
                   focus-visible:outline-2
                   focus-visible:-outline-offset-2 focus-visible:outline-ink aria-expanded:pb-2
                   md:grid-cols-[5rem_1fr_auto] md:px-2 md:py-[1.625rem] md:aria-expanded:pb-2"
					>
						<span class="font-mono text-[0.875rem] text-muted">{s.n}</span>
						<h3 id={titleId} class="text-[clamp(1.75rem,3vw,3rem)] font-medium tracking-[-0.02em]">
							{s.title}
						</h3>
						<span aria-hidden="true" class="font-mono text-[0.75rem] text-muted">
							[{isOpen ? '−' : '+'}]
						</span>
					</button>

					<div
						id={bodyId}
						role="region"
						aria-labelledby={titleId}
						data-open={isOpen}
						class="chapter-body px-2"
					>
						<div>
							<div
								class="grid grid-cols-1 gap-[1.125rem] pt-2 pb-8
                          md:grid-cols-2 md:pl-[6.5rem]"
							>
								{#each s.items as it (it.b)}
									<div
										class="grid grid-cols-[1.125rem_1fr] gap-2.5
                              font-mono text-[0.78125rem] leading-[1.6] text-body"
									>
										<span aria-hidden="true" class="font-bold text-yellow">+</span>
										<span><b class="font-bold text-ink">{it.b}.</b> {it.t}</span>
									</div>
								{/each}
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.chapter-body {
		display: grid;
		grid-template-rows: 0fr;
		transition:
			grid-template-rows 0.5s ease,
			opacity 0.35s ease;
		opacity: 0;
	}
	.chapter-body[data-open='true'] {
		grid-template-rows: 1fr;
		opacity: 1;
	}
	.chapter-body > div {
		overflow: hidden;
		min-height: 0;
	}
</style>
```

### Why these choices

1. **Collapse animation = `grid-template-rows: 0fr → 1fr` trick**, not `max-height`. The design's `max-height: 560px` is a guess that breaks once items reflow to 1 column on mobile (Engineering and Intelligence have 5 items × mono text height easily exceeds 560px). Grid-rows adapts to natural content height. Required browsers: Chrome 117+ / Safari 17.4+ / Firefox 119+ — all 2023+. The `min-height: 0` on the inner grid child is critical; without it the row won't collapse (default `min-height: auto` overrides `0fr`).

2. **Trigger is a real `<button>`**, not a clickable `<div>`. The grid layout applies directly to the button. Gets `aria-expanded` / `aria-controls`, keyboard support, focus ring (offset inward so it doesn't overlap the ink borders).

3. **Body is always in the DOM** (good for SEO and `aria-controls`); only its grid track collapses.

4. **The `+` bullet is a real `<span>`**, not a `::before` pseudo. Lets it participate in the grid and stay aligned without absolute positioning.

5. **Mobile-first responsive**: 1-column items below `md` (48rem), 2-column at `md`+. Smaller num column (`3.75rem`) and tighter padding on mobile, design's `5rem` / `26px` at `md`+. The design's 980px breakpoint is approximated as Tailwind's 48rem `md:` — close enough for this site; full-fidelity 980px would need `max-[61.25rem]:` arbitrary variants and isn't worth it.

6. **`bg-yellow/12` opacity-slash** = Tailwind v4 native syntax for `rgba(255,205,103,0.12)`. No arbitrary value or scoped CSS needed.

7. **Custom CSS budget = ~12 lines total** — only the grid-rows animation. Everything else is utilities.

8. **All design-spec animations preserved**:
   - Row hover transition: `padding .35s, background .35s` → `transition-[padding,background] duration-[350ms] ease` with `hover:pl-[1.75rem] hover:bg-yellow/12`
   - Body open transition: `max-height .5s, opacity .35s` → grid-rows `0fr → 1fr` over 0.5s + opacity `0 → 1` over 0.35s (scoped CSS)
   - Body padding `0 8px → 8px 8px 32px` on open: preserved via static outer `px-2` + inner grid `pt-2 pb-8` (clipped while collapsed by `overflow-hidden` + `min-height: 0` on inner)
   - Row's bottom padding collapse on open (`.chapter.open .row { padding-bottom: 8px }`): driven by Tailwind's `aria-expanded:` variant — `aria-expanded:pb-2 md:aria-expanded:pb-2` on the button. This pulls the open title visually closer to its content, exactly as in the design.
   - `[+]` ↔ `[−]` toggle character swap: direct template expression, no animation (matches design).

### rem conversions used

| Design px          | rem        | Tailwind                                                        |
| ------------------ | ---------- | --------------------------------------------------------------- |
| 120 pt / 100 pb    | 7.5 / 6.25 | `pt-30 pb-25`                                                   |
| 80 / 60 num col    | 5 / 3.75   | `md:grid-cols-[5rem_1fr_auto]` / `grid-cols-[3.75rem_1fr_auto]` |
| 26/8 px row pad    | 1.625/0.5  | `md:py-[1.625rem] md:px-2`                                      |
| 18/4 row pad mob   | 1.125/0.25 | `py-[1.125rem] px-1`                                            |
| 28 hover pad-left  | 1.75       | `hover:pl-[1.75rem]`                                            |
| 14 num font        | 0.875      | `text-[0.875rem]`                                               |
| 12 toggle          | 0.75       | `text-[0.75rem]`                                                |
| 12.5 item          | 0.78125    | `text-[0.78125rem]`                                             |
| 13 lede            | 0.8125     | `text-[0.8125rem]`                                              |
| 18 item gap        | 1.125      | `gap-[1.125rem]`                                                |
| 104 items pl       | 6.5        | `md:pl-[6.5rem]`                                                |
| 560 max lede       | 35         | `max-w-140`                                                     |
| 8 row pad-bot open | 0.5        | `aria-expanded:pb-2 md:aria-expanded:pb-2`                      |

---

## Page wiring — +page.svelte

```svelte
<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import Services from '$lib/components/Services.svelte';
</script>

<Hero />
<Services />
```

The `id="services"` on the section makes existing `<a href="#services">` anchors (Header, BottomNav) land here without further wiring.

---

## Tests — Services.svelte.spec.ts

Same browser env / `vitest-browser-svelte` shape as `Hero.svelte.spec.ts`. Cases:

1. Renders the eyebrow text `// 02.services`
2. Renders the h2 `What I build for you.`
3. Renders the lede containing `Five practices, one operator`
4. Renders all five practice titles as `<h3>`s (Discovery & Architecture, Product Engineering, Applied Intelligence, Identity & Experience, Continuity & Growth)
5. First practice is open by default — its trigger has `aria-expanded="true"`
6. Clicking a different practice opens it and closes the first (only one open at a time)
7. Clicking an open practice closes it (toggle off)

The accessible name on the trigger button comes from its `<h3>` descendant, so `page.getByRole('button', { name: /discovery & architecture/i })` works.

---

## Verification

1. `npm run check` — svelte-check passes
2. `npm run lint` — prettier + eslint clean
3. `npm run test:unit -- --run src/lib/components/Services.svelte.spec.ts` — all tests pass
4. `npm run dev` smoke test in browser:
   - Section renders below Hero with proper spacing
   - First practice (Discovery) is open on load
   - Click practices 02-05 — each opens, prior closes, smooth slide animation (~0.5s)
   - Click open practice twice → closes
   - **When a chapter opens, the row's bottom padding visibly shrinks** (title hugs its content) — matches design's `.chapter.open .row { padding-bottom: 8px }`
   - Hover a row (closed or open) → 350ms transition: yellow tint at 12% + padding-left shifts 8 → 28px
   - Resize to ~24rem viewport → items go single-column, num col shrinks, padding-left disappears
   - Keyboard Tab through chapters; Enter/Space toggles; focus ring visible inside row
5. `npm run test:unit -- --run` — full unit suite (confirm no Hero regression)

---

## Gotchas

- **`min-height: 0` on the inner grid child is mandatory** — silent failure of the grid-rows trick if omitted.
- **Don't put `cursor:pointer` on the outer wrapper** — only the button. Clicking item text inside an open body shouldn't toggle.
- **`overflow-hidden` on the chapter wrapper div** is needed to clip the hover-padding-shift transition (keeps content from peeking out on the left during the move).
- **No SSR flash**: `$state(0)` is synchronous; the first chapter's `aria-expanded` and `data-open` render correctly on the server pass.
- The original design used hover-only `.is-open` on the AgencyServices variant — we are **not** porting that; this is click-toggle per the chapter design's `[+]` / `[−]` affordance.
- **`aria-expanded:` is a Tailwind v4 native variant** — it matches `[aria-expanded="true"]`. The button's `aria-expanded` attribute is set from `isOpen` so both a11y and the open-state styles (`pb-2`) come from the same source of truth. No `class:` directive or class concatenation needed.
- **350ms is not a Tailwind preset duration** — must use arbitrary value `duration-[350ms]`. The preset `duration-300` is 50ms faster and would not match the design's `.35s ease` transitions exactly.
