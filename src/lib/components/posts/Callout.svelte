<script lang="ts">
	import type { RichTextDoc } from '$lib/types/post';
	import type { StoryblokCalloutBlock } from '$lib/types/storyblok';
	import RichTextRenderer from './RichTextRenderer.svelte';

	type Props = Pick<StoryblokCalloutBlock, 'callout_type' | 'content'>;

	let { callout_type, content }: Props = $props();

	// `content` is Storyblok's loose generated richtext type; the renderer pipeline uses
	// the richer hand-authored RichTextDoc (same bridge as [slug]/+page.svelte).
	const doc = $derived(content as RichTextDoc | undefined);

	const variant = $derived(
		callout_type === 'warning' || callout_type === 'success' ? callout_type : 'info'
	);

	const LABELS = {
		info: 'Note',
		warning: 'Heads up',
		success: 'Pro tip'
	} as const;

	const PALETTE = {
		info: { accent: 'oklch(0.55 0.08 233)', label: 'oklch(0.38 0.1 233)' },
		warning: { accent: 'oklch(0.58 0.1 79)', label: 'oklch(0.4 0.12 79)' },
		success: { accent: 'oklch(0.55 0.09 150)', label: 'oklch(0.38 0.11 150)' }
	} as const;

	const palette = $derived(PALETTE[variant]);
</script>

<div
	class="callout my-8 grid grid-cols-[auto_1fr] items-start gap-x-3 px-4.25 py-4 md:gap-x-3.75 md:px-5.5 md:py-4.5 md:pl-4.5"
	style:--c-accent={palette.accent}
	style:--c-label={palette.label}
	role="note"
	aria-label={LABELS[variant]}
>
	<span
		class="mt-px inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-(--c-accent) text-paper md:h-7 md:w-7"
		aria-hidden="true"
	>
		{#if variant === 'info'}
			<svg
				class="h-3.75 w-3.75 md:h-4.25 md:w-4.25"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<circle cx="12" cy="12" r="9" />
				<path d="M12 11v5" />
				<path d="M12 7.5h.01" />
			</svg>
		{:else if variant === 'warning'}
			<svg
				class="h-3.75 w-3.75 md:h-4.25 md:w-4.25"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<path d="M10.3 3.8 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z" />
				<path d="M12 9v4" />
				<path d="M12 17h.01" />
			</svg>
		{:else}
			<svg
				class="h-3.75 w-3.75 md:h-4.25 md:w-4.25"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.4"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<circle cx="12" cy="12" r="9" />
				<path d="m8.3 12.4 2.5 2.6 4.9-5.4" />
			</svg>
		{/if}
	</span>
	<div class="min-w-0">
		<div
			class="mt-1.25 mb-2 font-mono text-[0.6875rem] leading-none font-semibold tracking-[0.09em] text-(--c-label) uppercase"
		>
			{LABELS[variant]}
		</div>
		<div class="callout-body leading-[1.68] text-body">
			<RichTextRenderer {doc} />
		</div>
	</div>
</div>

<style>
	.callout {
		background: color-mix(in oklch, var(--c-accent) 7%, var(--paper));
		border: 0.0625rem solid color-mix(in oklch, var(--c-accent) 30%, var(--paper-line));
		border-left: 0.1875rem solid var(--c-accent);
	}

	.callout-body :global(p) {
		margin: 0 0 0.625rem;
	}

	.callout-body :global(p:last-child) {
		margin-bottom: 0;
	}

	.callout-body :global(strong) {
		color: var(--ink);
		font-weight: 700;
	}

	.callout-body :global(em) {
		font-style: italic;
	}

	.callout-body :global(a) {
		color: var(--c-label);
		font-weight: 600;
		text-decoration: underline;
		text-decoration-color: color-mix(in oklch, var(--c-label) 45%, transparent);
		text-decoration-thickness: 0.125rem;
		text-underline-offset: 0.2em;
		transition: text-decoration-color 0.2s;
	}

	.callout-body :global(a:hover) {
		text-decoration-color: var(--c-label);
	}

	.callout-body :global(code) {
		font-family: var(--mono);
		font-size: 0.875em;
		background: color-mix(in oklch, var(--c-accent) 10%, var(--paper-2));
		padding: 0.125em 0.375em;
		border-radius: 0.25rem;
		color: var(--ink-soft);
	}
</style>
