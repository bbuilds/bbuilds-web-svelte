<script lang="ts">
	import type { StoryblokHero } from '$lib/types/storyblok';
	import { getDiagram } from '$lib/services/diagrams';
	import { resolveMultilink } from '$lib/utils/links';
	import { parseHighlights } from '$lib/utils/parseHighlights';
	import Button from '$lib/components/Button.svelte';
	import ScribbleUnderline from '$lib/components/svgs/illustrations/ScribbleUnderline.svelte';
	import BlueprintDiagram from './BlueprintDiagram.svelte';

	interface Props {
		slug: string;
		hero: StoryblokHero | undefined;
	}

	let { slug, hero }: Props = $props();

	const title = $derived(hero?.title ?? '');
	const [line1, line2] = $derived(
		title.includes(' & ')
			? title.split(' & ')
			: (() => {
					const words = title.split(' ');
					const mid = Math.ceil(words.length / 2);
					return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
				})()
	);
	const hasAmp = $derived(title.includes(' & '));

	const kicker = $derived(hero?.tagline ?? '');
	const copy = $derived(parseHighlights(hero?.copy ?? ''));
	const cta = $derived(resolveMultilink(hero?.CTA?.[0]?.link));
	const ctaLabel = $derived(hero?.CTA?.[0]?.label ?? 'get in touch');

	const diagram = $derived(getDiagram(slug));
</script>

<section class="paper-bg relative overflow-hidden pt-6 pb-18 md:pt-10 md:pb-24">
	<div class="svc-hero-gridbg" aria-hidden="true"></div>

	<div class="relative z-1 container">
		<nav
			class="mb-10 flex flex-wrap items-center gap-2 font-mono text-xs text-muted"
			aria-label="Breadcrumb"
		>
			<a href="/" class="text-muted no-underline transition-colors duration-200 hover:text-ink"
				>/ home</a
			>
			<span class="opacity-50" aria-hidden="true">›</span>
			<a
				href="/#services"
				class="text-muted no-underline transition-colors duration-200 hover:text-ink">/ services</a
			>
			<span class="opacity-50" aria-hidden="true">›</span>
			<span class="font-semibold text-ink">/ {title.toLowerCase()}</span>
		</nav>

		<div
			class="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16"
		>
			<div>
				<h1
					class="text-[clamp(2.5rem,6.5vw,5.5rem)] leading-[0.95] font-semibold tracking-tight text-ink"
				>
					<span class="block">
						<span class="inline-block">{line1}</span>
						{#if hasAmp}
							<span
								class="ml-2 inline-block translate-y-[-0.08em] -rotate-6 font-hand text-[0.78em] font-medium text-yellow"
								>&amp;</span
							>
						{/if}
					</span>
					<span class="block">
						<span class="scribble relative inline-block">
							{line2}
							<ScribbleUnderline variant="thick" />
						</span>
					</span>
				</h1>

				{#if kicker}
					<div
						class="svc-hero-kicker mt-5 inline-block translate-x-1 rotate-[-1.5deg] font-hand text-[clamp(1.375rem,2.2vw,1.875rem)] text-charcoal"
					>
						{kicker}
					</div>
				{/if}

				{#if copy.length}
					<p class="svc-hero-lead mt-7 max-w-136 font-mono text-[0.875rem] leading-7 text-body">
						{#each copy as seg (seg.text + seg.highlight)}
							{#if seg.highlight}<strong>{seg.text}</strong>{:else}{seg.text}{/if}
						{/each}
					</p>
				{/if}

				<div class="mt-8 flex flex-wrap gap-3.5">
					<Button href={cta?.href ?? '#contact'} target={cta?.target} rel={cta?.rel}
						>{ctaLabel}</Button
					>
				</div>
			</div>

			<div class="w-full animate-[bpIn_0.7s_cubic-bezier(0.2,0.7,0.2,1)_0.15s_both]">
				<BlueprintDiagram {diagram} />
			</div>
		</div>
	</div>
</section>

<style>
	.svc-hero-gridbg {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background-image:
			linear-gradient(rgb(from var(--ink) r g b / 0.045) 1px, transparent 1px),
			linear-gradient(90deg, rgb(from var(--ink) r g b / 0.045) 1px, transparent 1px);
		background-size: 2.5rem 2.5rem;
		mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, #000 35%, transparent 90%);
		-webkit-mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, #000 35%, transparent 90%);
		opacity: 0.75;
	}

	.svc-hero-kicker::before {
		content: '↳ ' / '';
		color: var(--yellow);
		font-family: var(--sans);
		font-weight: 500;
	}

	.svc-hero-lead :global(strong) {
		color: var(--ink);
		font-weight: 700;
		background: linear-gradient(transparent 65%, var(--pale-fire-45) 65%);
	}

	@keyframes bpIn {
		from {
			opacity: 0;
			transform: translateY(1.25rem) scale(0.97);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
</style>
