# Add Table of Contents to blog posts

## Context

The blog post page (`src/routes/[slug]/+page.svelte`) renders dynamic Storyblok rich-text content with a desktop sidebar (`PostSidebar.svelte`) containing share buttons, topics, and post navigation. The reference design (`llm_docs/brandenbuilds-claude-design/project/blog-post.html`) places an "on this page" table of contents at the **top of the sidebar** that is auto-generated from the article's H2 headings, with scroll-spy active-section highlighting and smooth scroll-to-heading on click.

Currently there is no TOC, and rendered H2s have no `id` anchors. This adds the TOC matching the design's full behavior (scroll-spy confirmed by user). TOC is desktop-only (the sidebar is `hidden lg:flex`), consistent with the design.

## Approach

Generate the heading list and anchor ids **data-driven from the rich-text doc** (so the TOC and H2 anchors render server-side and stay in sync), and add a small client effect only for scroll-spy active highlighting.

### 1. `src/lib/utils/format.ts` — slug + heading utilities

Add (reusing the existing private `collectText`):

- `slugify(s: string): string` — mirror the design: lowercase, trim, `&`→`and`, strip non-alphanumeric/space/hyphen, spaces→`-`, collapse repeats.
- `export interface TocHeading { id: string; text: string; }`
- `headingSlugs(nodes: RichTextNode[]): (string | null)[]` — walks nodes in order; for each level-2 `heading` node, extracts text via `collectText`, slugifies, and **dedupes** with a `Map<string, number>` counter (`id`, `id-1`, `id-2`, …). Returns an array index-aligned to `nodes` (`null` for non-H2). This alignment is what keeps the renderer's `id`s identical to the TOC's.
- `extractHeadings(nodes: RichTextNode[] | undefined): TocHeading[]` — derived from `headingSlugs`; returns `{ id, text }` for each H2.

Only H2s are included (`attrs.level === 2`), per requirement.

### 2. `src/lib/components/posts/RichTextRenderer.svelte` — anchor the H2s

- Derive `const anchors = $derived(headingSlugs(list));` (import from `format`).
- On the top-level H2 branch (line 40-45), add `id={anchors[i] ?? undefined}` and add `scroll-mt-20` (5rem) to the class so anchored/clicked headings land below the sticky header. Nested renderer instances contain no H2s, so `anchors` is all-`null` there — no effect.

### 3. `src/lib/components/posts/TableOfContents.svelte` — NEW

- Props: `{ headings: TocHeading[] }`. Render nothing if empty.
- Markup matches the design's sidebar TOC, translated to Tailwind utilities (all sizes in **rem** per CLAUDE.md):
  - `nav aria-label="Table of contents"` with an "on this page" label reusing the existing sidebar label style (`font-mono text-[0.625rem] font-semibold tracking-widest text-ink-soft uppercase`).
  - `ul` is `relative` with a vertical guide line via `before:absolute before:left-0 before:top-[0.375rem] before:bottom-[0.375rem] before:w-px before:bg-paper-line`.
  - Each item is an `<a href="#${id}">` styled `block border-l-2 border-transparent -ml-px py-[0.4375rem] pl-[0.875rem] text-[0.8125rem] ...`; active item gets `border-yellow text-ink font-semibold`.
- Anchors are plain `href="#id"`: the global `html { scroll-behavior: smooth }` (design.css) + `scroll-mt-20` on the H2 already give offset smooth-scroll and hash updates with no JS.
- Scroll-spy: a `$effect` (following the `ReadingProgress.svelte` listener pattern) resolves each heading element via `document.getElementById(id)`, and on `scroll`/`resize` sets `active` to the last heading whose `top - innerHeight * 0.3 <= 0`. Clean up listeners in the returned teardown.

### 4. `src/lib/components/posts/PostSidebar.svelte` — mount the TOC

- Add `headings: TocHeading[]` to `Props` (default `[]`); import `TableOfContents`.
- Render `<TableOfContents {headings} />` as the **first** sidebar block, followed by an `<hr class="my-5.5 border-t border-paper-line" />` shown only when `headings.length > 0`, then the existing share/topics/nav blocks (matches design ordering).

### 5. `src/routes/[slug]/+page.svelte` — pass headings

- `const headings = $derived(extractHeadings(richTextDoc?.content));`
- Pass `{headings}` to `<PostSidebar ... />`.

## Critical files

- `src/lib/utils/format.ts` (new utils)
- `src/lib/components/posts/RichTextRenderer.svelte` (H2 ids + scroll-mt)
- `src/lib/components/posts/TableOfContents.svelte` (new)
- `src/lib/components/posts/PostSidebar.svelte` (mount TOC)
- `src/routes/[slug]/+page.svelte` (compute + pass headings)

## Verification

- Run `npm run check` (types) and `npm run lint`.
- Validate all new/edited Svelte with the Svelte MCP `svelte-autofixer` until clean.
- `npm run dev`, open a post with multiple H2s at ≥`lg` width:
  - TOC lists every H2 in order; clicking an item smooth-scrolls so the heading sits below the sticky header; URL hash updates.
  - Active item highlights and updates while scrolling; first item active at top, last stays active at the bottom.
  - Duplicate H2 titles produce distinct anchors (`id`, `id-1`).
  - Below `lg`, the sidebar (and TOC) stays hidden; no console errors.
- Optionally add a `*.spec.ts` unit test for `slugify`/`extractHeadings` (dedupe + H2-only filtering), matching the project's server test pattern.
