<script lang="ts">
	import type { ISbStoryData } from '@storyblok/js';
	import type { StoryblokHomePage, StoryblokServicesTemplate } from '$lib/types/storyblok';
	import { parseTitleSegments } from '$lib/utils/format';
	import { parseListItems } from '$lib/utils/richtext';
	import SectionHeader from '$lib/components/SectionHeader.svelte';

	interface Props {
		content?: StoryblokHomePage;
	}
	let { content }: Props = $props();

	const eyebrow = $derived(content?.services_section_eyebrow ?? '02.services');
	const title = $derived(content?.services_section_title ?? 'Diving deep into digital.');
	const titleSegments = $derived(parseTitleSegments(title));
	const copy = $derived(
		content?.services_section_copy ??
			"Together, we bridge the gap between creative discovery and high-performance engineering to scale your vision. Whether we're hardening a single pillar or architecting your entire stack, we ensure every detail is hardened, polished, and resilient."
	);

	const chapters = $derived(
		(content?.featured_services ?? [])
			.filter((s): s is ISbStoryData<StoryblokServicesTemplate> => typeof s !== 'string')
			.map((story, i) => ({
				n: String(i + 1).padStart(2, '0'),
				title: story.content.card_title ?? '',
				href: `/${story.full_slug}`,
				items: parseListItems(story.content.card_list_items)
			}))
	);

	let openIdx = $state(0);

	function toggle(i: number) {
		openIdx = openIdx === i ? -1 : i;
	}
</script>

<section id="services" class="paper-bg relative pt-30 pb-25">
	<div class="container">
		<div class="mb-12">
			<SectionHeader {eyebrow} {titleSegments} {copy} />
		</div>

		<div class="border-t border-ink">
			{#each chapters as s, i (s.n)}
				{@const isOpen = openIdx === i}
				{@const bodyId = `chapter-body-${s.n}`}
				{@const titleId = `chapter-title-${s.n}`}
				<div class="relative overflow-hidden border-b border-ink">
					<button
						type="button"
						onclick={() => toggle(i)}
						aria-expanded={isOpen}
						aria-controls={bodyId}
						class="grid w-full cursor-pointer grid-cols-[3.75rem_1fr_auto] items-center gap-6 px-1 py-4.5 text-left transition-[padding,background] duration-350 ease-in-out hover:bg-yellow/12 hover:pl-7 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ink aria-expanded:pb-2 md:grid-cols-[5rem_1fr_auto] md:px-2 md:py-6.5 md:aria-expanded:pb-2"
					>
						<span class="font-mono text-[0.875rem] text-muted">{s.n}</span>
						<h3 id={titleId} class="text-[clamp(1.75rem,3vw,3rem)] font-medium tracking-[-0.02em]">
							{s.title}
						</h3>
						<span aria-hidden="true" class="font-mono text-[0.75rem] text-muted">
							[{isOpen ? '-' : '+'}]
						</span>
					</button>

					<div
						id={bodyId}
						role="region"
						aria-labelledby={titleId}
						aria-hidden={!isOpen}
						inert={!isOpen ? true : undefined}
						data-open={isOpen}
						class="chapter-body px-2"
					>
						<div>
							<div class="grid grid-cols-1 gap-4.5 pt-2 pb-8 md:grid-cols-2 md:pl-26">
								{#each s.items as it, idx (idx)}
									<div
										class="grid grid-cols-[1.125rem_1fr] gap-2.5 font-mono text-[0.78125rem] leading-[1.6] text-body"
									>
										<svg
											aria-hidden="true"
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
											class="mt-px h-4.5 w-4.5 shrink-0 text-charcoal"
										>
											<path
												d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"
											/>
											<path
												d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"
											/>
											<path
												d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"
											/>
										</svg>
										<span
											>{#each it.runs as run, ri (ri)}{#if run.href}<a
														href={run.href}
														class="underline hover:no-underline"
														>{#if run.bold}<strong class="text-ink">{run.text}</strong
															>{:else}{run.text}{/if}</a
													>{:else if run.bold}<strong class="text-ink">{run.text}</strong
													>{:else}{run.text}{/if}{/each}</span
										>
									</div>
								{/each}
								{#if s.href}
									<div class="col-span-full mt-2 flex justify-end">
										<a
											href={s.href}
											class="group inline-flex items-center font-mono text-[0.75rem] font-bold text-ink"
										>
											<span
												class="transition duration-300 group-hover:-translate-x-2 group-hover:opacity-0"
												>[</span
											>
											<span class="px-1">full service overview</span>
											<span class="transition duration-200 ease-[ease] group-hover:translate-x-1"
												>→</span
											>
											<span
												class="transition duration-300 group-hover:translate-x-2 group-hover:opacity-0"
												>]</span
											>
										</a>
									</div>
								{/if}
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.chapter-body {
		display: grid;
		grid-template-rows: 0fr;
		transition:
			grid-template-rows 0.5s ease,
			opacity 0.35s ease;
		opacity: 0;
	}
	.chapter-body[data-open='true'] {
		grid-template-rows: 1fr;
		opacity: 1;
	}
	.chapter-body > div {
		overflow: hidden;
		min-height: 0;
	}
</style>
