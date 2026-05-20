# Connect Blog.svelte to Storyblok

## Context

The home page's Blog section currently renders a hardcoded array of three posts in [src/lib/components/Blog.svelte](src/lib/components/Blog.svelte). We need to drive it from Storyblok:

- The Home Page story has an `articles` field (array of `Article Cards` blocks). Each `Article Cards` block has an `articles` relation to `Blog Post` stories.
- Posts live under the `posts/` folder in Storyblok.
- If the explicit `Article Cards.articles` relation has fewer than three entries, backfill with the most recent posts from the `posts/` folder (excluding duplicates).
- Section eyebrow / title / copy should come from the Home Page fields (`blog_eyebrow`, `blog_title`, `blog_copy`) — no static fallback.
- Each card uses the post's `summary` field for the blurb.
- All field access uses null checks; if a field is missing, that element is hidden (no dummy text).

## Decisions (confirmed with user)

- Card href: `/{story.slug}` (flat — matches existing `src/routes/[slug]` route).
- Tag/category chip source: `content.Category[0]`.
- No static fallback content — if a field is missing, omit the element.

## Files to modify

### 1. [src/routes/+page.ts](src/routes/+page.ts)

Extend the existing load function:

- Add `'Article Cards.articles'` to `resolve_relations` (alongside the current `'Home Page.featured_services'`) so the nested `Article Cards` block returns hydrated `ISbStoryData<StoryblokBlogPost>` entries instead of UUID strings.
- After fetching the story, extract the resolved articles list defensively:
  - `const content = story?.content as StoryblokHomePage | undefined`
  - `const block = content?.articles?.[0]`
  - `const explicit = (block?.articles ?? []).filter((a): a is ISbStoryData<StoryblokBlogPost> => typeof a !== 'string' && a !== null)`
- If `explicit.length < 3`, fetch fill-in posts:
  - `storyblokAPI.get('cdn/stories', { version, starts_with: 'posts/', sort_by: 'first_published_at:desc', per_page: 3, is_startpage: false })`
  - Fetching exactly `per_page: 3` is sufficient. Worst case: all `explicit` entries collide with the top 3 most recent — that still leaves `3 - explicit.length` unique posts available, which is exactly what we need to fill.
  - Filter out any whose `uuid` is already in `explicit`.
  - Append until we have at most 3 total.
- Error handling — every external call must be guarded:
  - **Outer try/catch** wraps the home-page story fetch. On failure: `console.error(e)` and return `{ story: null, posts: [] }`. Do not throw.
  - **Inner try/catch** wraps the recent-posts fetch. On failure: `console.error(e)` and continue with just `explicit` (which may be fewer than 3). Do not throw — the page should still render with whatever was successfully resolved.
  - Guard `response.data?.stories` defensively (fall back to `[]`) in case Storyblok returns an unexpected shape.
- Return `{ story: response.data.story, posts }` where `posts` is the final array of up to 3 `ISbStoryData<StoryblokBlogPost>`.

### 2. [src/routes/+page.svelte](src/routes/+page.svelte)

Pass the resolved posts to the Blog component. `content` is already derived defensively from `data.story?.content` and may be `undefined` when the story fetch failed — that's fine, `Blog` accepts `content` as optional. `data.posts` is always at least `[]` (set in the load function's failure paths), so no extra fallback is needed at the call site:

```svelte
<Blog {content} posts={data.posts} />
```

### 3. [src/lib/components/Blog.svelte](src/lib/components/Blog.svelte)

Rewrite the script block:

- Delete the hardcoded `POSTS` array entirely.
- Props:

  ```ts
  import type { ISbStoryData } from '@storyblok/js';
  import type { StoryblokHomePage, StoryblokBlogPost } from '$lib/types/storyblok';

  interface Props {
  	content?: StoryblokHomePage;
  	posts?: ISbStoryData<StoryblokBlogPost>[];
  }
  let { content, posts = [] }: Props = $props();
  ```

- Derive section fields from `content` with optional chaining — no fallback strings:
  ```ts
  const eyebrow = $derived(content?.blog_eyebrow);
  const title = $derived(content?.blog_title);
  const copy = $derived(content?.blog_copy);
  ```
- Map each story to the existing `PostCard` props (interface from [src/lib/components/PostCard.svelte](src/lib/components/PostCard.svelte#L2-L10)):
  Every field access must be optional-chained or coalesced — a malformed story (missing `content`, missing `slug`, missing `first_published_at`) must not throw. Filter out unroutable stories (no slug) before mapping:

  ```ts
  const cards = $derived(
  	posts
  		.filter((story) => story && story.slug)
  		.map((story) => {
  			const published = story.first_published_at ?? story.published_at ?? null;
  			return {
  				key: story.uuid ?? story.slug,
  				tag: String(story.content?.Category?.[0] ?? ''),
  				datetime: published ?? '',
  				date: published ? formatDate(published) : '',
  				title: story.name ?? '',
  				blurb: story.content?.summary ?? '',
  				href: `/${story.slug}`
  			};
  		})
  );
  ```

  Reuses [formatDate](src/lib/utils/format.ts#L5) from `$lib/utils/format`.

- Template changes:
  - Eyebrow line: only render the `// {eyebrow}` div when `eyebrow` is truthy.
  - `<h2>`: render only when `title` is truthy (keep the "Recent posts." scribble structure but bind `title` into it, or skip the whole `<h2>` when missing — see Render notes below).
  - Copy paragraph: only render when `copy` is truthy.
  - Cards loop:
    ```svelte
    {#each cards as c, i (c.key)}
    	<PostCard
    		tag={c.tag}
    		date={c.date}
    		datetime={c.datetime}
    		title={c.title}
    		blurb={c.blurb}
    		href={c.href}
    		index={i}
    	/>
    {/each}
    ```
  - "view all posts →" Button: leave as-is for now (its href is out of scope for this task).

#### Render notes for the heading

The current `<h2>` contains the static text `Recent <span class="scribble">posts ...</span>.` Since `blog_title` is now a single string field, we render it as one block. Render `{title}` inside the existing `<span class="scribble">` wrapper so the underline SVG still shows, and only render the `<h2>` when `title` is truthy.

## Verification

1. Run `npm run check` — confirm no TypeScript errors after the refactor.
2. Run `npm run dev` and load the home page in a browser.
   - Confirm three cards render with real Storyblok content (title from `story.name`, blurb from `story.content.summary`, date from `first_published_at`).
   - Confirm clicking a card navigates to `/{slug}` (404 is expected until the post page route is wired — out of scope).
3. In Storyblok, temporarily reduce the `Article Cards.articles` relation to 1 or 2 posts. Reload — confirm the remaining slots fill from the most recent `posts/` stories and no post is duplicated.
4. In Storyblok, clear the `Article Cards.articles` relation entirely. Reload — confirm three most-recent posts from `posts/` fill all slots.
5. Temporarily clear `blog_eyebrow` / `blog_title` / `blog_copy` on the Home Page story and reload — confirm those elements are hidden rather than showing fallback text.
6. Error-path sanity check: temporarily break the Storyblok delivery token (e.g. set `VITE_STORYBLOK_DELIVERY_API_TOKEN` to a bad value) and reload — confirm the page still renders without throwing, the section shows no cards, and a console error is logged. Restore the token after.
7. Use the Svelte MCP `svelte-autofixer` against the rewritten `Blog.svelte` before declaring complete.

## Out of scope

- Building a `/posts/[slug]` (or `/[slug]` Storyblok-backed) route to actually render the linked post pages.
- The "view all posts →" Button destination.
- Migrating the existing local-posts registry in [src/lib/posts/index.ts](src/lib/posts/index.ts) to Storyblok.
