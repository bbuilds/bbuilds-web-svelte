<script lang="ts">
	import SectionHeader from '$lib/components/SectionHeader.svelte';
	import Sprout from '$lib/components/svgs/illustrations/Sprout.svelte';
	import { parseTitleSegments } from '$lib/utils/format';
	import { resolveMultilink } from '$lib/utils/links';
	import type { StoryblokGlobals } from '$lib/types/storyblok';

	interface Props {
		content?: StoryblokGlobals;
	}
	let { content }: Props = $props();

	const titleSegments = $derived(parseTitleSegments(content?.contact_title));
	const cta = $derived(content?.contact_cta?.[0]);
	const ctaLink = $derived(resolveMultilink(cta?.link));

	const PLANTS = [
		{ side: 'left', offset: '6%', mobile: true },
		{ side: 'left', offset: '20%', mobile: false },
		{ side: 'right', offset: '6%', mobile: true },
		{ side: 'right', offset: '20%', mobile: false }
	] as const;
</script>

{#if content}
	<section id="contact" class="paper-bg relative overflow-hidden pt-22 pb-20 text-center">
		{#each PLANTS as p, i (i)}
			<div
				aria-hidden="true"
				class="plant plant-{i} pointer-events-none absolute {p.mobile
					? 'opacity-25 md:opacity-70'
					: 'hidden md:block md:opacity-70'}"
				style="bottom: -1.25rem; {p.side}: {p.offset}; transform-origin: bottom center;"
			>
				<div class="plant-sway plant-sway-{i}" style="transform-origin: bottom center;">
					<Sprout class="w-27.5" />
				</div>
			</div>
		{/each}

		<div class="container">
			<SectionHeader
				eyebrow={content.contact_eyebrow}
				eyebrowPrefix={false}
				{titleSegments}
				copy={content.contact_copy}
				copyMaxWidth="max-w-155"
				copyClass="text-sm text-body"
				align="center"
				{cta}
				{ctaLink}
				scribbleVariant="thick"
			/>
		</div>
	</section>
{/if}

<style>
	.plant-0 {
		animation: growIn 1.4s cubic-bezier(0.2, 0.7, 0.2, 1) both;
	}
	.plant-1 {
		animation: growIn 1.5s 0.1s cubic-bezier(0.2, 0.7, 0.2, 1) both;
	}
	.plant-2 {
		animation: growIn 1.6s 0.18s cubic-bezier(0.2, 0.7, 0.2, 1) both;
	}
	.plant-3 {
		animation: growIn 1.7s 0.26s cubic-bezier(0.2, 0.7, 0.2, 1) both;
	}

	.plant-sway-0 {
		animation:
			sway 9s ease-in-out infinite,
			fadeIn 1.4s cubic-bezier(0.2, 0.7, 0.2, 1) both;
	}
	.plant-sway-1 {
		animation:
			sway 7s ease-in-out -1s infinite reverse,
			fadeIn 1.5s 0.1s cubic-bezier(0.2, 0.7, 0.2, 1) both;
	}
	.plant-sway-2 {
		animation:
			sway 8.5s ease-in-out -3s infinite reverse,
			fadeIn 1.6s 0.18s cubic-bezier(0.2, 0.7, 0.2, 1) both;
	}
	.plant-sway-3 {
		animation:
			sway 6.5s ease-in-out -0.5s infinite,
			fadeIn 1.7s 0.26s cubic-bezier(0.2, 0.7, 0.2, 1) both;
	}

	@keyframes growIn {
		from {
			transform: translateY(40%) scaleY(0.4);
		}
		to {
			transform: translateY(0) scaleY(1);
		}
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes sway {
		0%,
		100% {
			transform: rotate(-1.5deg);
		}
		50% {
			transform: rotate(1.5deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.plant-0,
		.plant-1,
		.plant-2,
		.plant-3,
		.plant-sway-0,
		.plant-sway-1,
		.plant-sway-2,
		.plant-sway-3 {
			animation: none;
		}
	}
</style>
