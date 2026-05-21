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

<section class="svc-hero paper-bg">
	<div class="svc-hero-gridbg" aria-hidden="true"></div>

	<div class="svc-hero-container container">
		<nav class="svc-crumbs" aria-label="Breadcrumb">
			<a href="/">/ home</a>
			<span class="svc-crumbs-sep" aria-hidden="true">›</span>
			<a href="/#services">/ services</a>
			<span class="svc-crumbs-sep" aria-hidden="true">›</span>
			<span class="svc-crumbs-here">/ {service.title.toLowerCase()}</span>
		</nav>

		<div class="svc-hero-grid">
			<div class="svc-hero-content">
				<h1 class="svc-hero-h1">
					<span class="svc-hero-line">
						<span class="svc-hero-word">{line1}</span>
						{#if hasAmp}
							<span class="svc-hero-amp">&amp;</span>
						{/if}
					</span>
					<span class="svc-hero-line">
						<span class="scribble svc-hero-word-2">
							{line2}
							<ScribbleUnderline variant="thick" />
						</span>
					</span>
				</h1>

				<div class="svc-hero-kicker">
					<span class="font-hand">{service.kicker}</span>
				</div>

				<p class="svc-hero-lead">
					{#each service.lead as seg (seg.text)}
						{#if seg.bold}<strong>{seg.text}</strong>{:else}{seg.text}{/if}
					{/each}
				</p>

				<div class="svc-hero-actions">
					<Button href="#contact">{service.ctaLabel}</Button>
				</div>
			</div>

			<div class="svc-hero-visual">
				<BlueprintDiagram diagram={service.diagram} />
			</div>
		</div>
	</div>
</section>

<style>
	.svc-hero {
		padding: 2rem 0 4.5rem;
		position: relative;
		overflow: hidden;
	}

	@media (min-width: 48rem) {
		.svc-hero {
			padding: 2.5rem 0 6rem;
		}
	}

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

	.svc-hero-container {
		position: relative;
		z-index: 1;
	}

	.svc-crumbs {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
		font-family: var(--mono);
		font-size: 0.75rem;
		color: var(--muted);
		margin-bottom: 2.5rem;
	}

	.svc-crumbs a {
		text-decoration: none;
		color: var(--muted);
		transition: color 0.2s ease;
	}

	.svc-crumbs a:hover {
		color: var(--ink);
	}

	.svc-crumbs-sep {
		opacity: 0.5;
	}

	.svc-crumbs-here {
		color: var(--ink);
		font-weight: 600;
	}

	.svc-hero-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 3rem;
		align-items: center;
	}

	@media (min-width: 64rem) {
		.svc-hero-grid {
			grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
			gap: 4rem;
		}
	}

	.svc-hero-h1 {
		font-size: clamp(2.5rem, 6.5vw, 5.5rem);
		line-height: 0.95;
		letter-spacing: -0.025em;
		font-weight: 600;
		color: var(--ink);
	}

	.svc-hero-line {
		display: block;
	}

	.svc-hero-word {
		display: inline-block;
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

	.scribble {
		position: relative;
		display: inline-block;
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

	.svc-hero-word-2 {
		display: inline-block;
	}

	.svc-hero-kicker {
		margin-top: 1.25rem;
		font-family: var(--hand);
		font-size: clamp(1.375rem, 2.2vw, 1.875rem);
		color: var(--charcoal);
		transform: rotate(-1.5deg) translateX(0.25rem);
		display: inline-block;
	}

	.svc-hero-kicker::before {
		content: '↳ ';
		color: var(--yellow);
		font-family: var(--sans);
		font-weight: 500;
	}

	.svc-hero-lead {
		margin-top: 1.75rem;
		max-width: 34rem;
		font-family: var(--mono);
		font-size: 0.875rem;
		color: var(--body);
		line-height: 1.75;
	}

	.svc-hero-lead :global(strong) {
		color: var(--ink);
		font-weight: 700;
		background: linear-gradient(transparent 65%, rgba(255, 205, 103, 0.45) 65%);
	}

	.svc-hero-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.875rem;
		margin-top: 2rem;
	}

	.svc-hero-visual {
		width: 100%;
		animation: bpIn 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) 0.15s both;
	}

	@media (max-width: 47.9375rem) {
		.svc-hero {
			padding-top: 1.5rem;
			padding-bottom: 4.5rem;
		}
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
