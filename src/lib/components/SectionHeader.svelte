<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import ScribbleUnderline from '$lib/components/ScribbleUnderline.svelte';
	import type { TitleSegment } from '$lib/utils/format';
	import type { ResolvedLink } from '$lib/utils/links';

	interface Props {
		eyebrow?: string;
		eyebrowPrefix?: boolean;
		titleSegments?: TitleSegment[];
		copy?: string;
		copyMaxWidth?: string;
		copyClass?: string;
		align?: 'start' | 'center';
		scribbleVariant?: 'thin' | 'thick';
		cta?: { label?: string };
		ctaLink?: ResolvedLink;
	}

	let {
		eyebrow,
		eyebrowPrefix = true,
		titleSegments = [],
		copy,
		copyMaxWidth = 'max-w-140',
		copyClass = 'text-[0.8125rem] text-charcoal',
		align = 'start',
		scribbleVariant = 'thin',
		cta,
		ctaLink
	}: Props = $props();

	const isCenter = $derived(align === 'center');
</script>

{#if eyebrow}
	<div
		class="font-mono text-sm tracking-wider text-muted uppercase before:mr-2 before:text-yellow before:content-['●']"
	>
		{eyebrowPrefix ? `// ${eyebrow}` : eyebrow}
	</div>
{/if}

{#if titleSegments.length}
	<h2 class={isCenter ? 'mx-auto mt-4 max-w-250' : 'mt-2'}>
		{#each titleSegments as seg, i (i)}
			{#if seg.underline}
				<span class="scribble">{seg.text}<ScribbleUnderline variant={scribbleVariant} /></span>
			{:else if seg.hand}
				<span class="font-hand font-bold text-charcoal">{seg.text}</span>
			{:else}
				{seg.text}
			{/if}
		{/each}
	</h2>
{/if}

{#if copy}
	<p
		class="{isCenter
			? 'mx-auto mt-6'
			: 'mt-3.5'} {copyMaxWidth} font-mono leading-[1.7] {copyClass}"
	>
		{copy}
	</p>
{/if}

{#if cta && ctaLink}
	<div class="mt-9 {isCenter ? 'flex flex-wrap justify-center gap-3.5' : ''}">
		<Button href={ctaLink.href} target={ctaLink.target} rel={ctaLink.rel}>{cta.label ?? ''}</Button>
	</div>
{/if}
