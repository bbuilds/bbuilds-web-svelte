# Plan — `/blog` Index Route

## Context

The site has post detail pages (catch-all `[slug]` route) and a 3-post teaser on the home page, but no archive. We need a dedicated `/blog` route that lists every post with a hero, client-side search, and "Load More" pagination, styled to match the mock at `llm_docs/brandenbuilds-claude-design/project/blog-index.html`.

The user has already extended the **Blog Index** Storyblok content type and regenerated `src/lib/types/storyblok.d.ts`. The new shape (lines 134–139) is:

```ts
StoryblokBlogIndex { hero?: StoryblokHero[]; seo?: StoryblokSEO[]; ... }
```

This reuses the shared `StoryblokHero` block (`title`, `tagline`, `copy`, `CTA[]`, `image`) — the same pattern Services uses (`StoryblokServicesTemplate.hero`). So we map:

- `hero.title` → h1 (e.g. _Branden Builds Blog_)
- `hero.tagline` → eyebrow (e.g. `// 05.writing`)
- `hero.copy` → lead paragraph
- `hero.CTA?.[0]` → button label + link (resolved via `resolveMultilink`)
- `hero.image` → unused (the right side uses a custom schematic SVG)

User-confirmed decisions:

- Ship **load-more pagination** + **search input**. No topic chips.
- **Do not** touch header/nav — `/#blog` stays as is.
- **Port the schematic hero SVG verbatim** into Svelte.

> **TODO (follow-up):** Add topic chips later. The design at `llm_docs/brandenbuilds-claude-design/project/blog-index.html` (lines 633–646) shows a row of `#topic` chip buttons between the search input and the posts grid that filter posts via `topics` arrays. Deferred from this iteration — revisit once the post taxonomy in Storyblok is firmed up (likely driven off `tag_list` or a dedicated topics field).

---

## Files to create

| Path                                                                                     | Purpose                                                              |
| ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| [src/routes/blog/+page.ts](src/routes/blog/+page.ts)                                     | Load function — fetch Blog Index story + all posts in parallel       |
| [src/routes/blog/+page.svelte](src/routes/blog/+page.svelte)                             | Page shell: BlogHero + paper-bg body with search, grid, load-more    |
| [src/lib/components/blog/BlogHero.svelte](src/lib/components/blog/BlogHero.svelte)       | Ink-bg hero (breadcrumb, eyebrow, h1, lead, CTA, art) — props-driven |
| [src/lib/components/blog/BlogHeroArt.svelte](src/lib/components/blog/BlogHeroArt.svelte) | Static schematic SVG ported from the mock                            |

No existing files are modified.

> **Routing note:** SvelteKit prefers static segments over dynamic ones, so `/blog/+page.*` automatically wins over `[slug]/+page.*` for the path `/blog`. No config needed.

---

## Load function — [src/routes/blog/+page.ts](src/routes/blog/+page.ts)

Mirror [src/routes/+page.ts](src/routes/+page.ts) for fetch/error patterns, and `services/[slug]/+page.ts` for breadcrumb JSON-LD.

- `await parent()` → `{ storyblokAPI, version, globals }`
- Run two fetches in parallel via `Promise.all`:
  1. `cdn/stories/blog` → `ISbStoryData<StoryblokBlogIndex> | null` (swallow 404, log other errors)
  2. `cdn/stories` with `{ starts_with: 'posts/', sort_by: 'first_published_at:desc', per_page: 100, is_startpage: false }` → `ISbStoryData<StoryblokBlogPost>[]`
  - The server sort by `first_published_at:desc` is just a sensible default ordering off the wire. Final order is recomputed client-side in the page using the effective date (see "Date handling" below) so posts whose `content.updated_date` is more recent than their `first_published_at` float to the top.
- Compose SEO via `resolveSEO({ pageSEO: story.content?.seo?.[0], globalSEO: globals?.content?.seo?.[0], fallbacks: { title: \`Blog — ${SITE_NAME}\`, description: '…', pathname: url.pathname }, extraJsonLd: [breadcrumbLd([{ name: 'Home', url: SITE_URL }, { name: 'Blog', url: \`${SITE_URL}/blog\` }])] })`.
- Return `{ story: story ?? null, posts, seo }`.

Reused utilities: [resolveSEO](src/lib/utils/seo.ts), [breadcrumbLd](src/lib/utils/jsonLd.ts), [SITE_NAME / SITE_URL](src/lib/config/site.ts).

---

## Page component — [src/routes/blog/+page.svelte](src/routes/blog/+page.svelte)

### Structure

```
<BlogHero {...heroProps} />          ← ink-bg
<section class="paper-bg ...">       ← search + posts
  <div class="container">
    <SearchInput bind:value={query} />
    {#if isFiltered} <MetaBar /> {/if}
    <div class="posts-grid">
      {#each shown ...} <PostCard /> {/each else} <EmptyState /> {/each}
    </div>
    {#if hasMore} <LoadMore on:click={() => visible += PAGE_SIZE} /> {/if}
  </div>
</section>
```

`SearchInput`, `MetaBar`, `EmptyState`, and `LoadMore` are inline markup in the page — small enough not to warrant their own files.

### Reuse from [src/lib/components/home/Blog.svelte](src/lib/components/home/Blog.svelte) lines 25–41

Map each Storyblok post into a `PostCard`-shaped card with one addition — a lowercased `searchHaystack` (`title + summary + tag + tag_list`) so search is a single `.includes()` per card.

Use existing utilities: [kickerTag](src/lib/utils/format.ts), [formatDate](src/lib/utils/format.ts). Card `href` = `/${story.slug.replace(/^posts\//, '')}` (matches existing `[slug]` route — posts live at root).

### Date handling — effective date (updated → published)

The blog post content has an optional `content.updated_date` (string). When present and valid, it should drive **both the date shown on the card and the sort order**, with `first_published_at` as the fallback. The existing post detail page at [src/routes/\[slug\]/+page.svelte](src/routes/[slug]/+page.svelte) lines 16–20 already validates `updated_date` with `!isNaN(new Date(...).getTime())` — reuse that same guard so behavior stays consistent across the site.

Per-card logic during the post → card mapping:

```ts
const updated =
	story.content?.updated_date && !isNaN(new Date(story.content.updated_date).getTime())
		? story.content.updated_date
		: undefined;

const effectiveIso = updated ?? story.first_published_at ?? story.published_at ?? '';

return {
	// ...
	datetime: effectiveIso,
	date: effectiveIso ? formatDate(effectiveIso) : '',
	effectiveAt: effectiveIso ? new Date(effectiveIso).getTime() : 0 // for sort
};
```

Then sort the mapped array client-side by `effectiveAt` descending **before** the search filter runs:

```ts
const allCards = $derived(
	data.posts
		.filter((p) => p && p.slug)
		.map(/* ... per-card mapping above ... */)
		.sort((a, b) => b.effectiveAt - a.effectiveAt)
);
```

`PostCard` already accepts `date` + `datetime` props — no component change required. Cards just show one date (the effective one); we are not differentiating "Updated" vs "Published" on the card itself (that distinction stays on the detail page via `PostHeader`).

### Runes state

```ts
const PAGE_SIZE = 6;
let query = $state('');
let visible = $state(PAGE_SIZE);

const allCards = $derived(/* map data.posts → cards with searchHaystack */);
const filtered = $derived(
	query.trim()
		? allCards.filter((c) => c.searchHaystack.includes(query.trim().toLowerCase()))
		: allCards
);
const shown = $derived(filtered.slice(0, visible));
const hasMore = $derived(visible < filtered.length);
const isFiltered = $derived(query.trim().length > 0);

$effect(() => {
	query;
	visible = PAGE_SIZE;
}); // reset pagination on new search
```

Use `<PostCard ... index={i} eager={i < 3} />` so the first row gets `loading="eager"` + `fetchpriority="high"`.

---

## BlogHero — [src/lib/components/blog/BlogHero.svelte](src/lib/components/blog/BlogHero.svelte)

Props (all optional, with fallbacks baked in):

```ts
interface Props {
	eyebrow?: string;
	title?: string;
	copy?: string;
	ctaLabel?: string;
	ctaHref?: string;
	ctaTarget?: string;
	ctaRel?: string;
}
```

Page resolves these from the Storyblok `hero` block + [resolveMultilink](src/lib/utils/links.ts) and passes them in. Fallbacks (used when the Blog Index story or fields are missing):

```ts
const FALLBACKS = {
	eyebrow: '// 05.writing',
	title: 'Branden Builds Blog',
	copy: 'Read articles and posts on web development, SEO, and branding.',
	ctaLabel: 'Talk Nerdy to Me →',
	ctaHref: '/#contact-modal'
};
```

Layout: `<section class="ink-bg ...">` wrapping a `<div class="container">` with:

- Breadcrumb `<nav>` (`Home › Blog`), font-mono uppercase, muted
- Two-col grid (`grid-cols-1 lg:grid-cols-2`) — left text, right `<BlogHeroArt />` (`hidden lg:block`)
- Title uses `text-[clamp(2.75rem,7vw,5.5rem)]` for the responsive size
- CTA reuses [Button.svelte](src/lib/components/Button.svelte) `variant="ghost"` on dark bg (verify variant renders correctly against ink; otherwise inline a `btn btn-ghost-light` styled `<a>`)

---

## BlogHeroArt — [src/lib/components/blog/BlogHeroArt.svelte](src/lib/components/blog/BlogHeroArt.svelte)

Direct Svelte port of the JSX `HeroArt()` function in the mock (lines 428–536 of `blog-index.html`). Conversions:

- `className` → `class`
- camelCase SVG attrs (`strokeWidth`, `strokeDasharray`, `textAnchor`) → kebab-case (`stroke-width`, `stroke-dasharray`, `text-anchor`)
- `{[...].map(...)}` → `{#each ... as ...}` with static arrays in `<script>`
- Always `aria-hidden="true"`, no props

Width/height set by the parent container; the SVG uses `viewBox="0 0 520 352"` and `style="width:100%;height:100%;display:block"`. The cyan/yellow strokes use the literal `#01fdf6` / `#ffcd67` colors from the design (these match the `--teal` and `--pale-fire` tokens).

---

## Storyblok content authoring (out of code — for the user)

In the Storyblok admin, create a story at slug `blog` using the **Blog Index** content type, then populate the nested **Hero** block:

| Hero field     | Value                                                                      |
| -------------- | -------------------------------------------------------------------------- |
| `tagline`      | `// 05.writing`                                                            |
| `title`        | `Branden Builds Blog`                                                      |
| `copy`         | `Read articles and posts on web development, SEO, and branding.`           |
| `CTA[0].label` | `Talk Nerdy to Me →`                                                       |
| `CTA[0].link`  | internal link to home `#contact-modal` (or current `hero_cta_url` pattern) |
| `image`        | leave empty — the right column uses the schematic SVG                      |

Set the **SEO** block for the page meta. Page renders cleanly with fallbacks if this story doesn't exist yet, so authoring can happen in parallel.

---

## Styling approach

- Section backgrounds use existing global helpers `paper-bg` / `ink-bg` (defined in [src/lib/styles/design.css](src/lib/styles/design.css)).
- Tailwind utilities for everything else — color tokens are already mapped (`text-ink`, `text-paper`, `text-yellow`, `text-muted`, `bg-paper-2`, `border-paper-line`, etc.). All sizes in `rem` (use Tailwind scale or arbitrary values like `text-[0.6875rem]`).
- Search input: `bg-paper-2 border border-paper-line rounded-[0.625rem] font-mono` with `focus-visible:border-yellow focus-visible:ring-2 focus-visible:ring-yellow/10`.
- Posts grid: `grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3` (identical to home Blog section).
- Aim for zero new scoped `<style>` blocks. `PostCard`'s entry animation already lives in its own file.

---

## Verification

1. `npm run dev` → visit `http://localhost:5173/blog`
2. With Blog Index story absent: hero renders fallbacks; grid renders all posts. With it present: hero copy comes from CMS.
3. Schematic SVG appears at `lg` (≥64rem), hidden below.
4. Search filters case-insensitively across title/summary/tag/topics; visible counter resets to 6 on each keystroke.
5. "Load More" appends 6 cards; button disappears when `visible >= filtered.length`.
6. Empty state renders when search returns zero; the inline "clear filters" button restores the full list.
7. Click a post card → existing `/{slug}` route still resolves correctly (regression check that `/blog` didn't shadow the catch-all).
8. Sort check: pick a post in Storyblok, set its `updated_date` to a value newer than its `first_published_at`, reload `/blog` — it should jump to the top of the grid, and its card date should display the updated date.
9. View source: `<title>` reads "Blog — Branden Builds" (or CMS override), `<link rel="canonical" href=".../blog">`, breadcrumb JSON-LD present.
10. Mobile (<48rem): single-column grid, hero art hidden, no horizontal scroll.
11. `npm run check` passes (no TS errors against the regenerated `StoryblokBlogIndex` shape).
12. `npm run build` succeeds under the Cloudflare adapter (no server-only code added).
