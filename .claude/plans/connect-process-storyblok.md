# Plan: Connect Process.svelte to Storyblok

## Context

`Process.svelte` currently renders hardcoded content (eyebrow, description, and the 4 phase cards). The Storyblok CMS already has matching fields on `StoryblokHomePage` — `process_eyebrow`, `process_copy`, and `process_cards[]` — and the types are already generated. This plan wires those CMS fields into the component with fallbacks to the existing static data.

No new API calls are needed: `+page.ts` already fetches the home-page story, which includes all process fields.

---

## Files to change

### 1. `src/lib/components/Process.svelte`

**Add** a typed `content` prop following the same pattern as `Hero.svelte` and `Services.svelte`:

```ts
import type { StoryblokHomePage } from '$lib/types/storyblok';

interface Props {
	content?: StoryblokHomePage;
}
let { content }: Props = $props();
```

**Derive CMS-driven values with fallbacks:**

```ts
const eyebrow = $derived(content?.process_eyebrow ?? '// 03.process');

const sectionCopy = $derived(
	content?.process_copy ??
		'Every engagement runs the same loop. Tight, transparent, and biased toward shipping — then we do it again.'
);

const phases = $derived.by(() => {
	const cards = content?.process_cards ?? [];
	if (cards.length === 0) return PROCESS;
	return cards.map((c, i) => ({
		n: String(i + 1).padStart(2, '0'),
		title: c.title ?? '',
		copy: c.copy ?? ''
	}));
});
```

**Update the template** to use the derived values:

- Replace hardcoded eyebrow string with `{eyebrow}`
- Replace hardcoded description `<p>` text with `{sectionCopy}`
- Replace `PROCESS` reference in `{#each}` with `phases`
- Keep `PROCESS.length` in the git-tree SVG `{#each [125, 375, 625, 875]}` — this is purely visual and should stay tied to the 4-node layout; no change needed there

### 2. `src/routes/+page.svelte`

Change:

```svelte
<Process />
```

to:

```svelte
<Process {content} />
```

---

## Key decisions

- **Step number `n`** is derived from the index (padded, e.g. `'01'`) since `StoryblokProcessCards` has no `n` field in Storyblok.
- **Fallback behavior**: if `process_cards` is empty or `content` is undefined, the existing `PROCESS` constant renders as-is — no visual regression when CMS is unpublished.
- **Git-tree SVG**: hardcoded to 4 nodes — it's decorative and the CMS data is expected to always be 4 cards. No change needed.
- **No `process_title`** field exists in CMS; the `<h2>` "The runtime loop." stays hardcoded.

---

## Verification

1. Run `npm run dev`, open the home page, confirm the Process section renders with CMS content (eyebrow, copy, card titles/descriptions from Storyblok).
2. With CMS content present, toggle a card title in Storyblok preview — verify it updates.
3. With `content` undefined (e.g. by removing the prop temporarily), verify the static fallback renders correctly.
4. Run `npm run check` — no TypeScript errors.
