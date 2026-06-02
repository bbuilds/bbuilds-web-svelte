<script lang="ts">
	import type { StoryblokAsset } from '$lib/types/storyblok';
	import LinkIcon from '$lib/components/svgs/icons/LinkIcon.svelte';
	import { storyblokImageUrl, storyblokImageSrcset } from '$lib/utils/storyblokImage';

	interface Props {
		tag: string;
		date: string;
		datetime: string;
		title: string;
		blurb: string;
		href: string;
		index?: number;
		image?: StoryblokAsset;
		eager?: boolean;
	}

	let {
		tag,
		date,
		datetime,
		title,
		blurb,
		href,
		index = 0,
		image,
		eager = false
	}: Props = $props();
</script>

<article
	class="post-card group relative flex flex-col overflow-hidden rounded-2xl border border-paper-line bg-white/40 transition-[transform,box-shadow,border-color] duration-350 hover:-translate-y-1.5 hover:border-ink hover:shadow-[0_1.5rem_3rem_-1.5rem_rgba(0,0,0,0.25)]"
	style:--i={index}
>
	<header class="flex flex-col">
		<div class="relative aspect-video overflow-hidden bg-ink">
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
					fetchpriority={eager ? 'high' : undefined}
					class="h-full w-full object-cover"
				/>
				<div
					class="pointer-events-none absolute inset-0 bg-black opacity-30 transition-opacity duration-300 group-hover:opacity-100"
				></div>
				<div
					class="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100"
				>
					<LinkIcon class="h-10 w-10 text-white" />
				</div>
			{/if}
		</div>
		<h3 class="px-5 pt-5 text-xl leading-tight font-semibold tracking-[-0.015em] text-ink">
			<a
				{href}
				class="text-inherit no-underline before:absolute before:inset-0 before:content-['']"
			>
				{title}
			</a>
		</h3>
	</header>

	<p class="mt-2.5 mb-0 flex-1 px-5 font-mono text-xs leading-[1.65] text-body">{blurb}</p>

	<footer class="mt-2.5 flex items-center gap-2 px-5 pb-6 font-mono text-[0.6875rem] text-muted">
		{#if tag}
			<span
				class="rounded-full bg-yellow/10 px-2 py-0.5 font-semibold tracking-[0.04em] text-yellow uppercase"
				>{tag}</span
			>
		{/if}
		{#if date}
			<time {datetime} class="tracking-[0.04em]">{date}</time>
		{/if}
	</footer>
</article>

<style>
	@keyframes postIn {
		from {
			opacity: 0;
			transform: translateY(1rem);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}

	.post-card {
		opacity: 0;
		animation: postIn 0.6s cubic-bezier(0.2, 0.7, 0.2, 1) both;
		animation-delay: calc(var(--i, 0) * 80ms);
	}

	@media (prefers-reduced-motion: reduce) {
		.post-card {
			animation: none;
			opacity: 1;
		}
	}
</style>
