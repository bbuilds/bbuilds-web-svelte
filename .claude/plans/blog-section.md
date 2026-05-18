# Plan — Static Blog Section

## Context

The Claude Design handoff for the home page (`llm_docs/brandenbuilds-claude-design/project/`) defines a `Blog` section the home page does not yet have. The existing `+page.svelte` renders Hero → Services → Process → Quote; the design places Blog immediately after Proof/Quote. The user wants this section built as a static, dummy-data-only Svelte component (no Storyblok wiring yet) using Tailwind utilities rather than custom CSS.

Design references:

- Markup/data: [sections.jsx:534-672](../../llm_docs/brandenbuilds-claude-design/project/sections.jsx#L534-L672) (`POSTS` array + `Blog` component)
- Styling rules: [index.html:373-406](../../llm_docs/brandenbuilds-claude-design/project/index.html#L373-L406) (`.blog`, `.blog-head`, `.posts`, `.post-card`, `.post-art`, `.post-body`, `.post-meta`, `.post-tag`, `.post-headline`, `.post-blurb`, `.post-link`)

## Approach

Create one new component, [src/lib/components/Blog.svelte](../../src/lib/components/Blog.svelte), mirroring the structure of [Quote.svelte](../../src/lib/components/Quote.svelte) and [Process.svelte](../../src/lib/components/Process.svelte) — local `const POSTS` array in `<script lang="ts">`, `<section class="paper-bg ...">`, Tailwind classes everywhere, minimal `<style>` block for the per-card stagger keyframe only.

Render with dummy `href="#"` for both each card and the "view all posts" CTA. Insert `<Blog />` into [+page.svelte](../../src/routes/+page.svelte) after `<Quote />`.

### Component contents

**Data** (mirror the design):

```ts
const POSTS = [
	{
		tag: 'SEO',
		date: 'Feb 11, 2022',
		title: 'Local SEO Guide: Google Business Profile',
		blurb: '...',
		href: '#'
	},
	{
		tag: 'Performance',
		date: 'Jan 16, 2022',
		title: 'Detecting Memory Leaks in Web Apps',
		blurb: '...',
		href: '#'
	},
	{
		tag: 'Talks',
		date: 'Oct 14, 2021',
		title: 'Headless WP & Gatsby at Seattle WP Meetup',
		blurb: '...',
		href: '#'
	}
] as const;
```

**Section header** (matches Quote/Process meta-dot pattern + `.scribble` underline already in [design.css:179-193](../../src/lib/styles/design.css#L179-L193)):

- Meta label: `// 05.writing` (continues the existing 01-Hero / 02-Services / 03-Process / 04-Proof / 05-Writing sequence — the design's literal `// 04.writing` collides with Quote's `// 04.proof`)
- Heading: `Recent <span class="scribble">posts<svg/></span>.` reusing the same yellow scribble SVG path used in [Quote.svelte:48-57](../../src/lib/components/Quote.svelte#L48-L57)
- Lead copy from the design
- Right-aligned CTA: reuse [Button.svelte](../../src/lib/components/Button.svelte) with `variant="primary"` `href="#"` rendering `view all posts →`

**Posts grid** (Tailwind equivalent of `.posts` + `.post-card`):

- Grid: `grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3`
- Card `<a>`: `group flex flex-col overflow-hidden rounded-2xl border border-paper-line bg-white/40 no-underline text-inherit transition-[transform,box-shadow,border-color] duration-350 hover:-translate-y-1.5 hover:border-ink hover:shadow-[0_1.5rem_3rem_-1.5rem_rgba(0,0,0,0.25)]`
- Card stagger entry: `style="--i: {i}"` + a single keyframe `postIn` defined in the component's `<style>` block (Tailwind has no first-class API for `animation-delay: calc(var(--i) * 80ms)`, so this small custom rule stays)
- `.post-art` block: per the chosen design option, a plain dark-ink solid block — `aspect-[16/9] bg-ink overflow-hidden` with no inner SVG
- `.post-body`: `flex flex-1 flex-col gap-2.5 px-5 pt-5 pb-6`
- `.post-meta` row: `flex items-center gap-2 font-mono text-[0.6875rem] text-muted`
  - tag pill: `rounded-full bg-yellow/10 px-2 py-0.5 text-yellow font-semibold uppercase tracking-[0.04em]`
  - date: `tracking-[0.04em]`
- `.post-headline` (h3): `text-xl font-semibold tracking-[-0.015em] leading-tight text-ink`
- `.post-blurb` (p): `m-0 flex-1 font-mono text-xs leading-[1.65] text-body`
- `.post-link`: `mt-1.5 inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-ink` with arrow span — arrow uses `transition-transform duration-250 group-hover:translate-x-1` (no CSS needed thanks to the `group` class on the card)

### Files to modify

1. **Create** [src/lib/components/Blog.svelte](../../src/lib/components/Blog.svelte) (new component, as specified above)
2. **Edit** [src/routes/+page.svelte](../../src/routes/+page.svelte) — add `import Blog` and place `<Blog />` after `<Quote />`

### Conventions observed

- `rem`-only sizing (per [CLAUDE.md](../../CLAUDE.md) and `feedback_rem_over_px` memory) — all arbitrary Tailwind values use `rem`; the standard scale (`gap-6`, `px-5`, `text-xs`, etc.) is rem-based already.
- Svelte 5 runes (forced project-wide); the component is purely presentational so no runes are actually needed beyond `const POSTS`.
- Tailwind utilities everywhere except the one stagger keyframe (small `<style>` block, ~10 lines).
- No Storyblok types or props — component takes zero props, owns its own dummy data.

## Verification

1. `npm run dev` — load `http://localhost:5173/`, scroll past the Quote section, confirm Blog renders.
2. Visual check vs design:
   - Section header shows `// 05.writing` dot prefix, "Recent posts." with yellow scribble under "posts", lead copy, and right-aligned "view all posts →" button.
   - 3 cards: 1-col on narrow, 2-col ≥ 48rem, 3-col ≥ 64rem.
   - Each card has a dark ink 16:9 top block, then tag pill + date, headline, blurb, "read post →" link.
   - Hover on a card: lifts ~`0.375rem`, gains shadow + dark border, "→" slides right.
3. `npm run check` — passes (no type errors).
4. `npm run lint` — passes (Prettier + ESLint).
5. Mobile (≤ 48rem): single-column grid, no horizontal overflow.
