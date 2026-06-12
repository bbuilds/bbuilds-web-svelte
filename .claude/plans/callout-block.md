# Callout Block — Implementation Plan

## Context

A `Callout Block` is a Storyblok component editors drop inside blog post rich text. It renders a visually prominent aside with a colored left border, a variant-specific icon badge, a label ("Note", "Heads up", "Pro tip"), and a rich-text body. Three variants: `info` (blue), `warning` (amber), `success` (green); empty or unset `callout_type` falls back to `info`.

The type is already generated in `src/lib/types/storyblok.d.ts` as `StoryblokCalloutBlock` with `callout_type?: '' | 'info' | 'warning' | 'success'` and `content?: StoryblokRichtext`.

## Approach

- **Richtext blok shape**: lives at `src/lib/components/posts/Callout.svelte`, receives blok fields as `$props()`, delegates rich-text body back to `<RichTextRenderer doc={content} />`.
- **Three non-token accent colors**: the design uses `oklch(…)` per variant — no project token exists for any of them. They become a component-local `--c-accent` custom property set per variant selector in the scoped `<style>`. Flagged here so the user can promote to tokens later.
- **Default fallback**: `--c-accent` defaults to `var(--yellow)` (the existing token) when no variant class is present.
- **Three variant SVG icons** (info circle, warning triangle, success checkmark) are inlined in the component — no match exists in `src/lib/components/svgs/icons/`. All three carry `aria-hidden="true"` because the label text already conveys the variant's meaning.
- **No `design.css` changes** — all new styles live in the component's scoped `<style>` block.

## Source references

- Design CSS (callout rules): [blog-post.html:176-217](../../llm_docs/brandenbuilds-claude-design/project/blog-post.html#L176-L217)
- React component + variant config: [blog-post.html:528-568](../../llm_docs/brandenbuilds-claude-design/project/blog-post.html#L528-L568)

## Files to modify / create

- **new**: [src/lib/components/posts/Callout.svelte](../../src/lib/components/posts/Callout.svelte)
- **new**: [src/lib/components/posts/Callout.svelte.spec.ts](../../src/lib/components/posts/Callout.svelte.spec.ts)
- **edit**: [src/lib/components/posts/RichTextRenderer.svelte](../../src/lib/components/posts/RichTextRenderer.svelte) — add `blok` node branch dispatching to `Callout` when `component === 'Callout Block'`

## Content (decided)

Variant → label mapping (hard-coded in component):

| `callout_type` | Label      | Icon                      |
| -------------- | ---------- | ------------------------- |
| `info` or `''` | "Note"     | Info circle (ⓘ SVG)       |
| `warning`      | "Heads up" | Triangle with exclamation |
| `success`      | "Pro tip"  | Circle with checkmark     |

Rich-text body is dynamic from Storyblok, rendered via `RichTextRenderer`.

## Token / spacing mapping

### Colors

- Variant accents — no tokens; component-local `--c-accent`:
  - `info`: `oklch(0.55 0.08 233)` (blue)
  - `warning`: `oklch(0.58 0.10 79)` (amber)
  - `success`: `oklch(0.55 0.09 150)` (green)
  - base/default: `var(--yellow)` ✓ (token alias)
- Background: `color-mix(in oklch, var(--c-accent) 7%, var(--paper))` — local
- Left border: `0.1875rem solid var(--c-accent)` — local (3px → rem)
- Other borders: `0.0625rem solid color-mix(in oklch, var(--c-accent) 30%, var(--paper-line))` — local (1px → rem)
- Icon badge bg: `var(--c-accent)`; icon glyph color: `var(--paper)` ✓
- Label color: `var(--c-accent)`; body text: `var(--body)` ✓
- Body links: color `var(--c-accent)`; code bg: `color-mix(in oklch, var(--c-accent) 10%, var(--paper-2))`

### Spacing (all px → rem)

- Container: `margin: 2rem 0`, `padding: 1.125rem 1.375rem 1.125rem 1.125rem`
- Grid gap: `0 0.9375rem`; border-radius: `0 0.625rem 0.625rem 0`
- Icon badge: `1.75rem × 1.75rem`, `border-radius: 0.5rem`, `margin-top: 0.0625rem`
- Icon SVG: `1.0625rem × 1.0625rem`
- Label: `font-size: 0.6875rem`, `margin: 0.3125rem 0 0.5rem`
- Body `<p>`: `font-size: 1rem`, `margin-bottom: 0.625rem`; last child `margin-bottom: 0`
- Body `<code>`: `font-size: 0.875em`, `padding: 0.125em 0.375em`, `border-radius: 0.25rem`
- Body links: `text-decoration-thickness: 0.125rem`, `text-underline-offset: 0.2em`
- Mobile (≤47.9375rem): `padding: 1rem 1.0625rem`, `gap: 0 0.75rem`, icon `1.5rem × 1.5rem`, icon SVG `0.9375rem`

## Component structure

```svelte
<script lang="ts">
	import type { StoryblokCalloutBlock } from '$lib/types/storyblok';
	import type { StoryblokRichtext } from '$lib/types/storyblok';
	import RichTextRenderer from './RichTextRenderer.svelte';

	const VARIANTS = {
		info: { label: 'Note' },
		warning: { label: 'Heads up' },
		success: { label: 'Pro tip' }
	} as const;

	let { callout_type = 'info', content }: StoryblokCalloutBlock = $props();
	const variant = $derived(
		callout_type && (callout_type as string) in VARIANTS
			? (callout_type as keyof typeof VARIANTS)
			: 'info'
	);
</script>

<div class="callout callout-{variant}" role="note">
	<span class="callout-icon" aria-hidden="true">
		<!-- SVG per variant, aria-hidden on each svg -->
	</span>
	<div class="callout-main">
		<div class="callout-label">{VARIANTS[variant].label}</div>
		<div class="callout-body">
			<RichTextRenderer doc={content} />
		</div>
	</div>
</div>

<style>
	.callout {
		--c-accent: var(--yellow); /* grid layout, border, bg */
	}
	.callout-info {
		--c-accent: oklch(0.55 0.08 233);
	}
	.callout-warning {
		--c-accent: oklch(0.58 0.1 79);
	}
	.callout-success {
		--c-accent: oklch(0.55 0.09 150);
	}
	/* icon, label, body, link, code, mobile breakpoint */
</style>
```

`role="note"` provides semantic context. The label is real text (not color-only). Icon SVGs are `aria-hidden="true"` on the `<svg>` elements.

## Reused utilities (not re-implemented)

- [`RichTextRenderer.svelte`](../../src/lib/components/posts/RichTextRenderer.svelte) — renders the rich-text `content` body
- `--paper`, `--body`, `--yellow`, `--paper-2`, `--paper-line` CSS tokens from [`design.css`](../../src/lib/styles/design.css)

## Tests

The spec (`Callout.svelte.spec.ts`) will assert:

1. **info (default)**: `role="note"` present; label text "Note" renders
2. **warning**: `role="note"` present; label text "Heads up" renders
3. **success**: `role="note"` present; label text "Pro tip" renders
4. **empty callout_type**: falls back gracefully — "Note" label renders

Body content rendering is covered by the existing `RichTextRenderer` spec; we don't duplicate it here.

## What's NOT in scope

- No data fetching or SvelteKit load logic
- No Storyblok schema changes (type already generated)
- No new tokens added to `design.css`
- No changes to the blog post route or load function
- No entrance animation — the design callout is a static block

## Verification

```bash
npm run check
npm run lint
npm run test:unit -- --run src/lib/components/posts/Callout.svelte.spec.ts
```

Manual checks after integration:

- Each variant renders with correct accent color and label
- No `px` in any new styles (borders, spacing, font sizes)
- Icon SVGs are `aria-hidden="true"` (confirm in devtools)
- Body `RichTextRenderer` output is styled correctly within the callout body
- Mobile layout applies (padding/gap shrink at ≤47.9375rem)
