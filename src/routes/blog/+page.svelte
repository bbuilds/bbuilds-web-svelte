<script lang="ts">
	import type { PageData } from './$types';
	import BlogHero from '$lib/components/blog/BlogHero.svelte';
	import PostCard from '$lib/components/PostCard.svelte';
	import { formatDate, kickerTag } from '$lib/utils/format';
	import { resolveMultilink } from '$lib/utils/links';

	let { data }: { data: PageData } = $props();

	const PAGE_SIZE = 6;
	let query = $state('');
	let extraLoads = $state(0);

	const hero = $derived(data.story?.content?.hero?.[0]);
	const ctaLink = $derived(resolveMultilink(hero?.CTA?.[0]?.link));

	const allCards = $derived(
		data.posts
			.filter((p) => p && p.slug)
			.map((story) => {
				const updated =
					story.content?.updated_date && !isNaN(new Date(story.content.updated_date).getTime())
						? story.content.updated_date
						: undefined;
				const effectiveIso = updated ?? story.first_published_at ?? story.published_at ?? '';
				const tag = kickerTag(story.content?.Category, story.tag_list ?? []);
				return {
					key: story.uuid ?? story.slug,
					tag,
					datetime: effectiveIso,
					date: effectiveIso ? formatDate(effectiveIso) : '',
					effectiveAt: effectiveIso ? new Date(effectiveIso).getTime() : 0,
					title: story.name ?? '',
					blurb: story.content?.summary ?? '',
					href: `/${story.slug}`,
					image: story.content?.featured_image,
					searchHaystack: [
						story.name ?? '',
						story.content?.summary ?? '',
						tag,
						...(story.tag_list ?? [])
					]
						.join(' ')
						.toLowerCase()
				};
			})
			.sort((a, b) => b.effectiveAt - a.effectiveAt)
	);

	const filtered = $derived(
		query.trim()
			? allCards.filter((c) => c.searchHaystack.includes(query.trim().toLowerCase()))
			: allCards
	);
	const visible = $derived((1 + extraLoads) * PAGE_SIZE);
	const shown = $derived(filtered.slice(0, visible));
	const hasMore = $derived(visible < filtered.length);
	const isFiltered = $derived(query.trim().length > 0);
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
				name="search posts"
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
					{filtered.length === 1 ? 'post' : 'posts'} found matching "{query.trim()}"
				</span>
				<button
					type="button"
					onclick={() => {
						query = '';
						extraLoads = 0;
					}}
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
					No posts found matching "{query.trim()}".
					<button
						type="button"
						onclick={() => {
							query = '';
							extraLoads = 0;
						}}
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
				<button
					type="button"
					onclick={() => (extraLoads += 1)}
					class="btn btn-ghost inline-flex cursor-pointer items-center rounded-full border border-ink px-[1.375rem] py-[0.875rem] font-mono text-[0.8125rem] text-ink transition-colors hover:bg-ink hover:text-paper"
				>
					Load More Articles
				</button>
			</div>
		{/if}
	</div>
</section>
