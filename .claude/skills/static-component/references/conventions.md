# Conventions reference

Read this before implementing a component. It expands on the workflow in `SKILL.md`
with the concrete rules, the reuse inventory, and the test patterns this project
expects. These are derived from the existing components and `CLAUDE.md` — when in
doubt, open a sibling component (e.g. `src/lib/components/home/Quote.svelte`) and
match it.

## Table of contents

1. Token mapping (colors, fonts, spacing)
2. rem-only sizing
3. Reuse inventory — prefer these over rebuilding
4. Svelte 5 + scoped styles
5. Strict CSP
6. Accessibility patterns
7. Test patterns (vitest-browser-svelte)
8. Integrating — route wiring and richtext bloks

---

## 1. Token mapping

`src/lib/styles/design.css` is the single source of truth for brand tokens. It uses
Tailwind v4 `@theme`, which emits **both** `--color-*` / `--font-*` CSS variables
**and** utility classes (`bg-yellow`, `text-ink`, `font-mono`, `border-paper-line`).

When you read a hex value out of the design prototype, find its token rather than
hard-coding the hex:

- In **markup** (Tailwind classes), use the utility: `text-ink`, `bg-paper`,
  `text-yellow`, `text-charcoal`, `text-muted`.
- In a scoped **`<style>` block** or SVG `fill`/`stroke`, use the variable. Note the
  prefix: theme tokens are `var(--color-yellow)`, `var(--font-mono)` — there are also
  short aliases (`var(--yellow)`, `var(--mono)`) defined in `:root` for non-Tailwind
  contexts. Match whichever the nearby existing code uses.
- For **translucent tints**, prefer the named tints in `design.css` (e.g.
  `--yellow-14`) or inline relative color `rgb(from var(--color-yellow) r g b / 0.14)`
  — never a new raw rgba.

Always read the current `design.css` at build time — the token set changes. If the
design needs a color with no token and it recurs, raise it in the plan instead of
silently inventing one.

## 2. rem-only sizing

Never use `px` for any size measurement — not in Tailwind arbitrary values, custom
properties, or inline styles. Convert px → rem by dividing by 16:

- 13px → `0.8125rem`, 22px → `1.375rem`, 44px → `2.75rem`.
- `text-[clamp(1rem,1.55vw,1.25rem)]`, `h-[1.375rem]` — arbitrary values stay rem.
- The standard Tailwind scale (`px-4`, `py-2`, `text-sm`, `h-11`, `gap-2`) is already
  rem-based — use it freely; no need to convert those.

## 3. Reuse inventory — prefer these over rebuilding

List the real directories at build time (`src/lib/components`, `src/lib/components/svgs`,
`src/lib/utils`) — this is a snapshot, not exhaustive, and it drifts.

- **Layout / section pieces**: `Eyebrow.svelte` (the `// 0x.label` mono eyebrow),
  `SectionHeader.svelte` (eyebrow + title-with-scribble + copy + optional CTA),
  `Button.svelte`.
- **SVGs**: `src/lib/components/svgs/icons/` (e.g. `Logo`, `QuoteMark`, `LinkIcon`,
  `MailIcon`, `LinkedInIcon`, `CloseIcon`, `SearchIcon`) and
  `src/lib/components/svgs/illustrations/` (e.g. `ScribbleUnderline`, `Sprout`,
  `FallingLeaves`). If the design's decorative glyph already exists here, import it;
  only inline a new SVG when there's no match (then consider extracting it).
- **Shared CSS utilities** (in `design.css`): `.container` (max-width + responsive
  gutters), `.paper-bg` (paper background + noise overlay), `.scribble` (wrap text,
  inject an underline SVG child). `sr-only` is the Tailwind visually-hidden utility.
- **Helpers** (`src/lib/utils/`): e.g. `format.ts` (`parseTitleSegments` for
  `<un>`/`<ha>` title markup), `motion.ts`, `links.ts`. Check before writing your own.

## 4. Svelte 5 + scoped styles

- Runes mode is forced project-wide. Use `$props()`, `$state()`, `$derived()`,
  `$effect()` — never the legacy Options API.
- A static component hard-codes its content as a `const` (often `as const`) at the top
  of `<script lang="ts">`, then renders it. No `content` prop, no Storyblok type — that
  is what "static" means here.
- Prefer Tailwind utility classes for layout, spacing, typography, and color. Avoid
  component-scoped `<style>` rules unless a design requirement cannot be expressed with
  Tailwind utilities.
- If you do need component-local CSS, keep it in a scoped `<style>` block using tokens.
  Don't add rules to `design.css`. Use `:global(...)` only to reach into a shared class
  (e.g. overriding `.scribble svg` sizing locally), matching the existing pattern.

## 5. Strict CSP

`kit.csp` sets a strict `script-src` with no `'unsafe-inline'`. The trap: Svelte turns
any element with an attribute **spread** (`{...}`) into dynamic attribute handling and
injects inline `onload`/`onerror` capture handlers (`this.__e=event`). On media/embedded
elements (`<img>`, `<video>`, `<audio>`, `<source>`, `<iframe>`) the CSP blocks those
inline handlers and the element breaks at runtime — and nonces/hashes can't cover them.

Use explicit conditional attributes instead of spreads on those elements:

```svelte
<!-- good -->
<img {src} {alt} fetchpriority={eager ? 'high' : undefined} />
<!-- bad: spread injects inline handlers the CSP blocks -->
<img {...eager ? { fetchpriority: 'high' } : {}} />
```

An attribute set to `undefined` is omitted from output, so conditional attributes are
the clean way to vary them.

## 6. Accessibility patterns

Concrete patterns the existing components use — copy these:

- **Section with hidden label**: when a section is visually headed only by an eyebrow,
  still give it a real heading for screen readers: `<h2 class="sr-only">What people
are saying.</h2>`.
- **Quote**: `<figure>` › `<blockquote cite={href}><p>…</p></blockquote>` ›
  `<figcaption>` with the attribution; the `<cite>` holds the source.
- **Decorative SVG**: `aria-hidden="true"` on glyphs, scribbles, separators. A
  separator character like `·` between attribution parts → `aria-hidden="true"`.
- **Focus**: interactive elements use
  `focus-visible:rounded-xs focus-visible:outline-2 focus-visible:outline-offset-1
focus-visible:outline-yellow` (adjust radius/offset to fit). Don't remove outlines
  without replacing them.
- **New-tab links**: `target="_blank" rel="noopener noreferrer"`.
- **Reduced motion**: every animation/transition that moves or fades content is
  disabled under `@media (prefers-reduced-motion: reduce)`:

  ```css
  .quote-body {
  	animation: quoteIn 0.6s cubic-bezier(0.2, 0.7, 0.2, 1) both;
  }
  @media (prefers-reduced-motion: reduce) {
  	.quote-body {
  		animation: none;
  	}
  }
  ```

## 7. Test patterns (vitest-browser-svelte)

Component tests are `<Name>.svelte.spec.ts` next to the component and run in the
`client` (Chromium) Vitest project. Test **content and behavior**, not styling.

```ts
import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Quote from './Quote.svelte';

describe('Quote', () => {
	it('renders the eyebrow', async () => {
		render(Quote);
		await expect.element(page.getByText('// 04.proof')).toBeInTheDocument();
	});

	it('links the attribution to LinkedIn in a new tab', async () => {
		const { container } = render(Quote);
		const link = container.querySelector('a[href*="linkedin.com"]');
		expect(link?.getAttribute('target')).toBe('_blank');
		expect(link?.getAttribute('rel')).toContain('noopener');
	});
});
```

Prefer role/text queries (`page.getByRole('heading', { level: 2, name: /…/i })`,
`page.getByText(...)`) — they double as accessibility assertions. Drop to
`container.querySelector` only for structural checks (a `.scribble` wrapper, an svg
child). Run a single spec with
`npm run test:unit -- --run src/lib/components/<Name>.svelte.spec.ts`.

"If applicable": a purely presentational component with no content worth asserting may
not need a spec — but most sections render copy, links, and headings that are worth a
few checks. Default to writing one.

## 8. Integrating — route wiring and richtext bloks

### 8a. Section → wire into a route

Import the component and render it in the position the plan specifies. Home-page
sections live in `src/routes/+page.svelte`; post/route-specific sections render in
their route's `+page.svelte`. Match the existing import ordering and placement.

```svelte
<script lang="ts">
	import Quote from '$lib/components/home/Quote.svelte';
</script>

<Process />
<Quote />
```

### 8b. Storyblok blok → register in the richtext renderer

A blok that appears inside a blog post's body (e.g. the Callout Block) is rendered by
`src/lib/components/posts/RichTextRenderer.svelte`, a recursive renderer that branches
on `node.type`. Embedded Storyblok components arrive as a node of type `blok` whose
`attrs.body` is an array of bloks, each carrying a `component` name and its fields.

To add one:

1. Confirm the generated type in `src/lib/types/storyblok.d.ts` (e.g.
   `StoryblokCalloutBlock` with `callout_type` and a rich-text `content`). It's already
   generated by `npm run cf-typegen`-style tooling — read it, don't redefine it.
2. Build the component (e.g. `src/lib/components/posts/Callout.svelte`) taking the blok
   fields as props. Render its rich-text body by delegating back to the renderer —
   `<RichTextRenderer doc={content} />` — rather than re-parsing rich text yourself.
3. Add a branch to `RichTextRenderer.svelte` that matches the blok and dispatches by
   `component`:

   ```svelte
   {:else if node.type === 'blok'}
   	{#each (node.attrs?.body ?? []) as blok (blok._uid)}
   		{#if blok.component === 'Callout Block'}
   			<Callout calloutType={blok.callout_type} content={blok.content} />
   		{/if}
   	{/each}
   ```

   Mirror the existing branches' style (`{@const}` for derived values, keyed `{#each}`).
   Keep the dispatch readable — if several bloks accumulate, a small lookup is fine, but
   match what's already there.

The component still follows every rule above: tokens (or component-local vars for
non-token accents), rem (including `1px`→`0.0625rem` borders), accessibility
(`role="note"`, decorative icons `aria-hidden`, the variant label as real text), scoped
styles, and a spec that renders each variant.
