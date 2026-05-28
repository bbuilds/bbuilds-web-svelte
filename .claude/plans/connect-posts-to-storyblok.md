# **Plan: Make Blog Post Route Dynamic (Storyblok)**

## **Context**

The `[slug]/+page.ts` route currently loads posts from a local TypeScript registry (`src/lib/posts/index.ts`) with hardcoded dummy content (`src/posts/detecting-memory-leaks.ts`). We're migrating to Storyblok CMS — the same pattern used for `services/[slug]`. Storyblok stores posts under the `posts/` folder, but the app serves them at root-level slugs (e.g. `/detecting-memory-leaks`, not `/posts/detecting-memory-leaks`). The sitemap also needs updating to include these posts.

---

## **Files to Modify**

### **1. `src/routes/[slug]/+page.ts` — Full rewrite**

Mirror the `services/[slug]/+page.ts` pattern exactly:

- Make load `async`, destructure `{ storyblokAPI, version, globals }` from `parent()`
- Fetch `cdn/stories/posts/${params.slug}` with `{ version }`
- 404 if no story returned
- Call `resolveSEO` with `pageSEO: story.content?.seo?.[0]`, `globalSEO: globals?.content?.seo?.[0]`, fallbacks for title + description, and `breadcrumbLd` (`Home → Blog → post name`)
- Return `{ story, seo }` (replaces `{ post, seo }`)

### **2. `src/routes/[slug]/+page.svelte` — Adapt for Storyblok story shape**

- Replace `data.post` → `data.story`
- Derive: `story.name`, `story.first_published_at`, `story.tag_list`, `story.content.featured_image`, `story.content.content`
- Pass `story.content?.content as unknown as RichTextDoc` to `RichTextRenderer` and `readTime` (structurally identical to Storyblok's richtext at runtime)
- Update `kickerTag` call to new signature: `kickerTag(story.content?.Category, story.tag_list ?? [])`
- Guard `featured_image?.filename` for null (Storyblok `StoryblokAsset.filename` can be `null`)
- Use `hero.alt || story.name` (not `??`) for the img `alt` — real responses return `alt: ""` (empty string), which `??` won't catch

### **3. `src/lib/utils/format.ts` — Update `kickerTag` signature**

```tsx
// Before
export const kickerTag = (post: Post): string =>

// After
export const kickerTag = (category: (number | string)[] | undefined, tagList: string[]): string => {
    const cats = (category ?? []).filter((c): c is string => typeof c === 'string');
    if (cats.length > 0) return cats[0];
    if (tagList.length > 0) return tagList[0];
    return 'Writing';
};
```

Remove the `Post` import from this file.

### **4. `src/lib/types/post.ts` — Remove `Post` and its `StoryblokAsset`**

Keep `RichTextMark`, `RichTextNode`, `RichTextDoc` (still used by `RichTextRenderer.svelte`, `format.ts`). Delete the `Post` interface and its local `StoryblokAsset`.

### **5. `src/routes/sitemap.xml/+server.ts` — Map `posts/*` slugs**

Update `pathForSlug`:

```tsx
if (slug.startsWith('posts/')) return `/${slug.slice('posts/'.length)}`;
```

Insert after the `services/` branch.

---

## **Files to Create**

### **6. `src/routes/[slug]/page.spec.ts` — Unit tests for load function**

Mock `storyblokAPI.get`, `resolveSEO` (or test its output), and `parent()`. Cover:

- Returns `{ story, seo }` on success
- Throws 404 when story is missing
- Re-throws SvelteKit errors (status in error object)
- Breadcrumb JSON-LD includes `Home`, `Blog`, post name

### **7. Update `src/routes/sitemap.xml/server.spec.ts` — Add blog post cases**

Add tests:

- `posts/my-post` maps to `/${SITE_URL}/my-post`
- `posts/` folder is excluded
- Unpublished post excluded
- Non-`posts/` story still excluded

---

## **Files to Delete**

- `src/posts/detecting-memory-leaks.ts`
- `src/lib/posts/index.ts`

---

## **Existing Utilities to Reuse**

- `resolveSEO` — `src/lib/utils/seo.ts`
- `breadcrumbLd` — `src/lib/utils/jsonLd.ts`
- `SITE_URL`, `SITE_NAME` — `src/lib/config/site.ts`
- `RichTextRenderer`, `PostHeader`, `PostSidebar`, `ReadingProgress`, `NextPostCard` — no structural changes needed
- Error-handling pattern: re-throw if `'status' in e`, else `error(404, ...)` — same as services

---

## **Verification**

1. `npm run check` — no TS errors
2. `npm run test:unit -- --run src/routes/\[slug\]` — new page spec passes
3. `npm run test:unit -- --run src/routes/sitemap` — sitemap spec passes (including new blog cases)
4. `npm run dev` — visit a real post slug served from Storyblok; confirm title, image, rich text render
5. Confirm `/sitemap.xml` includes the post URL without `posts/` prefix
