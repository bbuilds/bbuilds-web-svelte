# Wire Storyblok content into Hero

## Context

The Storyblok integration is in place: [+layout.ts](src/routes/+layout.ts) initializes the API and [+page.ts](src/routes/+page.ts) fetches the `home-page` story. The fetched data already flows into [+page.svelte](src/routes/+page.svelte#L6), but it is only being logged — never threaded into the Hero. Meanwhile [Hero.svelte](src/lib/components/Hero.svelte) hardcodes its eyebrow, rotating taglines, copy, and CTA.

This task makes Hero render from CMS data (`StoryblokHomePage`) while keeping the existing visuals untouched. The current hardcoded values stay in place as fallbacks for when `data.story` is null (Storyblok fetch errored or content is missing), so the page never appears broken in dev or during an outage.

## Approach

Pass `data.story?.content` from the page into Hero as a single optional `content: StoryblokHomePage` prop. Hero keeps its current constants as fallbacks, derives displayed values from `content` when present, and contains the two small mappings the CMS shape requires (tagline slug → display text, multilink → href).

## Changes

### 1. [src/lib/components/Hero.svelte](src/lib/components/Hero.svelte)

In the `<script>`:

- Import the types:
  ```ts
  import type { StoryblokHomePage, StoryblokMultilink } from '$lib/types/storyblok';
  ```
- Add a `Props` interface and destructure with `$props()` (mirrors the pattern at [Button.svelte:7-27](src/lib/components/Button.svelte#L7-L27)):
  ```ts
  interface Props {
  	content?: StoryblokHomePage;
  }
  let { content }: Props = $props();
  ```
- Keep the existing `HERO_WORDS` and `SNAKE_ROWS` constants as fallbacks. `HERO_WORDS` becomes the fallback source; the template reads from a derived `words` value instead.
- Add two tiny helpers next to the constants:

  ```ts
  const slugToWord = (slug: string) => slug.replace(/-/g, ' ');

  const multilinkToHref = (link: StoryblokMultilink | undefined): string | undefined => {
  	if (!link) return undefined;
  	return link.cached_url || link.url || undefined;
  };
  ```

  `hero_cta_url` is typed as `Exclude<StoryblokMultilink, { linktype?: 'email' } | { linktype?: 'asset' }>` ([storyblok.d.ts:140](src/lib/types/storyblok.d.ts#L140)), so only `story` and `url` linktypes need to be handled — both expose `cached_url` / `url`.

- Derive the values consumed by the template:
  ```ts
  const eyebrow = $derived(content?.hero_eyebrow ?? "greetings, I'm Branden Builds");
  const words = $derived(
  	content?.hero_taglines?.filter(Boolean).map(slugToWord) ?? [...HERO_WORDS]
  );
  const copy = $derived(
  	content?.hero_copy ??
  		'I turn ambitious ideas into high-performance digital reality. I bridge creative discovery and hardened engineering with intelligent workflows and "nerdy" UX. Precise engineering meets high-fidelity design. Always clean, always sexy.'
  );
  const ctaText = $derived(content?.hero_cta_text ?? 'start a project →');
  const ctaHref = $derived(multilinkToHref(content?.hero_cta_url) ?? '#contact');
  ```
  Note: the `''` value in `hero_taglines`'s union is filtered out so an empty entry in the CMS never renders as a blank word.
- Update the rotating-word effect to read `words.length` and `words[wi]` instead of `HERO_WORDS.length` / `HERO_WORDS[wi]`. Guard against empty arrays (skip the interval if `words.length === 0`, though the fallback ensures it never is).

In the template:

- Eyebrow line ([Hero.svelte:111](src/lib/components/Hero.svelte#L111)) → `{eyebrow}`.
- Rotating word ([Hero.svelte:117](src/lib/components/Hero.svelte#L117)) → `{words[wi]}`.
- Paragraph ([Hero.svelte:133-136](src/lib/components/Hero.svelte#L133-L136)) → `{copy}`.
- CTA ([Hero.svelte:139](src/lib/components/Hero.svelte#L139)) → `<Button href={ctaHref}>{ctaText}</Button>`.

No style or layout changes.

### 2. [src/routes/+page.svelte](src/routes/+page.svelte)

- Pass content into Hero:
  ```svelte
  <Hero content={data.story?.content as StoryblokHomePage | undefined} />
  ```
  The cast is needed because `ISbStoryData.content` is typed as `Record<string, any>`. Import `StoryblokHomePage` from `$lib/types/storyblok`.
- Remove the debug `$effect(() => console.log(data.story))` at [+page.svelte:7](src/routes/+page.svelte#L7).

## Files to modify

- [src/lib/components/Hero.svelte](src/lib/components/Hero.svelte) — accept `content` prop, derive values, keep current values as fallbacks.
- [src/routes/+page.svelte](src/routes/+page.svelte) — pass `data.story?.content` to Hero, drop the debug effect.

## Out of scope

- No changes to [+page.ts](src/routes/+page.ts), [+layout.ts](src/routes/+layout.ts), or [storyblok.d.ts](src/lib/types/storyblok.d.ts).
- No new helper modules — the slug and multilink mappings are tiny and local to Hero, the only consumer.
- No visual or AI-copy changes; behavior with the fallback path must look identical to today.

## Verification

1. `npm run check` — types must pass; confirms the `content` prop and derived values are correctly typed.
2. `npm run dev` and load `/`:
   - With Storyblok reachable and the `home-page` story populated: confirm eyebrow, rotating taglines, copy, and CTA reflect the CMS values. Verify the CTA href resolves correctly (relative path for a story link, full URL for an external link).
   - Simulate a failure (e.g. temporarily break `VITE_STORYBLOK_DELIVERY_API_TOKEN` or the slug in [+page.ts](src/routes/+page.ts)): page still renders the original hardcoded eyebrow/taglines/copy/CTA — no errors in the browser console.
3. Run the Svelte MCP `svelte-autofixer` on the edited `Hero.svelte` until no issues remain (per CLAUDE.md).
4. Visually confirm the rotating word animation still cycles every 2.4s and the snake/sun decorations are unchanged.
