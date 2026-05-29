<script lang="ts">
	import type { PageData } from './$types';
	import BlogHero from '$lib/components/blog/BlogHero.svelte';
	import PostCard from '$lib/components/PostCard.svelte';
	import { toBlogCard } from '$lib/utils/blog';
	import { resolveMultilink } from '$lib/utils/links';
	import Button from '$lib/components/Button.svelte';

	let { data }: { data: PageData } = $props();

	const PAGE_SIZE = 6;
	let query = $state('');
	let extraLoads = $state(0);

	const hero = $derived(data.story?.content?.hero?.[0]);
	const ctaLink = $derived(resolveMultilink(hero?.CTA?.[0]?.link));

	const allCards = $derived(
		data.posts
			.filter((p) => p && p.slug)
			.map(toBlogCard)
			.sort((a, b) => b.effectiveAt - a.effectiveAt)
	);

	const term = $derived(query.trim().toLowerCase());

	const filtered = $derived(
		term ? allCards.filter((c) => c.searchHaystack.includes(term)) : allCards
	);
	const visible = $derived((1 + extraLoads) * PAGE_SIZE);
	const shown = $derived(filtered.slice(0, visible));
	const hasMore = $derived(visible < filtered.length);
	const isFiltered = $derived(term.length > 0);

	function reset() {
		query = '';
		extraLoads = 0;
	}
</script>

<BlogHero
	eyebrow={hero?.tagline}
	title={hero?.title}
	copy={hero?.copy}
	ctaLabel={hero?.CTA?.[0]?.label}
	ctaHref={ctaLink?.href}
	ctaTarget={ctaLink?.target}
	ctaRel={ctaLink?.rel}
/>

<section class="paper-bg pt-14 pb-20">
	<div class="container">
		<!-- search -->
		<div class="relative mb-8 w-full">
			<svg
				class="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<circle cx="11" cy="11" r="8" />
				<path d="m21 21-4.35-4.35" />
			</svg>
			<input
				type="search"
				value={query}
				oninput={(e) => {
					query = e.currentTarget.value;
					extraLoads = 0;
				}}
				id="search-posts"
				placeholder="Search Branden Builds"
				aria-label="Search posts"
				class="w-full rounded-[0.625rem] border border-paper-line bg-gray py-3 pr-4 pl-10 font-mono text-sm text-ink placeholder:text-muted focus-visible:border-yellow focus-visible:ring-2 focus-visible:ring-yellow/10 focus-visible:outline-none"
			/>
		</div>

		<!-- meta bar -->
		{#if isFiltered}
			<div class="mb-6 flex items-center gap-4 font-mono text-[0.6875rem] text-muted">
				<span>
					{filtered.length}
					{filtered.length === 1 ? 'post' : 'posts'} found matching "{term}"
				</span>
				<button
					type="button"
					onclick={reset}
					class="cursor-pointer text-yellow transition-colors hover:text-yellow/70"
				>
					✕ clear
				</button>
			</div>
		{/if}

		<!-- posts grid -->
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each shown as c, i (c.key)}
				<PostCard
					tag={c.tag}
					date={c.date}
					datetime={c.datetime}
					title={c.title}
					blurb={c.blurb}
					href={c.href}
					index={i}
					image={c.image}
					eager={i < 3}
				/>
			{:else}
				<div class="col-span-full py-16 text-center font-mono text-muted">
					<div class="mb-2 text-[1.25rem] opacity-40">∅</div>
					No posts found matching "{term}".
					<button
						type="button"
						onclick={reset}
						class="mt-4 block w-full text-yellow hover:text-yellow/70 transition-colors cursor-pointer"
					>
						clear filters
					</button>
				</div>
			{/each}
		</div>

		<!-- load more -->
		{#if hasMore}
			<div class="mt-12 flex justify-center">
				<Button onclick={() => (extraLoads += 1)} variant="ghost">Load More Articles</Button>
			</div>
		{/if}
	</div>
</section>
