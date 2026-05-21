<script lang="ts">
	import type { Service } from '$lib/services/types';
	import Button from '$lib/components/Button.svelte';
	import ScribbleUnderline from '$lib/components/ScribbleUnderline.svelte';
	import BlueprintDiagram from './BlueprintDiagram.svelte';

	interface Props {
		service: Service;
	}

	let { service }: Props = $props();

	const [line1, line2] = $derived(
		service.title.includes(' & ')
			? service.title.split(' & ')
			: (() => {
					const words = service.title.split(' ');
					const mid = Math.ceil(words.length / 2);
					return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
				})()
	);

	const hasAmp = $derived(service.title.includes(' & '));
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
			<span class="font-semibold text-ink">/ {service.title.toLowerCase()}</span>
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
							<span class="svc-hero-amp">&amp;</span>
						{/if}
					</span>
					<span class="block">
						<span class="scribble relative inline-block">
							{line2}
							<ScribbleUnderline variant="thick" />
						</span>
					</span>
				</h1>

				<div
					class="svc-hero-kicker mt-5 inline-block translate-x-1 rotate-[-1.5deg] font-hand text-[clamp(1.375rem,2.2vw,1.875rem)] text-charcoal"
				>
					{service.kicker}
				</div>

				<p class="svc-hero-lead mt-7 max-w-136 font-mono text-[0.875rem] leading-7 text-body">
					{#each service.lead as seg (seg.text)}
						{#if seg.bold}<strong>{seg.text}</strong>{:else}{seg.text}{/if}
					{/each}
				</p>

				<div class="mt-8 flex flex-wrap gap-3.5">
					<Button href="#contact">{service.ctaLabel}</Button>
				</div>
			</div>

			<div class="svc-hero-visual w-full">
				<BlueprintDiagram diagram={service.diagram} />
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
			linear-gradient(rgba(26, 26, 26, 0.045) 1px, transparent 1px),
			linear-gradient(90deg, rgba(26, 26, 26, 0.045) 1px, transparent 1px);
		background-size: 2.5rem 2.5rem;
		mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, #000 35%, transparent 90%);
		-webkit-mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, #000 35%, transparent 90%);
		opacity: 0.75;
	}

	.svc-hero-amp {
		display: inline-block;
		margin-left: 0.5rem;
		font-family: var(--hand);
		font-weight: 500;
		color: var(--yellow);
		font-size: 0.78em;
		transform: translateY(-0.08em) rotate(-6deg);
	}

	.scribble :global(svg) {
		position: absolute;
		left: -6%;
		right: -6%;
		bottom: -0.875rem;
		width: 112%;
		height: 1.125rem;
		overflow: visible;
	}

	.svc-hero-kicker::before {
		content: '↳ ';
		color: var(--yellow);
		font-family: var(--sans);
		font-weight: 500;
	}

	.svc-hero-lead :global(strong) {
		color: var(--ink);
		font-weight: 700;
		background: linear-gradient(transparent 65%, rgba(255, 205, 103, 0.45) 65%);
	}

	.svc-hero-visual {
		animation: bpIn 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) 0.15s both;
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
