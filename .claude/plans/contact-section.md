# Plan: Static Contact section on home page

## Context

The home page (`src/routes/+page.svelte`) currently renders Hero → Services → Process → Quote → Blog. The design files in `llm_docs/brandenbuilds-claude-design/project/` include a `Contact` section ([sections.jsx:674-705](llm_docs/brandenbuilds-claude-design/project/sections.jsx#L674-L705)) — a centered CTA on `paper-bg` with eyebrow, headline (with scribble + handwriting accent), lead copy, a 3-column meta strip (response/timezone/starting), an email button, and two organic plant accents (`Sprout` lower-left, `Leaf` upper-right) that sway. This plan ports it into a new `Contact.svelte` component, drops it onto the home page after `Blog`, and uses Tailwind utilities + existing primitives instead of new CSS classes wherever practical.

The `#contact` anchor is already linked by [Header.svelte:57](src/lib/components/Header.svelte#L57), [BottomNav.svelte:104](src/lib/components/BottomNav.svelte#L104), and [Hero.svelte:162](src/lib/components/Hero.svelte#L162), so the section also satisfies an existing dependency.

## Section number

Existing eyebrows: `02.services`, `03.process`, `04.proof`, `05.writing`. The JSX source calls Contact `05.contact`, but Blog already owns 05 in this codebase. **Use `// 06.contact`**.

## New file

**`src/lib/components/Contact.svelte`** — static section. Structure:

- `<section id="contact" class="paper-bg relative overflow-hidden pt-22 pb-20 text-center">` (matches design's `padding:5.5rem 0 5rem`, centered).
- Eyebrow div using the same pattern other sections use: `font-mono text-sm tracking-wider text-muted uppercase before:mr-2 before:text-yellow before:content-['●']` with text `// 06.contact`.
- `<h2 class="mx-auto mt-4 max-w-[62.5rem]">` containing the heading: `Got a <span class="scribble">vibe<svg .../></span> that needs <span class="font-hand font-bold text-charcoal">hardening</span>?`
  - Scribble SVG mirrors [Quote.svelte:48-57](src/lib/components/Quote.svelte#L48-L57) but uses the wider `viewBox="0 0 200 22"` path from the design (`stroke="var(--yellow)"`, `stroke-width="8"`).
  - `.font-hand` Tailwind utility is already available via the `@theme` token `--font-hand` ([design.css:24](src/lib/styles/design.css#L24)).
- Lead `<p class="mx-auto mt-6 max-w-[38.75rem] font-mono text-sm leading-[1.7] text-body">` with the prototype/deck/napkin copy.
- Meta strip: `<div class="mt-9 flex flex-wrap justify-center gap-x-10 gap-y-4 font-mono text-xs text-charcoal">` containing 3 children — each `<div class="flex flex-col items-center gap-0.5">` with a `<span class="text-[0.625rem] tracking-[0.1em] uppercase text-muted">` label and a `<b class="font-sans text-sm font-medium text-ink">` value. Data: `{ response: '< 24 hrs', timezone: 'PT', starting: 'Q3 ’26' }`.
- CTA row: `<div class="mt-9 flex flex-wrap justify-center gap-3.5">` containing `<Button href="mailto:hi@brandenbuilds.com" variant="primary">hi@brandenbuilds.com →</Button>`. Reuses [Button.svelte](src/lib/components/Button.svelte) — no new button code.
- Two absolutely-positioned plant accents inside the section (siblings to `.container`):
  - **Sprout** (left): `<div aria-hidden="true" class="plant-sway-l pointer-events-none absolute left-[8%] bottom-[-1.25rem] opacity-70">` with the inlined Sprout SVG (translated from [plants.jsx:53-66](llm_docs/brandenbuilds-claude-design/project/plants.jsx#L53-L66), `width: 6.875rem` to match `w={110}`).
  - **Leaf** (right): `<div aria-hidden="true" class="plant-sway-r pointer-events-none absolute right-[10%] top-10 opacity-90">` containing a rotated `<div style="transform: rotate(-25deg)">` wrapping the Leaf SVG (translated from [plants.jsx:3-21](llm_docs/brandenbuilds-claude-design/project/plants.jsx#L3-L21), `width: 4.375rem` to match `w={70}`).
  - On mobile (`md:` breakpoint and below), hide or reduce opacity to keep the section uncluttered — mirror Hero's pattern of `opacity-25 md:opacity-100`.

## Local `<style>` (sway keyframes)

The `sway` keyframes are component-scoped in [Hero.svelte:305-313](src/lib/components/Hero.svelte#L305-L313); they are not global. Add an identical local `@keyframes sway` plus two classes inside Contact's `<style>` block (kept minimal — only animation glue that can't be expressed in Tailwind without arbitrary keyframe definitions):

```css
.plant-sway-l {
	animation: sway 9s ease-in-out infinite;
	transform-origin: bottom center;
}
.plant-sway-r {
	animation: sway 7s ease-in-out -2s infinite reverse;
	transform-origin: top center;
}
@keyframes sway {
	0%,
	100% {
		transform: rotate(-1.5deg);
	}
	50% {
		transform: rotate(1.5deg);
	}
}
@media (prefers-reduced-motion: reduce) {
	.plant-sway-l,
	.plant-sway-r {
		animation: none;
	}
}
```

This is the only style block. Everything else — spacing, typography, colors, flex/grid — uses Tailwind utilities + existing tokens (`text-ink`, `text-charcoal`, `text-body`, `text-muted`, `text-yellow`, `font-mono`, `font-hand`).

## Wire it into the page

Edit `src/routes/+page.svelte`:

```diff
 import Blog from '$lib/components/Blog.svelte';
+import Contact from '$lib/components/Contact.svelte';
...
 <Blog />
+<Contact />
```

## Test (spec file)

Match the existing convention ([Quote.svelte.spec.ts](src/lib/components/Quote.svelte.spec.ts), [Process.svelte.spec.ts](src/lib/components/Process.svelte.spec.ts)). Create `src/lib/components/Contact.svelte.spec.ts` with:

- Renders eyebrow `// 06.contact`.
- Renders the lead copy (substring match on "prototype").
- Renders an email link with `href="mailto:hi@brandenbuilds.com"`.
- Section has `id="contact"` (anchor target works for header/bottom-nav/hero CTA).

## Files modified

- **New**: `src/lib/components/Contact.svelte`
- **New**: `src/lib/components/Contact.svelte.spec.ts`
- **Edit**: `src/routes/+page.svelte` (import + render `<Contact />` after `<Blog />`)

## Things deliberately NOT done

- No CSS class additions to `design.css` — `sway` stays scoped to Contact like it is in Hero.
- No new Button variants — `Button` already has `variant="primary"` matching the design's filled style.
- No data plumbing through `+page.ts` — the content is static per the design and per the brief ("statically").
- No mailto form, no client JS, no `$state`. Section is pure markup.

## Verification

1. `npm run dev` — load `/`, scroll to bottom, confirm section appears after Blog.
2. Click `contact` in header and bottom nav — page should anchor to the new section.
3. Hover the email button — Mimas skew overlay (already in `Button`) animates correctly.
4. Inspect plants — both sway gently; verify `prefers-reduced-motion` disables animation via DevTools rendering panel.
5. Resize to <48rem — leaf/sprout accents should reduce opacity (or hide) and not overflow horizontally.
6. `npm run check` — passes type-check.
7. `npm run test:unit -- --run src/lib/components/Contact.svelte.spec.ts` — passes.
8. `npm run lint` — passes prettier + eslint.
9. Run the Svelte MCP `svelte-autofixer` on `Contact.svelte` until clean.
