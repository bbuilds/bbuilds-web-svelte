# Replace PostCard image placeholder with Storyblok featured_image

## Context

[PostCard.svelte](src/lib/components/PostCard.svelte) currently renders a solid black placeholder (`<div class="aspect-video overflow-hidden bg-ink">`) where the article hero image should be. Blog posts in Storyblok already carry a `featured_image: StoryblokAsset` (see [src/lib/types/storyblok.d.ts:140](src/lib/types/storyblok.d.ts#L140)), but `Blog.svelte` doesn't extract it and `PostCard` doesn't accept it. Goal: render the real Storyblok image, responsively, served through Storyblok's image-transformation CDN.

## Approach

### 1. Add Storyblok image URL helper — NEW FILE

Create [src/lib/utils/storyblokImage.ts](src/lib/utils/storyblokImage.ts) with two pure helpers:

- `storyblokImageUrl(filename: string, opts: { width: number; height?: number; format?: 'webp' | 'jpeg' | 'png' | 'auto'; quality?: number }): string`
  - Returns `` `${filename}/m/${width}x${height ?? 0}/filters:format(${format}):quality(${quality})` ``.
  - Storyblok treats `0` in either dimension as "auto-scale to preserve aspect ratio".
  - Default format `webp`, default quality `80`.
- `storyblokImageSrcset(filename: string, widths: number[], opts?: { aspectRatio?: number; format?; quality? }): string`
  - Maps `widths` → `` `${storyblokImageUrl(...)} ${w}w` `` joined with `, `.
  - When `aspectRatio` is provided (e.g. `16/9`), computes `height = Math.round(width / aspectRatio)` so the cropped output matches the card's `aspect-video` frame; otherwise omits height (auto).

No URL parsing required — Storyblok accepts the `/m/...` suffix appended to any `a.storyblok.com/f/...` asset URL.

### 2. Update PostCard.svelte

[src/lib/components/PostCard.svelte](src/lib/components/PostCard.svelte):

- Import `StoryblokAsset` from `$lib/types/storyblok` and the two helpers from `$lib/utils/storyblokImage`.
- Add to `Props`: `image?: StoryblokAsset` and `eager?: boolean` (so the parent can mark the first card as priority).
- Replace [line 20](src/lib/components/PostCard.svelte#L20):

  ```svelte
  <div class="aspect-video overflow-hidden bg-ink">
  	{#if image?.filename}
  		<img
  			src={storyblokImageUrl(image.filename, { width: 800, height: 450 })}
  			srcset={storyblokImageSrcset(image.filename, [400, 600, 800, 1200], {
  				aspectRatio: 16 / 9
  			})}
  			sizes="(min-width: 64rem) 33vw, (min-width: 48rem) 50vw, 100vw"
  			alt={image.alt ?? ''}
  			width={image.width ?? undefined}
  			height={image.height ?? undefined}
  			loading={eager ? 'eager' : 'lazy'}
  			decoding="async"
  			fetchpriority={eager ? 'high' : 'auto'}
  			class="h-full w-full object-cover"
  		/>
  	{/if}
  </div>
  ```

  When `image` is missing, the existing black placeholder div remains, so the card layout is preserved.

- Notes:
  - `alt` falls back to `''` (decorative) rather than the title, because the title is already announced by the heading link directly below — duplicating it produces double announcements in screen readers.
  - `width`/`height` attributes come from `StoryblokAsset` and let the browser reserve correct intrinsic ratio before the image lands; the `aspect-video` wrapper still controls display ratio via `object-cover`.

### 3. Update Blog.svelte

[src/lib/components/Blog.svelte](src/lib/components/Blog.svelte):

- In the `cards` $derived block ([lines 22-37](src/lib/components/Blog.svelte#L22-L37)), add `image: story.content?.featured_image` to the returned object.
- In the `{#each}` block ([lines 82-91](src/lib/components/Blog.svelte#L82-L91)), pass `image={c.image}` and `eager={i === 0}` to `<PostCard>`.

### 4. (No changes needed) +page.ts

[src/routes/+page.ts](src/routes/+page.ts) already returns full `ISbStoryData<StoryblokBlogPost>` objects, so `content.featured_image` is already in the payload. No fetch changes.

## Critical files

- NEW — [src/lib/utils/storyblokImage.ts](src/lib/utils/storyblokImage.ts)
- EDIT — [src/lib/components/PostCard.svelte](src/lib/components/PostCard.svelte)
- EDIT — [src/lib/components/Blog.svelte](src/lib/components/Blog.svelte)

## Verification

1. `npm run check` — ensures the new `image` prop and helper types resolve cleanly.
2. `npm run dev`, open `/`, scroll to the blog section:
   - Each of the three cards shows its Storyblok hero image cropped to 16:9.
   - DevTools Network → Img: requests go to `a.storyblok.com/f/.../m/...x.../filters:format(webp)...`; appropriate width is picked per viewport.
   - First card request is sent eagerly (`fetchpriority=high`); subsequent cards lazy-load.
   - Resize through `md` (48rem) and `lg` (64rem) breakpoints — `sizes` recomputes and a different `srcset` candidate is fetched.
3. Posts missing `featured_image` still render with the black `bg-ink` placeholder — no broken-image icon, no layout shift.
4. Lighthouse the home page — verify no "image elements do not have explicit width and height" warning.
