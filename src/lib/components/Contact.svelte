<script lang="ts">
	import Button from '$lib/components/Button.svelte';
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

{#snippet sprout()}
	<svg viewBox="0 0 100 160" style="width:6.875rem" aria-hidden="true">
		<path
			d="M50 155 C 50 130, 52 100, 50 70 C 49 50, 50 30, 50 12"
			stroke="#1a1a1a"
			stroke-width="1.8"
			fill="none"
			stroke-linecap="round"
		/>
		<path
			d="M50 95 C 32 92, 18 76, 16 50 C 32 56, 46 74, 50 95 Z"
			fill="#7ba87b"
			stroke="#1a1a1a"
			stroke-width="1.3"
			stroke-linejoin="round"
		/>
		<path
			d="M50 95 C 38 88, 28 74, 22 60"
			stroke="#1a1a1a"
			stroke-width="0.6"
			fill="none"
			opacity="0.5"
		/>
		<path
			d="M50 65 C 68 62, 82 46, 84 20 C 68 26, 54 44, 50 65 Z"
			fill="#7ba87b"
			stroke="#1a1a1a"
			stroke-width="1.3"
			stroke-linejoin="round"
		/>
		<path
			d="M50 65 C 62 58, 72 44, 78 30"
			stroke="#1a1a1a"
			stroke-width="0.6"
			fill="none"
			opacity="0.5"
		/>
		<path
			d="M50 40 C 42 30, 42 18, 50 8 C 58 18, 58 30, 50 40 Z"
			fill="#7ba87b"
			stroke="#1a1a1a"
			stroke-width="1.3"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}

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
					{@render sprout()}
				</div>
			</div>
		{/each}

		<div class="container">
			<div
				class="font-mono text-sm tracking-wider text-muted uppercase before:mr-2 before:text-yellow before:content-['●']"
			>
				{content.contact_eyebrow}
			</div>

			<h2 class="mx-auto mt-4 max-w-250">
				{#each titleSegments as seg, i (i)}
					{#if seg.underline}
						<span class="scribble"
							>{seg.text}<svg viewBox="0 0 200 22" preserveAspectRatio="none" aria-hidden="true">
								<path
									d="M2 14 C 40 4, 80 20, 120 10 S 180 16, 198 8"
									stroke="var(--yellow)"
									stroke-width="8"
									fill="none"
									stroke-linecap="round"
								/>
							</svg></span
						>
					{:else if seg.hand}
						<span class="font-hand font-bold text-charcoal">{seg.text}</span>
					{:else}
						{seg.text}
					{/if}
				{/each}
			</h2>

			{#if content.contact_copy}
				<p class="mx-auto mt-6 max-w-155 font-mono text-sm leading-[1.7] text-body">
					{content.contact_copy}
				</p>
			{/if}

			{#if cta && ctaLink}
				<div class="mt-9 flex flex-wrap justify-center gap-3.5">
					<Button href={ctaLink.href}>{cta.label}</Button>
				</div>
			{/if}
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
