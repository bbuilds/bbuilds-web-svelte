<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$lib/components/Button.svelte';
	import { resolveMultilink } from '$lib/utils/links';
	import type { StoryblokHomePage } from '$lib/types/storyblok';

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

	const eyebrow = $derived(content?.hero_eyebrow ?? "greetings, I'm Branden Builds");
	const words = $derived(
		content?.hero_taglines?.filter(Boolean).map(slugToWord) ?? [...HERO_WORDS]
	);
	const copy = $derived(
		content?.hero_copy ??
			'I turn ambitious ideas into high-performance digital reality. I bridge creative discovery and hardened engineering with intelligent workflows and "nerdy" UX. Precise engineering meets high-fidelity design. Always clean, always sexy.'
	);
	const ctaText = $derived(content?.hero_cta_text ?? 'start a project →');
	const cta = $derived(resolveMultilink(content?.hero_cta_url));

	const SNAKE_ROWS = [
		[
			{ x: 60, h: 180, tilt: -8 },
			{ x: 80, h: 210, tilt: 0 },
			{ x: 100, h: 175, tilt: 8 },
			{ x: 72, h: 150, tilt: -16 },
			{ x: 92, h: 155, tilt: 14 }
		],
		[
			{ x: 62, h: 178, tilt: -8 },
			{ x: 80, h: 207, tilt: 2 },
			{ x: 98, h: 172, tilt: 10 },
			{ x: 70, h: 148, tilt: -16 },
			{ x: 90, h: 158, tilt: 14 }
		],
		[
			{ x: 60, h: 168, tilt: -8 },
			{ x: 82, h: 202, tilt: 4 },
			{ x: 100, h: 174, tilt: 10 },
			{ x: 72, h: 153, tilt: -14 },
			{ x: 88, h: 163, tilt: 14 }
		],
		[
			{ x: 62, h: 176, tilt: -8 },
			{ x: 80, h: 212, tilt: 2 },
			{ x: 100, h: 166, tilt: 12 },
			{ x: 70, h: 150, tilt: -16 },
			{ x: 90, h: 160, tilt: 10 }
		]
	] as const;

	let wi = $state(0);

	onMount(() => {
		if (words.length === 0) return;
		const id = setInterval(() => {
			wi = (wi + 1) % words.length;
		}, 2400);
		return () => clearInterval(id);
	});
</script>

<section class="paper-bg relative overflow-hidden pt-16 pb-30">
	<!-- Snake — right (always visible) -->
	<div
		class="plant-snake plant-snake-0 pointer-events-none absolute opacity-25 md:opacity-100"
		style="right: -1.875rem; bottom: -1.25rem; transform-origin: bottom right;"
	>
		<div class="plant-sway plant-sway-0" style="transform-origin: bottom right;">
			<svg viewBox="0 0 160 220" style="width:11.25rem" aria-hidden="true">
				{#each SNAKE_ROWS[0] as b, i (i)}
					<g transform="translate({b.x} {220 - b.h}) rotate({b.tilt} 0 {b.h})">
						<path
							d="M0 0 C -12 {b.h * 0.4}, -12 {b.h * 0.7}, 0 {b.h} C 12 {b.h * 0.7}, 12 {b.h *
								0.4}, 0 0 Z"
							fill="#557a55"
							stroke="#1a1a1a"
							stroke-width="1.4"
						/>
					</g>
				{/each}
				<path d="M40 218 L120 218" stroke="#1a1a1a" stroke-width="2" />
			</svg>
		</div>
	</div>

	<!-- Sun sticker -->
	<div
		class="pointer-events-none absolute opacity-25 md:opacity-100"
		style="right: 8%; top: 3.75rem;"
	>
		<div class="sticker" aria-hidden="true"></div>
	</div>

	<!-- Repeating snake plants (tablet/desktop only) -->
	{#each [{ right: '37%', row: 1 }, { right: '27%', row: 2 }, { right: '17%', row: 3 }, { right: '7%', row: 0 }] as p, i (i)}
		<div
			class="plant-snake plant-snake-{i + 1} pointer-events-none absolute hidden md:block"
			style="right: {p.right}; bottom: -1.25rem; transform-origin: bottom right;"
		>
			<div class="plant-sway plant-sway-{i + 1}" style="transform-origin: bottom right;">
				<svg viewBox="0 0 160 220" style="width:11.25rem" aria-hidden="true">
					{#each SNAKE_ROWS[p.row] as b, j (j)}
						<g transform="translate({b.x} {220 - b.h}) rotate({b.tilt} 0 {b.h})">
							<path
								d="M0 0 C -12 {b.h * 0.4}, -12 {b.h * 0.7}, 0 {b.h} C 12 {b.h * 0.7}, 12 {b.h *
									0.4}, 0 0 Z"
								fill="#557a55"
								stroke="#1a1a1a"
								stroke-width="1.4"
							/>
						</g>
					{/each}
					<path d="M40 218 L120 218" stroke="#1a1a1a" stroke-width="2" />
				</svg>
			</div>
		</div>
	{/each}

	<div class="container">
		<div
			class="mb-4.5 font-mono text-sm tracking-[0.06em] text-muted uppercase before:mr-2 before:text-yellow before:content-['●'] md:text-base"
		>
			{eyebrow}
		</div>
		<h1>
			I enjoy building <span class="font-hand font-medium text-charcoal">↳</span><br />
			<span class="scribble whitespace-nowrap">
				{#key wi}
					<em class="rot inline-block text-ink not-italic">{words[wi]}</em>
				{/key}
				<svg viewBox="0 0 400 22" preserveAspectRatio="none" aria-hidden="true">
					<path
						d="M2 14 C 80 4, 160 20, 240 10 S 360 16, 398 8"
						stroke="#ffcd67"
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
		width: 9.25rem;
		height: 9.25rem;
		border-radius: 50%;
		background: radial-gradient(circle at var(--sun-x) var(--sun-y), #fff3bb 0%, #ffcd67 70%);
		box-shadow:
			0 0.75rem 2.5rem -0.625rem rgba(0, 0, 0, 0.25),
			inset 0 0 0 0.125rem var(--ink);
		animation:
			gradientDrift 10s ease-in-out infinite,
			glowPulse 4s ease-in-out infinite;
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
				0 0 2rem 0.375rem rgba(255, 205, 103, 0.45),
				inset 0 0 0 0.125rem var(--ink);
		}
	}

	.plant-snake-0 {
		animation: growIn 1.4s cubic-bezier(0.2, 0.7, 0.2, 1) both;
	}
	.plant-snake-1 {
		animation: growIn 1.5s 0.1s cubic-bezier(0.2, 0.7, 0.2, 1) both;
	}
	.plant-snake-2 {
		animation: growIn 1.6s 0.18s cubic-bezier(0.2, 0.7, 0.2, 1) both;
	}
	.plant-snake-3 {
		animation: growIn 1.7s 0.26s cubic-bezier(0.2, 0.7, 0.2, 1) both;
	}
	.plant-snake-4 {
		animation: growIn 1.8s 0.34s cubic-bezier(0.2, 0.7, 0.2, 1) both;
	}

	.plant-sway-0 {
		animation:
			sway 9s ease-in-out infinite reverse,
			fadeIn 1.4s cubic-bezier(0.2, 0.7, 0.2, 1) both;
	}
	.plant-sway-1 {
		animation:
			sway 7s ease-in-out -1s infinite,
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
	.plant-sway-4 {
		animation:
			sway 10s ease-in-out -2s infinite reverse,
			fadeIn 1.8s 0.34s cubic-bezier(0.2, 0.7, 0.2, 1) both;
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

	@keyframes sway {
		0%,
		100% {
			transform: rotate(-1.5deg);
		}
		50% {
			transform: rotate(1.5deg);
		}
	}
</style>
