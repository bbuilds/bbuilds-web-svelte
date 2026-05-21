<script lang="ts">
	import { onMount } from 'svelte';
	import { SvelteSet, SvelteMap } from 'svelte/reactivity';
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
	const ctaText = $derived(content?.hero_cta_text ?? 'start a project');
	const cta = $derived(resolveMultilink(content?.hero_cta_url));

	interface FallingLeaf {
		id: number;
		x: number;
		size: number;
		fill: string;
		initialRot: number;
		fallDur: number;
		swayDur: number;
		swayAmp: number;
		tumbleDur: number;
		tumbleDir: 'normal' | 'reverse';
	}

	const LEAF_COLORS = ['#7ba87b', '#6f9c6e', '#8fb88c', '#9bc198', '#5e8a5a', '#c9b674', '#a89a4e'];

	function makeFallingLeaf(id: number): FallingLeaf {
		return {
			id,
			x: 2 + Math.random() * 96,
			size: 26 + Math.random() * 40,
			fill: LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)],
			initialRot: Math.random() * 360,
			fallDur: 7 + Math.random() * 6,
			swayDur: 2.4 + Math.random() * 2.2,
			swayAmp: (18 + Math.random() * 38) / 16,
			tumbleDur: 5 + Math.random() * 8,
			tumbleDir: Math.random() > 0.5 ? 'normal' : 'reverse'
		};
	}

	let leaves = $state<FallingLeaf[]>([]);
	let heroEl: HTMLElement;
	let fallDistance = $state(700);

	const leafBlowEls = new SvelteMap<number, HTMLElement>();
	const leafOffsets = new SvelteMap<number, { x: number; y: number; vx: number; vy: number }>();
	let mouseX = 0;
	let mouseY = 0;
	let prevMouseX = 0;
	let prevMouseY = 0;
	let mouseInside = false;

	let wi = $state(0);

	onMount(() => {
		if (words.length > 0) {
			const id = setInterval(() => {
				wi = (wi + 1) % words.length;
			}, 2400);

			// leaf system
			const ro = new ResizeObserver(() => {
				fallDistance = heroEl.offsetHeight + 80;
			});
			ro.observe(heroEl);
			fallDistance = heroEl.offsetHeight + 80;

			let leafId = 0;
			const timeouts = new SvelteSet<ReturnType<typeof setTimeout>>();
			const spawnInterval = setInterval(() => {
				const leaf = makeFallingLeaf(++leafId);
				leaves = [...leaves, leaf];
				const t = setTimeout(() => {
					timeouts.delete(t);
					leaves = leaves.filter((l) => l.id !== leaf.id);
				}, leaf.fallDur * 1000);
				timeouts.add(t);
			}, 1400);

			// mouse blow interaction
			const onPointerMove = (e: PointerEvent) => {
				if (!mouseInside) {
					prevMouseX = e.clientX;
					prevMouseY = e.clientY;
				}
				mouseX = e.clientX;
				mouseY = e.clientY;
				mouseInside = true;
			};
			const onPointerLeave = () => {
				mouseInside = false;
			};
			heroEl.addEventListener('pointermove', onPointerMove);
			heroEl.addEventListener('pointerleave', onPointerLeave);

			let rafId = 0;
			const tick = () => {
				const dx = mouseX - prevMouseX;
				const dy = mouseY - prevMouseY;
				prevMouseX = mouseX;
				prevMouseY = mouseY;

				for (const [leafKey, el] of leafBlowEls) {
					const off = leafOffsets.get(leafKey);
					if (!off) continue;

					if (mouseInside) {
						const rect = el.getBoundingClientRect();
						const cx = rect.left + rect.width / 2;
						const cy = rect.top + rect.height / 2;
						const dist = Math.hypot(mouseX - cx, mouseY - cy);
						const auraRadius = rect.width / 2 + 48;
						if (dist < auraRadius) {
							const falloff = 1 - dist / auraRadius;
							const accel = 0.35 * falloff;
							off.vx += dx * accel;
							off.vy += dy * accel;
						}
					}

					// gentle restoring force toward natural fall path
					off.vx -= off.x * 0.012;
					off.vy -= off.y * 0.012;

					// air drag on velocity
					off.vx *= 0.92;
					off.vy *= 0.92;

					// integrate velocity → position
					off.x += off.vx;
					off.y += off.vy;

					if (Math.abs(off.x) < 0.1 && Math.abs(off.vx) < 0.05) {
						off.x = 0;
						off.vx = 0;
					}
					if (Math.abs(off.y) < 0.1 && Math.abs(off.vy) < 0.05) {
						off.y = 0;
						off.vy = 0;
					}

					el.style.setProperty('--blow-x', `${off.x}px`);
					el.style.setProperty('--blow-y', `${off.y}px`);
				}
				rafId = requestAnimationFrame(tick);
			};
			rafId = requestAnimationFrame(tick);

			return () => {
				clearInterval(id);
				clearInterval(spawnInterval);
				timeouts.forEach((t) => clearTimeout(t));
				ro.disconnect();
				heroEl.removeEventListener('pointermove', onPointerMove);
				heroEl.removeEventListener('pointerleave', onPointerLeave);
				cancelAnimationFrame(rafId);
			};
		}
	});
</script>

<section class="paper-bg relative overflow-hidden pt-16 pb-30" bind:this={heroEl}>
	<!-- Falling leaves layer -->
	<div class="hero-leaves-layer" style="--hero-fall-distance: {fallDistance}px" aria-hidden="true">
		{#each leaves as l (l.id)}
			<div class="falling-leaf" style="left: {l.x}%; --fall-dur: {l.fallDur}s">
				<div
					class="leaf-blow"
					{@attach (el) => {
						leafBlowEls.set(l.id, el as HTMLElement);
						leafOffsets.set(l.id, { x: 0, y: 0, vx: 0, vy: 0 });
						return () => {
							leafBlowEls.delete(l.id);
							leafOffsets.delete(l.id);
						};
					}}
				>
					<div class="leaf-sway" style="--sway-dur: {l.swayDur}s; --sway-amp: {l.swayAmp}rem">
						<div
							class="leaf-tumble"
							style="--tumble-dur: {l.tumbleDur}s; animation-direction: {l.tumbleDir}"
						>
							<svg
								viewBox="0 0 100 140"
								width={l.size}
								style="transform: rotate({l.initialRot}deg)"
								aria-hidden="true"
							>
								<path
									d="M50 6 C 78 22, 90 70, 60 128 C 52 132, 44 132, 38 128 C 12 90, 18 36, 50 6 Z"
									fill={l.fill}
									stroke="#1a1a1a"
									stroke-width="1.4"
									stroke-linejoin="round"
								/>
								<path
									d="M50 14 C 50 60, 50 100, 50 128"
									stroke="#1a1a1a"
									stroke-width="0.9"
									fill="none"
									opacity="0.55"
								/>
								<path
									d="M50 38 Q66 50, 72 70"
									stroke="#1a1a1a"
									stroke-width="0.6"
									fill="none"
									opacity="0.4"
								/>
								<path
									d="M50 38 Q34 50, 28 70"
									stroke="#1a1a1a"
									stroke-width="0.6"
									fill="none"
									opacity="0.4"
								/>
								<path
									d="M50 70 Q68 82, 70 100"
									stroke="#1a1a1a"
									stroke-width="0.6"
									fill="none"
									opacity="0.4"
								/>
								<path
									d="M50 70 Q32 82, 30 100"
									stroke="#1a1a1a"
									stroke-width="0.6"
									fill="none"
									opacity="0.4"
								/>
							</svg>
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>

	<!-- Sun sticker -->
	<div
		class="pointer-events-none absolute opacity-25 md:opacity-100"
		style="right: 8%; top: 3.75rem;"
	>
		<div class="sticker" aria-hidden="true"></div>
	</div>

	<div class="relative z-2 container">
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
		width: 5.5rem;
		height: 5.5rem;
		border-radius: 50%;
		background: radial-gradient(circle at var(--sun-x) var(--sun-y), #fff3bb 0%, #ffcd67 70%);
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
				0 0 2rem 0.375rem rgba(255, 205, 103, 0.45),
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

	.falling-leaf {
		position: absolute;
		top: -4rem;
		will-change: transform;
		animation: leafFall var(--fall-dur, 9s) linear forwards;
	}

	.leaf-blow {
		transform: translate(var(--blow-x, 0px), var(--blow-y, 0px));
		will-change: transform;
	}

	@keyframes leafFall {
		0% {
			transform: translateY(0);
		}
		100% {
			transform: translateY(var(--hero-fall-distance, 110vh));
		}
	}

	.leaf-sway {
		will-change: transform;
		animation: leafSway var(--sway-dur, 3s) ease-in-out infinite;
	}

	@keyframes leafSway {
		0%,
		100% {
			transform: translateX(calc(var(--sway-amp, 1.875rem) * -1));
		}
		50% {
			transform: translateX(var(--sway-amp, 1.875rem));
		}
	}

	.leaf-tumble {
		will-change: transform;
		animation: leafTumble var(--tumble-dur, 7s) linear infinite;
	}

	@keyframes leafTumble {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
