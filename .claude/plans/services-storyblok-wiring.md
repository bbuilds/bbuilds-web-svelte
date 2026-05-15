# Plan: Connect Services.svelte to Storyblok

## Context

The home page hero is already wired to Storyblok (see [src/lib/components/Hero.svelte](src/lib/components/Hero.svelte) and [src/routes/+page.ts](src/routes/+page.ts)), but `Services.svelte` still ships a hard-coded `SERVICES` array. The `Home Page` story already has a `featured_services` field — an array of references to `Services Template` stories — so all the content exists in Storyblok; the front end just isn't reading it.

This change resolves those references and renders each linked `Services Template` as a chapter in the accordion, while keeping the existing static array as a fallback (mirroring how Hero handles missing content). Outcome: editors can manage the five service chapters in Storyblok and the home page reflects edits without code changes.

## Approach

### 1. Resolve relations in the page load

File: [src/routes/+page.ts](src/routes/+page.ts)

Pass `resolve_relations` so the SDK swaps the UUIDs on `content.featured_services` with the full `ISbStoryData<StoryblokServicesTemplate>` objects:

```ts
const response = await storyblokAPI.get('cdn/stories/home-page', {
	version,
	resolve_relations: ['Home Page.featured_services']
});
```

**Syntax verified against the SDK and the user-supplied API payload:**

- Per the [Storyblok docs](https://www.storyblok.com/docs/concepts/references#resolve-relations-in-api-requests), the format is `"ComponentTechnicalName.fieldName"` (comma-separated or array for multiple).
- The `storyblok-js-client` SDK (used under the hood by `@storyblok/svelte`) builds the match path as `` `${jtree.component}.${treeItem}` `` — see `_insertRelations` in `node_modules/storyblok-js-client/dist/index.umd.js:660-665`. So the string must match `jtree.component` _exactly_ as it appears in the API response.
- In the sample payload `content.component === "Home Page"` (with a space), so the correct value is literally `'Home Page.featured_services'`. (Storyblok permits spaces in component names; the docs' snake_case examples are convention, not a hard requirement — the SDK does a literal string match.)
- When matched, `_resolveField` (`index.umd.js:637-641`) replaces the UUID strings on the content object **in place** with the full resolved story objects — the data ends up at `story.content.featured_services[i]`, not at `response.data.rels` (which the SDK clears after inlining). This matches the existing union on [storyblok.d.ts:142](src/lib/types/storyblok.d.ts#L142) (`ISbStoryData<StoryblokServicesTemplate> | string`).
- Passing the parameter implicitly sets `resolve_level = 2` on the request (required for inlining); no extra config needed.

No type or schema regeneration needed — `featured_services` is already typed as `(ISbStoryData<StoryblokServicesTemplate> | string)[]`, so the mapping code must narrow each entry to the resolved-object case and defensively skip any entries that are still strings.

### 2. Pass content through

File: [src/routes/+page.svelte:11](src/routes/+page.svelte#L11)

```svelte
<Services content={data.story?.content as StoryblokHomePage | undefined} />
```

### 3. Drive Services from `content.featured_services`

File: [src/lib/components/Services.svelte](src/lib/components/Services.svelte)

Mirror the Hero pattern ([Hero.svelte:7-31](src/lib/components/Hero.svelte#L7-L31)):

- Add `Props { content?: StoryblokHomePage }` and `let { content }: Props = $props();`.
- Import `renderRichText` from `@storyblok/svelte` (confirmed re-exported from `@storyblok/js`; see `node_modules/@storyblok/svelte/dist/index.d.ts`).
- Build a `$derived` `chapters` array. When `content?.featured_services` contains resolved story objects, map each one to:
  - `n`: `String(i + 1).padStart(2, '0')` (Storyblok doesn't store the number).
  - `title`: `story.content.card_title` (e.g. "Continuity & Growth").
  - `itemsHtml`: `story.content.card_list_items ? renderRichText(story.content.card_list_items) : ''`.
  - Guard: skip entries that are still strings (unresolved) — defensive in case `resolve_relations` is misconfigured.
- The existing `sub` field on the static `SERVICES` array (e.g. "The Lifecycle") is **never rendered** by the current template ([Services.svelte:168-175](src/lib/components/Services.svelte#L168-L175) only outputs `n`, `title`, and the `[+]`/`[-]` indicator), so we don't need a Storyblok source for it. The static `sub` can stay in the fallback data unused, or be removed in cleanup.
- When no resolved data is present, fall back to the existing static `SERVICES` constant (keeps the component renderable in tests and when the API fails).
- Template change inside the `{#each chapters as s}` body: if `s.itemsHtml` is set, render `{@html s.itemsHtml}` wrapped in a container with the existing Tailwind grid/typography classes; otherwise render the existing `{#each s.items as it}` loop.

#### Richtext shape (from sample `card_list_items`)

```
doc
└── bullet_list
    └── list_item
        └── paragraph
            ├── text { marks: [bold] }       ← e.g. "Generative Engine Optimization (GEO)."
            └── text { marks: [textStyle] }  ← description starting with " " (leading space)
```

`renderRichText` produces a `<ul><li><p><strong>...</strong>...</p></li></ul>` tree. To keep the existing mono-font/leading look without per-item icons, scope the styling via a CSS class on the wrapping container (e.g. `services-richtext`) and target `ul`, `li`, `strong` from inside the component `<style>` block. Note: some text nodes carry a `textStyle` mark with an explicit hex color (`#3A3528`) — these will render as inline `<span style="color:..">`. If the design demands a single color, we can pass a custom resolver to `renderRichText` to strip `textStyle` marks; default approach is to let them through.

### 4. Tests

File: [src/lib/components/Services.svelte.spec.ts](src/lib/components/Services.svelte.spec.ts)

- Fix the stale assertion: lines 29 and 47/53 reference "Discovery & Architecture" but [Services.svelte:5](src/lib/components/Services.svelte#L5) renamed it to "Discovery & Transformation". This test is failing today regardless of this work and should be corrected as part of the change.
- Add a new test that renders `<Services content={mockContent} />` with a minimal `featured_services` array (two resolved `StoryblokServicesTemplate` stubs) and asserts the rendered `h3` titles come from the mock rather than the static fallback. Also assert that an item from the mock `card_list_items` richtext (e.g. a `strong` text node) is present in the DOM.

## Critical files

- [src/routes/+page.ts](src/routes/+page.ts) — add `resolve_relations`.
- [src/routes/+page.svelte](src/routes/+page.svelte) — pass `content` to `<Services>`.
- [src/lib/components/Services.svelte](src/lib/components/Services.svelte) — accept prop, derive chapters, render richtext or static fallback.
- [src/lib/components/Services.svelte.spec.ts](src/lib/components/Services.svelte.spec.ts) — fix stale titles, add content-driven test.

## Reused utilities / patterns

- Prop + `$derived` fallback shape from [Hero.svelte:7-31](src/lib/components/Hero.svelte#L7-L31).
- `renderRichText` from `@storyblok/svelte` (re-export of `@storyblok/js`) — confirmed via `node_modules/@storyblok/svelte/dist/index.d.ts`.
- Existing types `StoryblokHomePage` and `StoryblokServicesTemplate` from [src/lib/types/storyblok.d.ts](src/lib/types/storyblok.d.ts) — no regeneration needed.

## Verification

1. `npm run check` — verify the `featured_services` array is typed as resolved stories (not `string`) after the change compiles cleanly.
2. `npm run test:unit -- --run src/lib/components/Services.svelte.spec.ts` — passes both the corrected static-fallback assertions and the new content-driven test.
3. `npm run dev` — load `/` in the browser:
   - Confirm the five service chapters in Storyblok render (titles from `card_title`, bullet items from `card_list_items`).
   - Toggle each accordion; first chapter opens by default.
   - In Storyblok, edit `card_title` on one `Services Template` story, save as draft, reload locally (DEV uses `version: 'draft'` per [+layout.ts:13](src/routes/+layout.ts#L13)) and confirm the new title appears.
4. Temporarily clear `featured_services` in Storyblok (or comment out the resolved branch) and reload to confirm the static fallback still renders the original five chapters.
