<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$lib/components/Button.svelte';
	import Particles from '$lib/components/Particles.svelte';
	import { leafParticleOptions } from '$lib/particles/leafOptions';
	import { resolveMultilink } from '$lib/utils/links';
	import type { StoryblokHomePage } from '$lib/types/storyblok';
	import { SITE_NAME } from '$lib/config/site';
	import { prefersReducedMotion } from '$lib/utils/motion';
	import Eyebrow from '$lib/components/Eyebrow.svelte';

	interface Props {
		content?: StoryblokHomePage;
	}
	let { content }: Props = $props();

	const HERO_WORDS = [
		'hardened systems',
		'immersive experiences',
		'captivating stories',
		'sexy interfaces',
		'intelligent workflows'
	] as const;

	const slugToWord = (slug: string) => slug.replace(/-/g, ' ');

	const eyebrow = $derived(content?.hero_eyebrow ?? `greetings, I'm ${SITE_NAME}`);
	const words = $derived(
		content?.hero_taglines?.filter(Boolean).map(slugToWord) ?? [...HERO_WORDS]
	);
	const copy = $derived(
		content?.hero_copy ??
			'I turn ambitious ideas into high-performance digital reality. I bridge creative discovery and hardened engineering with intelligent workflows and "nerdy" UX. Precise engineering meets high-fidelity design. Always clean, always sexy.'
	);
	const ctaText = $derived(content?.hero_cta_text ?? 'start a project');
	const cta = $derived(resolveMultilink(content?.hero_cta_url));

	let wi = $state(0);
	let showLeaves = $state(false);

	onMount(() => {
		if (prefersReducedMotion()) {
			return;
		}

		showLeaves = true;

		if (words.length === 0) {
			return;
		}

		const wordIntervalId = setInterval(() => {
			wi = (wi + 1) % words.length;
		}, 2400);

		return () => {
			clearInterval(wordIntervalId);
		};
	});
</script>

<section class="paper-bg relative overflow-hidden pt-16 pb-20">
	<!-- Falling leaves layer -->
	{#if showLeaves}
		<div class="hero-leaves-layer" aria-hidden="true">
			<Particles options={leafParticleOptions} />
		</div>
	{/if}

	<!-- Sun sticker -->
	<div class="pointer-events-none absolute top-15 right-[8%] opacity-25 md:opacity-100">
		<div class="sticker" aria-hidden="true"></div>
	</div>

	<div class="relative z-2 container">
		<Eyebrow text={eyebrow} class="mb-4 flex items-center text-sm tracking-[0.06em] md:text-base" />
		<h1>
			I enjoy building <span
				class="hidden font-hand text-8xl font-medium text-charcoal md:inline-block md:translate-y-4"
				aria-hidden="true">↳</span
			><br />
			<span class="scribble whitespace-nowrap">
				{#key wi}
					<em class="rot inline-block text-ink not-italic">{words[wi]}</em>
				{/key}
				<svg viewBox="0 0 400 22" preserveAspectRatio="none" aria-hidden="true">
					<path
						d="M2 14 C 80 4, 160 20, 240 10 S 360 16, 398 8"
						stroke="var(--pale-fire)"
						stroke-width="10"
						fill="none"
						stroke-linecap="round"
						opacity="0.85"
					/>
				</svg>
			</span>
		</h1>

		<p class="mt-9 max-w-140 font-mono text-[0.875rem] leading-[1.7] text-body">
			{copy}
		</p>

		<div class="mt-8 flex flex-wrap gap-3.5">
			<Button href={cta?.href ?? '#contact'} target={cta?.target} rel={cta?.rel}>{ctaText}</Button>
		</div>
	</div>
</section>

<style>
	@media (max-width: 639px) {
		h1 {
			font-size: 1.875rem;
		}
	}

	.rot {
		animation: wordFade 0.6s ease both;
	}

	@property --sun-x {
		syntax: '<percentage>';
		inherits: false;
		initial-value: 35%;
	}

	@property --sun-y {
		syntax: '<percentage>';
		inherits: false;
		initial-value: 35%;
	}

	.sticker {
		width: 5.5rem;
		height: 5.5rem;
		border-radius: 50%;
		background: radial-gradient(
			circle at var(--sun-x) var(--sun-y),
			#fff3bb 0%,
			var(--pale-fire) 70%
		);
		box-shadow:
			0 0.75rem 2.5rem -0.625rem rgba(0, 0, 0, 0.25),
			inset 0 0 0 0.125rem var(--ink);
		animation:
			gradientDrift 10s ease-in-out infinite,
			glowPulse 4s ease-in-out infinite;
	}

	@media (min-width: 48rem) {
		.sticker {
			width: 6.5rem;
			height: 6.5rem;
		}
	}

	@keyframes gradientDrift {
		0%,
		100% {
			--sun-x: 35%;
			--sun-y: 35%;
		}
		33% {
			--sun-x: 62%;
			--sun-y: 42%;
		}
		66% {
			--sun-x: 42%;
			--sun-y: 65%;
		}
	}

	@keyframes glowPulse {
		0%,
		100% {
			box-shadow:
				0 0.75rem 2.5rem -0.625rem rgba(0, 0, 0, 0.25),
				inset 0 0 0 0.125rem var(--ink);
		}
		50% {
			box-shadow:
				0 0.75rem 3.5rem -0.25rem rgba(0, 0, 0, 0.18),
				0 0 2rem 0.375rem var(--pale-fire-45),
				inset 0 0 0 0.125rem var(--ink);
		}
	}

	@keyframes wordFade {
		0% {
			opacity: 0;
			transform: translateY(0.875rem) rotate(-2deg);
		}
		60% {
			opacity: 1;
			transform: translateY(0) rotate(0);
		}
	}

	.hero-leaves-layer {
		position: absolute;
		inset: 0;
		pointer-events: none;
		overflow: hidden;
		opacity: 0.55;
		z-index: 0;
	}

	@media (prefers-reduced-motion: reduce) {
		.rot {
			animation: none;
		}
		.sticker {
			animation: none;
		}
	}
</style>
