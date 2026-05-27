# SEO + GEO Setup Plan

## Context

The site currently has almost no SEO: `src/app.html` only sets charset/viewport, the root layout sets a favicon and font links, and only two routes (`/[slug]`, `/services/[slug]`) emit a hardcoded `<title>` and `<meta name="description">`. The home page emits nothing.

Storyblok now exposes an `SEO` blok ([src/lib/types/storyblok.d.ts:231-243](src/lib/types/storyblok.d.ts#L231-L243)) on `StoryblokGlobals`, `StoryblokHomePage`, and `StoryblokServicesTemplate` with `og_title`, `og_image`, `meta_title`, `meta_description`, `canonical_url`, `og_url`, `no_index`, `no_follow`, and `json_structured_data`. None are required, so resolution needs to gracefully fall back: **per-page SEO blok → globals SEO blok → derived defaults**.

In addition to standard meta tags, this plan wires up GEO/AI-discoverability surfaces (sitemap, robots, llms.txt, JSON-LD) so the site is well-formed for both search engines and LLM crawlers.

**Decisions (from user):**

- Base URL comes from `PUBLIC_SITE_URL` env var with a dev fallback.
- Local blog posts at `/[slug]` are **out of scope** for this plan.
- Include JSON-LD structured data, `sitemap.xml`, `robots.txt`, `llms.txt`.
- No Twitter-specific tags — rely on Open Graph.

---

## Approach

A single normalized SEO object is produced in each page's `load`, written to `page.data.seo`, and rendered once by a `<SEO>` component in the root layout. This keeps `<svelte:head>` declarations in one place and makes the fallback chain explicit.

### 1. Site config — [src/lib/config/site.ts](src/lib/config/site.ts) (new)

```ts
import { PUBLIC_SITE_URL } from '$env/static/public';

export const SITE_URL = (PUBLIC_SITE_URL ?? 'http://localhost:5173').replace(/\/$/, '');
export const SITE_NAME = 'BrandenBuilds';
export const DEFAULT_OG_LOCALE = 'en_US';
```

Add `PUBLIC_SITE_URL=https://brandenbuilds.com` (or correct production URL) to `.env.example` and to wrangler vars for production. Use `PUBLIC_` prefix so it's available client-side too if needed.

### 2. SEO resolver — [src/lib/utils/seo.ts](src/lib/utils/seo.ts) (new)

Exports `resolveSEO()` that takes:

- `pageSEO?: StoryblokSEO` (first item of the page's `seo` bloks array)
- `globalSEO?: StoryblokSEO` (first item of globals `seo` bloks array)
- `fallbacks: { title, description?, pathname, ogImagePath? }` derived from the route

Returns a `ResolvedSEO`:

```ts
type ResolvedSEO = {
	title: string; // <title> + og:title fallback
	ogTitle: string;
	description?: string;
	canonical: string; // absolute URL
	ogUrl: string; // absolute URL
	ogImage?: { url: string; width?: number; height?: number; alt?: string };
	noIndex: boolean;
	noFollow: boolean;
	jsonLd: object[]; // array, since we may stack multiple (Organization + Article + etc.)
};
```

Each field is independently merged: `pageSEO.x ?? globalSEO.x ?? fallback`. `canonical_url`/`og_url` from Storyblok are used verbatim if absolute, otherwise resolved against `SITE_URL`. og_image goes through [storyblokImageUrl](src/lib/utils/storyblokImage.ts) at a fixed 1200×630 to produce an absolute, optimized URL.

A small `absoluteUrl(path, origin?)` helper handles the canonical URL math.

### 3. JSON-LD helpers — [src/lib/utils/jsonLd.ts](src/lib/utils/jsonLd.ts) (new)

Factory functions per content type:

- `organizationLd()` — site-wide, included on home page
- `webSiteLd()` — site-wide, included on home page (enables sitelinks search box potential)
- `serviceLd(story)` — for service template pages, using `name`, `description` from the SEO blok or fallback to template fields
- `breadcrumbLd(items)` — for nested routes like `/services/[slug]`

The Storyblok `json_structured_data` (richtext field, but holding JSON) is parsed and appended to the array if present, so editors can extend per page.

### 4. SEO component — [src/lib/components/SEO.svelte](src/lib/components/SEO.svelte) (new)

Pure presentational component using `<svelte:head>`. Props: `seo: ResolvedSEO`. Emits:

- `<title>`
- `<meta name="description">`
- `<link rel="canonical">`
- `<meta name="robots">` only when `noIndex` or `noFollow` true
- `<meta property="og:title|og:description|og:url|og:type|og:site_name|og:locale|og:image[:width|:height|:alt]">`
- One or more `<script type="application/ld+json">` tags from `jsonLd[]` (stringified, with HTML-escape on `</`)

### 5. Wire-up in load functions

For each Storyblok route, build the SEO in `load` and return it on `page.data` so the layout can render it. Pattern:

```ts
import { resolveSEO } from '$lib/utils/seo';
import { organizationLd, webSiteLd } from '$lib/utils/jsonLd';

// Inside load(): after fetching story + reading parent().globals
const seo = resolveSEO({
	pageSEO: story?.content?.seo?.[0],
	globalSEO: globals?.content?.seo?.[0],
	fallbacks: {
		title: story?.name ?? 'BrandenBuilds',
		description: undefined,
		pathname: url.pathname
	},
	extraJsonLd: [organizationLd(), webSiteLd()]
});
return { story, posts, seo };
```

Files to update:

- [src/routes/+page.ts](src/routes/+page.ts) — home: extra JSON-LD = Organization + WebSite
- [src/routes/services/[slug]/+page.ts](src/routes/services/[slug]/+page.ts) — extra JSON-LD = Service + BreadcrumbList
- [src/routes/+layout.ts](src/routes/+layout.ts) — still loads `globals`; also build a baseline `seo` (using only globals) so any route without its own SEO still gets the global fallback

Note: each `load` will need access to `url`, which means destructuring `{ url, parent }` in its signature.

### 6. Render once in layout — [src/routes/+layout.svelte](src/routes/+layout.svelte)

Import the new component and read SEO from `$app/state`'s `page.data.seo` so it always reflects the deepest route. The layout passes `page.data.seo` (computed in each page's load) directly to `<SEO>`. If a page hasn't set `seo`, the layout-level baseline (globals-only) is used.

```svelte
<script lang="ts">
	import { page } from '$app/state';
	import SEO from '$lib/components/SEO.svelte';
	// ... existing imports
</script>

<SEO seo={page.data.seo} />
<svelte:head>
	<!-- existing favicon + font links -->
</svelte:head>
```

Move the hardcoded `<svelte:head>` blocks in [src/routes/services/[slug]/+page.svelte:14-16](src/routes/services/[slug]/+page.svelte#L14-L16) since the layout now owns SEO. The `/[slug]` blog route is out of scope — leave its existing hardcoded head alone.

### 7. sitemap.xml — [src/routes/sitemap.xml/+server.ts](src/routes/sitemap.xml/+server.ts) (new)

GET handler that:

- Uses `useStoryblokApi()` (same init pattern as the root layout) with `version: 'published'`
- Queries home (`home-page`), all `services/*`, and respects each story's SEO `no_index` flag (skip if true)
- Returns `application/xml` with `<urlset>` containing `<loc>` (absolute via `SITE_URL`), `<lastmod>` (from `published_at`), and `<changefreq>`/`<priority>` defaults
- Sets `Cache-Control: public, max-age=3600, s-maxage=3600` for Cloudflare edge caching

### 8. robots.txt — [src/routes/robots.txt/+server.ts](src/routes/robots.txt/+server.ts) (new)

GET handler returning `text/plain`:

```
User-agent: *
Allow: /

Sitemap: {SITE_URL}/sitemap.xml
```

In dev/preview environments (detect via `SITE_URL` containing `localhost` or a `PUBLIC_ENV !== 'production'` check), emit `Disallow: /` instead to keep staging out of search results.

### 9. llms.txt — [src/routes/llms.txt/+server.ts](src/routes/llms.txt/+server.ts) (new)

GET handler returning `text/plain` in the [llms.txt](https://llmstxt.org) markdown convention:

- `# BrandenBuilds` heading
- Short blurb pulled from globals (fallback to a hardcoded one)
- `## Pages` — list of key URLs with descriptions (home, each service, blog index)
- `## Services` — list of service pages with one-line summary derived from each service story's SEO blok

Fetched from Storyblok at request time and edge-cached (`s-maxage=3600`).

---

## Files

**New:**

- [src/lib/config/site.ts](src/lib/config/site.ts)
- [src/lib/utils/seo.ts](src/lib/utils/seo.ts)
- [src/lib/utils/jsonLd.ts](src/lib/utils/jsonLd.ts)
- [src/lib/components/SEO.svelte](src/lib/components/SEO.svelte)
- [src/routes/sitemap.xml/+server.ts](src/routes/sitemap.xml/+server.ts)
- [src/routes/robots.txt/+server.ts](src/routes/robots.txt/+server.ts)
- [src/routes/llms.txt/+server.ts](src/routes/llms.txt/+server.ts)

**Modified:**

- [src/routes/+layout.ts](src/routes/+layout.ts) — build baseline SEO from globals
- [src/routes/+layout.svelte](src/routes/+layout.svelte) — render `<SEO>` from `page.data.seo`
- [src/routes/+page.ts](src/routes/+page.ts) — set page SEO + Organization/WebSite JSON-LD
- [src/routes/services/[slug]/+page.ts](src/routes/services/[slug]/+page.ts) — set page SEO + Service/Breadcrumb JSON-LD
- [src/routes/services/[slug]/+page.svelte](src/routes/services/[slug]/+page.svelte) — remove hardcoded `<svelte:head>` (lines 14-16)
- [.env.example](.env.example) — add `PUBLIC_SITE_URL`

**Reused (do not modify):**

- [src/lib/utils/storyblokImage.ts](src/lib/utils/storyblokImage.ts) — builds og:image URLs at 1200×630
- [src/lib/utils/links.ts](src/lib/utils/links.ts) — multilink resolution (referenced for canonical URL helpers if needed)

---

## Tests

Following project test split (see [CLAUDE.md](CLAUDE.md)): `*.spec.ts` for Node-env logic, `*.svelte.spec.ts` for component browser tests. Match the style of [src/lib/utils/links.spec.ts](src/lib/utils/links.spec.ts) — small fixture factories, `describe`/`it`, focused expectations.

**New test files:**

- [src/lib/utils/seo.spec.ts](src/lib/utils/seo.spec.ts) — `resolveSEO()`:
  - per-page SEO wins over globals which wins over fallbacks
  - empty/undefined SEO blok falls through field-by-field (e.g. page sets `meta_title` only → global `meta_description` still used)
  - absolute `canonical_url` from Storyblok passes through; relative path resolved against `SITE_URL`
  - `og_image` is converted via `storyblokImageUrl` to an absolute 1200×630 URL; missing image stays undefined
  - `no_index` / `no_follow` default to `false` when nowhere set
  - `json_structured_data` parsed and appended to `jsonLd` array; invalid JSON is dropped (not thrown)
- [src/lib/utils/jsonLd.spec.ts](src/lib/utils/jsonLd.spec.ts) — `organizationLd()`, `webSiteLd()`, `serviceLd(story)`, `breadcrumbLd(items)` each return objects with the right `@context`, `@type`, and required fields; `breadcrumbLd` numbers `position` correctly
- [src/lib/components/SEO.svelte.spec.ts](src/lib/components/SEO.svelte.spec.ts) — render with `vitest-browser-svelte` and assert against `document.head`:
  - emits `<title>`, description, canonical, og:\* meta tags
  - emits `<meta name="robots">` only when `noIndex` or `noFollow` true (combinations: noindex, nofollow, both, neither)
  - emits one `<script type="application/ld+json">` per item in `jsonLd[]`
  - `</` sequences in JSON-LD strings are escaped to `<\/` to prevent script breakout
  - missing `description` / `ogImage` simply omit those tags rather than emitting empty values
- [src/routes/sitemap.xml/server.spec.ts](src/routes/sitemap.xml/server.spec.ts) — call the `GET` handler directly with a mocked `useStoryblokApi`:
  - returns 200 with `application/xml` content type
  - `<urlset>` contains the home URL + each service URL, prefixed by `SITE_URL`
  - stories with `seo[0].no_index === true` are excluded
  - `<lastmod>` reflects `published_at`
- [src/routes/robots.txt/server.spec.ts](src/routes/robots.txt/server.spec.ts) — call `GET`:
  - production (`SITE_URL` not localhost): `Allow: /` + `Sitemap:` line
  - dev (`SITE_URL` contains localhost): `Disallow: /`
- [src/routes/llms.txt/server.spec.ts](src/routes/llms.txt/server.spec.ts) — call `GET` with mocked Storyblok client:
  - returns `text/plain`, starts with `# BrandenBuilds`
  - includes `## Services` section listing each fetched service with its description
  - uses globals blurb when present; falls back to hardcoded blurb when not

**Run:**

```bash
npm run test:unit -- --run    # full unit suite (both projects)
npm run test:unit -- --run src/lib/utils/seo.spec.ts   # single file while iterating
```

E2E (`*.e2e.ts`) is not in scope for this plan — meta tags are server-rendered and well-covered by unit tests against the component and handlers.

---

## Verification

1. `npm run check` — TypeScript passes, no SvelteKit errors.
2. `npm run dev` and view-source on each route:
   - `/` — title, description, canonical, og:\* tags, Organization + WebSite JSON-LD blocks
   - `/services/<slug>` — same plus Service + BreadcrumbList JSON-LD
   - Robots meta absent unless `no_index`/`no_follow` set in Storyblok
3. **Fallback chain check**: In Storyblok, temporarily clear the home page's SEO blok; reload `/` and confirm tags fall back to globals SEO; clear globals SEO and confirm fallback to derived defaults (page title, no description).
4. **Storyblok overrides**: Set `no_index: true` on a service page → confirm `<meta name="robots" content="noindex">` appears and that the URL is excluded from `/sitemap.xml`.
5. Visit the new routes directly:
   - `/sitemap.xml` returns valid XML, includes home + all service pages with `published_at` lastmod values
   - `/robots.txt` returns expected text with Sitemap line
   - `/llms.txt` returns markdown summary listing services
6. Run `npx @lhci/cli autorun` (or open Chrome DevTools → Lighthouse → SEO) on `/` and `/services/<slug>` — expect SEO score 100.
7. Validate JSON-LD with Google's [Rich Results Test](https://search.google.com/test/rich-results) (paste the rendered HTML from `curl http://localhost:5173/` after `npm run dev`).
8. `npm run build && npm run preview` — confirm sitemap/robots/llms still serve correctly via the Cloudflare adapter.
