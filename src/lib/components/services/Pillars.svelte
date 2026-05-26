<script lang="ts">
	import type { StoryblokServicesTemplate } from '$lib/types/storyblok';
	import PillarIcon from './PillarIcon.svelte';

	interface Props {
		slug: string;
		content: StoryblokServicesTemplate;
	}

	let { slug, content }: Props = $props();

	const eyebrow = $derived(content.pillars_eyebrow ?? '');
	const title = $derived(content.pillars_title ?? '');
	const lead = $derived(content.pillars_copy ?? '');
	const pillars = $derived(content.pillars ?? []);
</script>

<section
	class="paper-bg relative border-t border-paper-line pt-20 pb-22 md:pt-24 md:pb-28"
	id="pillars"
>
	<div class="container">
		<div class="mb-16">
			<div class="meta-dot font-mono text-[0.8125rem] tracking-[0.06em] text-muted uppercase">
				{eyebrow}
			</div>
			<h2 class="mt-3 max-w-2/3 text-[clamp(2rem,4.2vw,3.5rem)] leading-[1.05] text-balance">
				{title}
			</h2>
			<p class="mt-4 max-w-136 font-mono text-[0.8125rem] leading-[1.7] text-charcoal">
				{lead}
			</p>
		</div>

		<div class="flex flex-col border-t border-paper-line">
			{#each pillars as pillar, i (pillar._uid)}
				<article
					class="grid grid-cols-1 items-center gap-8 border-b border-paper-line py-8 md:py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-20 lg:py-16"
				>
					<div class="pillar-visual {i % 2 === 1 ? 'lg:order-last' : ''}">
						<div
							class="mb-4 inline-flex items-center gap-2 rounded-full border border-ink bg-paper px-2.5 py-1.25 font-mono text-[0.6875rem] tracking-[0.04em] text-ink"
						>
							<span
								class="h-1.75 w-1.75 rounded-full bg-yellow shadow-[0_0_0_0.1875rem_rgba(255,205,103,0.25)]"
							></span>
							<span class="font-semibold">pillar.{pillar.pillar_id}</span>
						</div>
						<PillarIcon {slug} pillarId={pillar.pillar_id} />
					</div>
					<div class="max-w-136">
						<h3
							class="mb-4.5 text-[clamp(1.625rem,3vw,2.5rem)] leading-tight font-semibold tracking-[-0.02em] text-balance text-ink"
						>
							{pillar.title}
						</h3>
						<p
							class="pillar-copy m-0 font-mono text-[0.875rem] leading-[1.8] text-pretty text-body"
						>
							{pillar.copy}
						</p>
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.meta-dot::before {
		content: '●';
		color: var(--yellow);
		margin-right: 0.5rem;
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

	.pillar-copy :global(strong) {
		color: var(--ink);
		font-weight: 700;
	}
</style>
