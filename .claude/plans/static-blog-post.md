# Static Blog Post Page — `domain.com/[slug]`

## Context

The site currently has only a homepage. We need a **static default blog post page** that:

1. Renders one example post (migrating [`detecting-memory-leaks.mdx`](https://raw.githubusercontent.com/bbuilds/brandenbuilds-website-nextjs/refs/heads/main/data/posts/detecting-memory-leaks.mdx) from the legacy Next.js site) to validate the design.
2. Lives at the root URL `domain.com/[slug]` (not `/posts/[slug]`) using SvelteKit dynamic routing.
3. Stores post source data in a `src/posts/` folder (separate from routes).
4. Uses Tailwind v4 utilities — tokens already wired into `@theme` in [design.css](src/lib/styles/design.css).
5. Uses **picsum.photos** placeholders for hero images.
6. Is structured so the future Storyblok migration is a **near-zero-translation drop-in** — the static post is authored in Storyblok's own rich-text JSON shape, and the renderer walks that exact tree.

Design source: [blog-post.html](llm_docs/brandenbuilds-claude-design/project/blog-post.html) (React/JSX reference — porting to Svelte 5 runes + Tailwind).

Storyblok shape evidence: the user shared a published "Blog Post" story (slug `posts/interview-with-codehs`). Its `content` field is the standard Storyblok rich-text doc `{ type: 'doc', content: [...] }` with paragraph/text nodes carrying `marks: [{ type: 'link' | 'underline' | 'textStyle' | 'bold' | ... }]`. The Storyblok config is at [storyblok.config.ts](storyblok.config.ts) (generates `storyblok.d.ts` with `Storyblok`-prefixed types when `npm run types:storyblok` runs).

## Approach

### 1. Content shape mirrors Storyblok exactly

**`src/lib/types/post.ts`** — type the Storyblok rich-text node tree directly, plus a `Post` envelope that mirrors the relevant story + content fields:

```ts
// Inline mark on a text node — covers what Storyblok's editor emits
export type RichTextMark =
	| { type: 'bold' }
	| { type: 'italic' }
	| { type: 'underline' }
	| { type: 'strike' }
	| { type: 'code' }
	| { type: 'textStyle'; attrs?: { color?: string } }
	| {
			type: 'link';
			attrs: {
				href: string;
				target?: string | null;
				linktype?: 'url' | 'story' | 'email' | 'asset';
				anchor?: string | null;
				uuid?: string | null;
			};
	  };

// Recursive node — paragraph/heading/list/listItem/blockquote/code_block/horizontal_rule/hard_break/image/text
export interface RichTextNode {
	type: string;
	content?: RichTextNode[];
	marks?: RichTextMark[];
	text?: string;
	attrs?: Record<string, unknown>; // e.g. heading level, image src/alt, code_block language
}

export interface RichTextDoc {
	type: 'doc';
	content: RichTextNode[];
}

export interface StoryblokAsset {
	filename: string;
	alt?: string;
	title?: string;
}

// Story + content envelope — fields chosen to match Storyblok's Blog Post story payload
export interface Post {
	slug: string; // story.slug (leaf only, e.g. 'detecting-memory-leaks')
	name: string; // story.name → page title
	first_published_at: string; // ISO from story.first_published_at
	tag_list: string[]; // story.tag_list → topic pills
	content: {
		summary: string;
		featured_image: StoryblokAsset;
		Category: string[]; // story.content.Category → kicker tag (first item)
		content: RichTextDoc; // story.content.content
	};
}
```

This is exactly the subset of Storyblok's payload our UI needs. When migration happens, `getPost(slug)` becomes the Storyblok API call and returns this same shape (with `story.content.content` already being the rich-text doc).

### 2. Static post — `src/posts/detecting-memory-leaks.ts`

Exports a `Post` object whose `content.content` is a hand-authored Storyblok-shaped rich-text doc. Concretely the doc covers:

- `paragraph` nodes with `text` nodes (some carrying `marks: [{ type: 'link', attrs: { href, target: '_blank', linktype: 'url' } }]`, `{ type: 'bold' }`, `{ type: 'code' }`).
- `heading` nodes with `attrs: { level: 2 | 3 }`.
- `bullet_list` containing `list_item` nodes (each holding a `paragraph`) — matching Storyblok's bullet-list emission.
- One `code_block` with `attrs: { language: 'bash' }` for the Fuite tool output.

Story-level fields:

- `slug: 'detecting-memory-leaks'`
- `name: 'Detecting Memory Leaks'`
- `first_published_at: '2022-01-17T00:00:00.000Z'`
- `tag_list: ['fuite', 'memory leaks', 'dev tools']`
- `content.summary: 'Recently came across a tool Fuite to detect memory leaks in your web apps and gave it a run.'`
- `content.featured_image.filename: 'https://picsum.photos/seed/detecting-memory-leaks/1280/560'`
- `content.Category: ['Performance']` (kicker tag, since the legacy MDX has `genre: 'debugging'` — using "Performance" to match the design's tone)

### 3. Post registry — `src/lib/posts/index.ts`

```ts
import detectingMemoryLeaks from '../../posts/detecting-memory-leaks';
import type { Post } from '$lib/types/post';

const posts: Record<string, Post> = {
	'detecting-memory-leaks': detectingMemoryLeaks
};

export const getPost = (slug: string): Post | undefined => posts[slug];
export const listPosts = (): Post[] => Object.values(posts);
```

The seam for Storyblok later: replace the body of `getPost` with a Storyblok API call (`cdn/stories/posts/${slug}` — note the `posts/` prefix in Storyblok's tree even though our URL is just `/[slug]`).

### 4. Route — `src/routes/[slug]/`

**`src/routes/[slug]/+page.ts`**:

```ts
import { error } from '@sveltejs/kit';
import { getPost } from '$lib/posts';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const post = getPost(params.slug);
	if (!post) error(404, 'Post not found');
	return { post };
};
```

Throws 404 for unknown slugs. Existing routes (`/demo`, future `/about`, etc.) take precedence over `[slug]`.

**`src/routes/[slug]/+page.svelte`** — assembles the page using the components below. Pulls `post` from `data`, sets `<svelte:head>` title (from `post.name`) and meta description (from `post.content.summary`).

### 5. View-model helpers — `src/lib/posts/format.ts`

Small pure functions called from the page:

- `formatDate(iso: string): string` → e.g. `'Jan 17, 2022'`
- `wordCount(doc: RichTextDoc): number` → walks the tree, sums `text` lengths split on whitespace.
- `readTime(doc: RichTextDoc): string` → `Math.max(1, Math.round(wordCount(doc) / 200)) + ' min read'`.
- `kickerTag(post: Post): string` → first of `post.content.Category`, falling back to first `tag_list` entry, falling back to `'Writing'`.

These keep the page template clean and are easy to unit-test.

### 6. Components — `src/lib/components/`

All built with **Tailwind utilities only**, leveraging the existing tokens (`text-yellow`, `bg-paper`, `border-paper-line`, `font-mono`, `font-hand`, etc.) and the existing shared classes from [design.css](src/lib/styles/design.css) (`.container`, `.paper-bg`, `.scribble`).

- **`PostHeader.svelte`** — props: `{ name, kicker, dateDisplay, readTime, topics }`. Breadcrumb, kicker row (tag · date · readTime), `h1`, topic-tag pills (from `tag_list`), mobile share strip. Wraps in `.paper-bg`.
- **`PostSidebar.svelte`** — desktop-only (`hidden lg:flex`), sticky at `top-22`. Contains `<ShareButtons variant="sidebar" />`, divider, back-to-blog link, optional previous-post link.
- **`RichTextRenderer.svelte`** — the heart of the body rendering. Props: `{ doc: RichTextDoc }`. Recursively walks the node tree and dispatches via Svelte's `{#if}/{:else if}` on `node.type`:
  - `paragraph` → `<p class="font-sans text-[1.0625rem] leading-[1.78] text-body mb-[1.375rem] text-pretty">` (lede styling for the first paragraph is applied via the scoped rule in §7).
  - `heading` → `<h2>` or `<h3>` keyed on `attrs.level`. h2: `mt-12 mb-4 inline-block border-b-2 border-[#ffcd67] pb-2 text-2xl font-bold tracking-[-0.025em] text-ink md:text-3xl`. h3: `mt-8 mb-2.5 text-lg font-semibold tracking-[-0.015em] text-ink`.
  - `bullet_list` → `<ul class="flex flex-col gap-2 mb-[1.375rem]">`; each `list_item` becomes `<li class="relative pl-[1.375rem] before:content-['—'] before:absolute before:left-0 before:top-0.5 before:font-mono before:text-[0.875rem] before:text-yellow font-sans text-base leading-[1.72] text-body">`. The `list_item`'s child paragraph is unwrapped (skip the `<p>`) so list items render inline.
  - `ordered_list` → mirror of `bullet_list` with `<ol>` and numeric counter via CSS counter or `list-decimal list-inside`.
  - `code_block` → `<pre class="font-mono bg-paper-2 rounded-lg overflow-x-auto text-[0.8125rem] leading-[1.55] p-4 my-6 border border-paper-line"><code>{...}</code></pre>`. The `attrs.language` is stored as a data attribute for future Shiki/Prism hookup; no highlighting in this pass.
  - `blockquote` → `<blockquote class="my-8 py-[1.125rem] px-6 border-l-[3px] border-[#ffcd67] bg-yellow/5 rounded-r-lg font-mono text-[0.9375rem] leading-[1.65] italic text-body">`.
  - `image` → `<figure class="my-6"><img src={attrs.src} alt={attrs.alt ?? ''} class="rounded-lg w-full" />{#if attrs.caption}<figcaption class="mt-2 font-mono text-xs text-muted text-center">{attrs.caption}</figcaption>{/if}</figure>`.
  - `hard_break` → `<br />`. `horizontal_rule` → `<hr class="my-8 border-paper-line" />`.
  - `text` → renders raw text, but each text node may carry `marks: [...]`. A small `applyMarks(text, marks)` helper wraps the text in nested elements:
    - `bold` → `<strong class="text-ink font-bold">`
    - `italic` → `<em>`
    - `underline` → `<span class="underline underline-offset-[0.2em]">` (or just `<u>`)
    - `strike` → `<s>`
    - `code` → `<code class="font-mono text-[0.875em] bg-paper-2 px-1.5 py-0.5 rounded text-ink-soft">`
    - `link` → `<a href={attrs.href} target={attrs.target ?? undefined} rel={attrs.target === '_blank' ? 'noopener noreferrer' : undefined} class="text-yellow underline decoration-1 underline-offset-[0.2em] hover:text-ink transition-colors">`
    - `textStyle` with color → emit inline style `style="color: {attrs.color}"` (rarely used, but Storyblok emits it for the editor's text color picker).
  - Marks are applied in array order, innermost wrapped first to outermost — implemented as a small recursive helper component (`<RichTextText {node} />`) so Svelte handles the nesting cleanly without `{@html}`.
- **`ReadingProgress.svelte`** — fixed top bar. `$effect` attaches a passive `scroll` listener that scales `<div class="origin-left h-[0.1875rem] bg-gradient-to-r from-yellow to-[#ffcd67]">` via `transform: scaleX(...)`. Cleanup on destroy.
- **`ShareButtons.svelte`** — `variant: 'sidebar' | 'mobile'`. X intent URL, LinkedIn share URL, copy-to-clipboard with 2s "Copied!" state via `$state`. Uses `page.url.href` (from `$app/state`) for the URL so SSR doesn't read `window`. SVG icons inline.
- **`NextPostCard.svelte`** — "continue reading" card at end of article. For the static default, takes an optional `prev` prop; if absent, the component renders nothing.

### 7. Article container — first-paragraph lede styling

The design calls for the first paragraph of the article to be larger (`text-[1.125rem] text-ink-soft`). Easiest: in the article wrapper inside `+page.svelte`, add a single scoped CSS rule:

```svelte
<style>
	.post-body :global(> p:first-of-type) {
		font-size: 1.125rem;
		line-height: 1.72;
		color: var(--ink-soft);
	}
</style>
```

(Tailwind v4 has no native `first-of-type:` modifier for child selectors across components — a 3-line scoped rule is cleaner than restructuring the renderer to special-case the first paragraph.)

### 8. Reuse / leave alone

- Header / Footer / BottomNav come from `+layout.svelte` — no changes needed.
- `.paper-bg`, `.container`, `.scribble` already in [design.css](src/lib/styles/design.css) — reuse.
- Existing [Blog.svelte](src/lib/components/Blog.svelte) and [PostCard.svelte](src/lib/components/PostCard.svelte) on the homepage are untouched in this pass.

## Why we don't use `@storyblok/svelte`'s rich-text resolver

The Storyblok JS rich-text library returns HTML strings (and a Svelte wrapper exists), but it applies generic class names. The design has very specific styling (yellow underline under h2, em-dash list bullets, custom blockquote, pill kicker). Writing our own recursive renderer over the same node shape:

- Lets us hit every styled state with first-class Tailwind utilities (no `{@html}` + prose-override fight).
- Gives us a single place to extend for new node types as the editor's blocks expand.
- Is genuinely small (~80 lines for the renderer + ~30 for the text/marks helper).

Migrating later only requires changing the data source, not the renderer.

## Files created

- [src/lib/types/post.ts](src/lib/types/post.ts)
- [src/lib/posts/index.ts](src/lib/posts/index.ts)
- [src/lib/posts/format.ts](src/lib/posts/format.ts)
- [src/posts/detecting-memory-leaks.ts](src/posts/detecting-memory-leaks.ts)
- [src/lib/components/PostHeader.svelte](src/lib/components/PostHeader.svelte)
- [src/lib/components/PostSidebar.svelte](src/lib/components/PostSidebar.svelte)
- [src/lib/components/RichTextRenderer.svelte](src/lib/components/RichTextRenderer.svelte)
- [src/lib/components/RichTextText.svelte](src/lib/components/RichTextText.svelte)
- [src/lib/components/ReadingProgress.svelte](src/lib/components/ReadingProgress.svelte)
- [src/lib/components/ShareButtons.svelte](src/lib/components/ShareButtons.svelte)
- [src/lib/components/NextPostCard.svelte](src/lib/components/NextPostCard.svelte)
- [src/routes/[slug]/+page.svelte](src/routes/%5Bslug%5D/+page.svelte)
- [src/routes/[slug]/+page.ts](src/routes/%5Bslug%5D/+page.ts)

## Files modified

- None.

## Verification

1. `npm run dev` and visit `http://localhost:5173/detecting-memory-leaks` — confirm end-to-end render: header kicker (tag · date · readTime), `h1`, topic pills from `tag_list`, hero `<img>` from picsum, body (lede paragraph larger, h2 with yellow underline, h3, em-dash bullet list, fenced code block from Fuite output, inline `<a>` / `<strong>` / `<code>` rendered from `marks`), desktop sidebar (share + back + prev) only at `≥64rem`, mobile share strip only `<64rem`, reading-progress bar scales on scroll.
2. Visit `http://localhost:5173/does-not-exist` — confirm SvelteKit 404 page renders.
3. Resize across breakpoints (`<48rem`, `48–64rem`, `≥64rem`): sidebar hides under 64rem, mobile-share strip hides ≥64rem, bottom nav appears under 48rem.
4. DevTools: no console errors. After navigating away, confirm the scroll listener detached (trust the `$effect` cleanup; smoke-check by adding a console.log in the cleanup during dev).
5. `npm run check` — TypeScript clean.
6. `npm run lint` — Prettier + ESLint pass.
7. `npm run build` — Cloudflare Workers build succeeds.

## Out of scope / follow-ups

- Wiring homepage `PostCard` hrefs to real slugs.
- A `/writing` or `/blog` index page listing all posts ([blog-index.html](llm_docs/brandenbuilds-claude-design/project/blog-index.html) is the design).
- **Storyblok migration**: replace `getPost()` in [src/lib/posts/index.ts](src/lib/posts/index.ts) with a Storyblok API call to `cdn/stories/posts/${slug}` and adapt the returned story into the `Post` envelope. The `RichTextRenderer` consumes Storyblok's rich-text JSON unchanged. Run `npm run types:storyblok` to generate `StoryblokBlogPost` types from the live space and import them in place of the hand-written subset where useful.
- Storyblok prev/next: list posts via `cdn/stories?starts_with=posts/&sort_by=first_published_at:desc`, find the neighbour, populate `NextPostCard`.
- Syntax highlighting in `code_block` (Shiki/Prism — later concern; the `attrs.language` is already carried on the node).
- Modeling kicker tag + topics in Storyblok: the example story has `Category: []` and `tag_list: []`. Either start populating `Category` (first item = kicker) and `tag_list` (topic pills), or add a dedicated `kicker` field on the Blog Post content type. Plan currently reads from `Category[0]` with `tag_list` fallback.
