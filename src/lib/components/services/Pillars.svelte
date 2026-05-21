<script lang="ts">
	import type { Pillar } from '$lib/services/types';
	import PillarIcon from './PillarIcon.svelte';

	interface Props {
		head: { meta: string; title: string; lead: string };
		items: Pillar[];
	}

	let { head, items }: Props = $props();
</script>

<section class="pillars paper-bg" id="pillars">
	<div class="container">
		<div class="pillars-head">
			<div class="meta meta-dot">{head.meta}</div>
			<h2 class="pillars-title">{head.title}</h2>
			<p class="pillars-lead">{head.lead}</p>
		</div>

		<div class="pillars-list">
			{#each items as item, i (item.tag)}
				<article class="pillar {i % 2 === 1 ? 'pillar--flip' : ''}">
					<div class="pillar-visual">
						<div class="pillar-tag">
							<span class="pillar-tag-dot"></span>
							<span class="pillar-tag-text">{item.tag}</span>
						</div>
						<PillarIcon kind={item.icon} />
					</div>
					<div class="pillar-body">
						<h3 class="pillar-h3">{item.heading}</h3>
						<p class="pillar-copy">{item.copy}</p>
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.pillars {
		padding: 5rem 0 5.5rem;
		position: relative;
		border-top: 1px solid var(--paper-line);
	}

	@media (min-width: 48rem) {
		.pillars {
			padding: 6rem 0 7rem;
		}
	}

	.pillars-head {
		margin-bottom: 4rem;
	}

	.pillars-title {
		margin-top: 0.75rem;
		font-size: clamp(2rem, 4.2vw, 3.5rem);
		line-height: 1.05;
		text-wrap: balance;
	}

	.pillars-lead {
		margin-top: 1rem;
		max-width: 34rem;
		font-family: var(--mono);
		font-size: 0.8125rem;
		line-height: 1.7;
		color: var(--charcoal);
	}

	.meta {
		font-family: var(--mono);
		font-size: 0.8125rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--muted);
	}

	.meta-dot::before {
		content: '●';
		color: var(--yellow);
		margin-right: 0.5rem;
	}

	.pillars-list {
		display: flex;
		flex-direction: column;
		gap: 0;
		border-top: 1px solid var(--paper-line);
	}

	.pillar {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
		padding: 3rem 0;
		border-bottom: 1px solid var(--paper-line);
		align-items: center;
	}

	@media (min-width: 64rem) {
		.pillar {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
			gap: 5rem;
			padding: 4rem 0;
		}

		.pillar--flip .pillar-visual {
			order: 1;
		}

		.pillar--flip .pillar-body {
			order: 0;
		}
	}

	.pillar-visual {
		position: relative;
		background:
			linear-gradient(rgba(26, 26, 26, 0.04) 1px, transparent 1px) 0 0 / 1.25rem 1.25rem,
			linear-gradient(90deg, rgba(26, 26, 26, 0.04) 1px, transparent 1px) 0 0 / 1.25rem 1.25rem,
			var(--paper-2);
		border: 1px solid var(--paper-line);
		border-radius: 0.625rem;
		padding: 1.5rem 1.5rem 1.25rem;
		overflow: hidden;
	}

	.pillar-tag {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.3125rem 0.625rem;
		background: var(--paper);
		border: 1px solid var(--ink);
		border-radius: 9999px;
		font-family: var(--mono);
		font-size: 0.6875rem;
		letter-spacing: 0.04em;
		color: var(--ink);
		margin-bottom: 1rem;
	}

	.pillar-tag-dot {
		width: 0.4375rem;
		height: 0.4375rem;
		border-radius: 50%;
		background: var(--yellow);
		box-shadow: 0 0 0 0.1875rem rgba(255, 205, 103, 0.25);
	}

	.pillar-tag-text {
		font-weight: 600;
	}

	.pillar-body {
		max-width: 34rem;
	}

	.pillar-h3 {
		font-size: clamp(1.625rem, 3vw, 2.5rem);
		font-weight: 600;
		letter-spacing: -0.02em;
		color: var(--ink);
		margin-bottom: 1.125rem;
		text-wrap: balance;
	}

	.pillar-copy {
		font-family: var(--mono);
		font-size: 0.875rem;
		line-height: 1.8;
		color: var(--body);
		margin: 0;
		text-wrap: pretty;
	}

	.pillar-copy :global(strong) {
		color: var(--ink);
		font-weight: 700;
	}

	@media (max-width: 47.9375rem) {
		.pillar {
			padding: 2rem 0;
		}
	}
</style>
