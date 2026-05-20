<script lang="ts">
	import type { ISbStoryData } from '@storyblok/js';
	import type { StoryblokHomePage, StoryblokBlogPost } from '$lib/types/storyblok';
	import { formatDate } from '$lib/utils/format';
	import { resolveMultilink } from '$lib/utils/links';
	import Button from '$lib/components/Button.svelte';
	import PostCard from '$lib/components/PostCard.svelte';

	interface Props {
		content?: StoryblokHomePage;
		posts?: ISbStoryData<StoryblokBlogPost>[];
	}
	let { content, posts = [] }: Props = $props();

	const eyebrow = $derived(content?.blog_eyebrow);
	const title = $derived(content?.blog_title);
	const copy = $derived(content?.blog_copy);

	const cta = $derived(content?.CTA?.[0]);
	const ctaLink = $derived(resolveMultilink(cta?.link));

	const cards = $derived(
		posts
			.filter((story) => story && story.slug)
			.map((story) => {
				const published = story.first_published_at ?? story.published_at ?? null;
				return {
					key: story.uuid ?? story.slug,
					tag: String(story.content?.Category?.[0] ?? ''),
					datetime: published ?? '',
					date: published ? formatDate(published) : '',
					title: story.name ?? '',
					blurb: story.content?.summary ?? '',
					href: `/${story.slug}`
				};
			})
	);
</script>

<section id="blog" class="paper-bg relative pt-18 pb-20">
	<div class="container">
		<header class="mb-12 flex flex-wrap items-end justify-between gap-8">
			<div>
				{#if eyebrow}
					<div
						class="font-mono text-sm tracking-wider text-muted uppercase before:mr-2 before:text-yellow before:content-['●']"
					>
						// {eyebrow}
					</div>
				{/if}
				{#if title}
					<h2 class="mt-2">
						<span class="scribble">
							{title}
							<svg viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden="true">
								<path
									d="M2 9 C 40 2, 80 12, 120 6 S 180 10, 198 5"
									stroke="var(--yellow)"
									stroke-width="4"
									fill="none"
									stroke-linecap="round"
									opacity="0.9"
								/>
							</svg>
						</span>
					</h2>
				{/if}
				{#if copy}
					<p class="mt-3.5 max-w-lg font-mono text-[0.8125rem] leading-[1.7] text-charcoal">
						{copy}
					</p>
				{/if}
			</div>
			{#if ctaLink}
				<Button href={ctaLink.href} target={ctaLink.target} rel={ctaLink.rel} variant="primary">
					{cta?.label ?? 'view all posts →'}
				</Button>
			{/if}
		</header>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each cards as c, i (c.key)}
				<PostCard
					tag={c.tag}
					date={c.date}
					datetime={c.datetime}
					title={c.title}
					blurb={c.blurb}
					href={c.href}
					index={i}
				/>
			{/each}
		</div>
	</div>
</section>
