# Plan: Wire Storyblok "Globals" story into a layout-level Contact

## Context

A new `StoryblokGlobals` content type was added to [src/lib/types/storyblok.d.ts](src/lib/types/storyblok.d.ts#L155-L162) with `contact_eyebrow`, `contact_title`, `contact_copy`, and `contact_cta`. The existing [src/lib/components/Contact.svelte](src/lib/components/Contact.svelte) is currently rendered per-page from [src/routes/+page.svelte:18](src/routes/+page.svelte#L18) with all copy hardcoded.

The goal: make Contact a true global section by (a) sourcing its copy from the `globals` Storyblok story, (b) rendering it once from the root layout so it appears on every route, and (c) ensuring the globals fetch does not refire on each client navigation.

The example JSON shows the title uses inline tags Storyblok-side: `<un>vision</un>` (underline/scribble) and `<ha>focus.</ha>` (handwritten/`font-hand`). The existing [parseTitleSegments](src/lib/utils/format.ts#L37-L56) only handles `<un>`, so it needs a second tag. The CTA uses `linktype: 'email'`, which [resolveMultilink](src/lib/utils/links.ts#L14-L38) does not currently handle.

## Changes

### 1. Fetch globals in a new `+layout.server.ts` with edge cache headers

Create [src/routes/+layout.server.ts](src/routes/+layout.server.ts). This runs only on the server (Cloudflare Worker), keeps the Storyblok delivery token off the client, and lets us set HTTP cache headers that the Cloudflare edge will honor.

```ts
import type { ISbStoryData } from '@storyblok/js';
import type { StoryblokGlobals } from '$lib/types/storyblok';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ parent, setHeaders }) => {
	const { storyblokAPI, version } = await parent();
	setHeaders({
		'cache-control': 'public, s-maxage=300, stale-while-revalidate=3600'
	});
	try {
		const response = await storyblokAPI.get('cdn/stories/globals', { version });
		const globals: ISbStoryData<StoryblokGlobals> | null = response.data?.story ?? null;
		return { globals };
	} catch (e) {
		console.error('Failed to fetch globals:', e);
		return { globals: null };
	}
};
```

Why this caches well:

- `s-maxage=300` means Cloudflare's edge serves the same Worker response for 5 minutes; child page loads on the same edge POP reuse it.
- `stale-while-revalidate=3600` lets the edge keep serving the cached version while it refreshes in the background.
- Server load data is also automatically forwarded to the client on first paint and reused across SvelteKit client-side navigations (no URL/param deps → no rerun).
- In dev, this is bypassed automatically; in production-on-Cloudflare it stops `cdn/stories/globals` from being hit on every page request.

`+layout.ts` is left as-is — it already runs `storyblokInit` and exposes `storyblokAPI`/`version` for the server load via `await parent()`.

### 2. Extend `parseTitleSegments` to support `<ha>` (handwriting) in addition to `<un>` (underline)

Modify [src/lib/utils/format.ts](src/lib/utils/format.ts#L35-L56). `<ha>` should work structurally just like `<un>` does today — a parallel boolean flag, not a discriminated style enum. This keeps existing `seg.underline` checks in [Blog.svelte:57](src/lib/components/Blog.svelte#L57) working untouched.

```ts
export type TitleSegment = { text: string; underline: boolean; hand: boolean };

const TAG = /<(un|ha)>([\s\S]*?)<\/\1>/g;

export const parseTitleSegments = (title: string | null | undefined): TitleSegment[] => {
	if (!title) return [];
	const segments: TitleSegment[] = [];
	let lastIndex = 0;
	let match: RegExpExecArray | null;
	TAG.lastIndex = 0;
	while ((match = TAG.exec(title)) !== null) {
		if (match.index > lastIndex) {
			segments.push({
				text: title.slice(lastIndex, match.index),
				underline: false,
				hand: false
			});
		}
		segments.push({
			text: match[2],
			underline: match[1] === 'un',
			hand: match[1] === 'ha'
		});
		lastIndex = match.index + match[0].length;
	}
	if (lastIndex < title.length) {
		segments.push({
			text: title.slice(lastIndex),
			underline: false,
			hand: false
		});
	}
	return segments;
};
```

- Update existing tests in [src/lib/utils/format.spec.ts](src/lib/utils/format.spec.ts#L113-L168) so each expected segment carries `hand: false`.
- Add new test cases: a `<ha>`-only title, a mixed `<un>` + `<ha>` title (matching the example: `Bring your <un>vision</un> into <ha>focus.</ha>`).
- [Blog.svelte](src/lib/components/Blog.svelte#L57) needs no change — its `seg.underline` branch still works, and it never produces `<ha>` content today.

### 3. Extend `resolveMultilink` to handle `linktype: 'email'`

Modify [src/lib/utils/links.ts:14-38](src/lib/utils/links.ts#L14-L38) to add an `email` branch returning `{ href: 'mailto:' + link.email }`. The CTA in the example JSON has `email: "hello@brandenbuilds.com"`.

Add a test case in [src/lib/utils/links.spec.ts](src/lib/utils/links.spec.ts) covering the email branch.

### 4. Refactor Contact to consume globals (no fallback copy)

Modify [src/lib/components/Contact.svelte](src/lib/components/Contact.svelte):

- Add a `content?: StoryblokGlobals` prop (mirror the pattern in [Hero.svelte:7-10](src/lib/components/Hero.svelte#L7-L10)). Storyblok is the source of truth — no hardcoded fallback strings.
- At the top of the markup, gate the whole `<section>` on `content` being present: `{#if content}` … `{/if}`. If globals failed to load, the section renders nothing at all.
- Eyebrow: render `content.contact_eyebrow` directly. The existing `before:content-['●']` decoration stays; the `// ` prefix in the current markup is part of the user-authored string in the example JSON (`"// 06.contact"`), so do NOT add a literal `// ` in the template.
- Title: `parseTitleSegments(content.contact_title)` rendered as an `<h2>`. Per segment:
  - `seg.underline` → wrap in the existing `<span class="scribble">…<svg>…</svg></span>` (preserve the same SVG path used today for the underline scribble).
  - `seg.hand` → wrap in `<span class="font-hand font-bold text-charcoal">…</span>` (matches the current "hardening" treatment at [Contact.svelte:93](src/lib/components/Contact.svelte#L93)).
  - otherwise → plain text.
- Copy paragraph: `content.contact_copy` directly.
- CTA: take `content.contact_cta?.[0]`. Resolve its link via `resolveMultilink(cta.link)` (now email-aware) and use `cta.label` for the button text. If either is missing, omit the button.
- All plant/animation markup and `<style>` block are unchanged.

### 5. Move Contact rendering into `+layout.svelte`; remove from `+page.svelte`

In [src/routes/+layout.svelte](src/routes/+layout.svelte):

- Pull layout data: add `let { children, data } = $props();` and pass `content={data.globals?.content}` to a new `<Contact />` rendered between `{@render children()}` and `<Footer />` (Contact currently sits above the footer on the home page — preserve that order).
- Import `Contact` from `$lib/components/Contact.svelte`.

In [src/routes/+page.svelte](src/routes/+page.svelte): remove the `Contact` import and the `<Contact />` at line 18.

### 6. Update the existing Contact test

[src/lib/components/Contact.svelte.spec.ts](src/lib/components/Contact.svelte.spec.ts) currently renders `Contact` with no props and asserts on the hardcoded copy. Rewrite it to:

- Render with a mock `content: StoryblokGlobals` object (eyebrow, title containing `<un>` and `<ha>`, copy, and a CTA with an email link).
- Assert that the eyebrow, copy, and CTA label render; that the underline segment is wrapped in `.scribble`; that the hand segment is wrapped in `.font-hand`; that the CTA href is `mailto:…`.
- Add one case: rendering with no `content` prop produces no section at all (`container.querySelector('#contact')` is null).

## Critical files to modify

- [src/routes/+layout.server.ts](src/routes/+layout.server.ts) — **new file**: fetch globals, set cache headers
- [src/routes/+layout.svelte](src/routes/+layout.svelte) — render `<Contact>` here, wired to `data.globals?.content`
- [src/routes/+page.svelte](src/routes/+page.svelte) — remove `<Contact />`
- [src/lib/components/Contact.svelte](src/lib/components/Contact.svelte) — accept `content` prop; gate section on `content`; no hardcoded fallbacks
- [src/lib/utils/format.ts](src/lib/utils/format.ts) — parse `<ha>` in addition to `<un>` (additive `hand: boolean`)
- [src/lib/utils/format.spec.ts](src/lib/utils/format.spec.ts) — add `hand: false` to existing expectations, add `<ha>` and mixed cases
- [src/lib/utils/links.ts](src/lib/utils/links.ts) — handle `linktype: 'email'`
- [src/lib/utils/links.spec.ts](src/lib/utils/links.spec.ts) — new email-link test case
- [src/lib/components/Contact.svelte.spec.ts](src/lib/components/Contact.svelte.spec.ts) — rewrite around mock `content` prop

## Reused utilities (do not reimplement)

- [parseTitleSegments](src/lib/utils/format.ts#L37) — extend, don't duplicate
- [resolveMultilink](src/lib/utils/links.ts#L14) — extend, don't duplicate
- [Button](src/lib/components/Button.svelte) — already accepts `href`/`target`/`rel`

## Verification

1. `npm run check` — typecheck must pass with the new `globals` field on layout data and the updated `TitleSegment` shape (`hand: boolean`).
2. `npm run test:unit -- --run` — `parseTitleSegments` (new `<ha>` and mixed cases), `resolveMultilink` (new email case), and the rewritten `Contact.svelte.spec.ts` all pass.
3. `npm run dev` and open `/` — Contact section renders below the page with the title showing `vision` underlined-scribbled and `focus.` in the Caveat hand font, the Storyblok-authored copy, and a button labeled `hello@brandenbuilds.com` whose `href` is `mailto:hello@brandenbuilds.com`.
4. Navigate from `/` to another route (e.g. a blog post) — Contact still appears at the bottom, and the Network panel shows no second `cdn/stories/globals` request (client-side cached load data).
5. `npm run preview` — open the production-built app and inspect the response headers for any HTML route: `cache-control` should include `s-maxage=300, stale-while-revalidate=3600`. A second request to a different page should not trigger another `cdn/stories/globals` fetch within the s-maxage window.
6. Temporarily change the slug to a non-existent story — the Contact section should be omitted entirely (no errors, no empty shell).
