<script lang="ts">
	import PostHeader from '$lib/components/posts/PostHeader.svelte';
	import PostSidebar from '$lib/components/posts/PostSidebar.svelte';
	import RichTextRenderer from '$lib/components/posts/RichTextRenderer.svelte';
	import ReadingProgress from '$lib/components/posts/ReadingProgress.svelte';
	import NextPostCard from '$lib/components/posts/NextPostCard.svelte';
	import { formatDate, kickerTag, readTime } from '$lib/utils/format';
	import type { RichTextDoc } from '$lib/types/post';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const story = $derived(data.story);
	const content = $derived(story.content);

	const dateDisplay = $derived(formatDate(story.first_published_at));
	const richTextDoc = $derived(content?.content as unknown as RichTextDoc);
	const readTimeDisplay = $derived(richTextDoc ? readTime(richTextDoc) : '');
	const kicker = $derived(kickerTag(content?.Category, story.tag_list ?? []));
	const hero = $derived(content?.featured_image);
</script>

<ReadingProgress />

<PostHeader
	name={story.name}
	{kicker}
	{dateDisplay}
	datetime={story.first_published_at.slice(0, 10)}
	readTime={readTimeDisplay}
	topics={story.tag_list ?? []}
/>

<div
	class="post-wrap mx-auto grid max-w-352 grid-cols-1 px-4.5 md:px-8 lg:grid-cols-[13.5rem_1fr] lg:items-start lg:gap-x-16 lg:px-10"
>
	<PostSidebar title={story.name} />

	<article class="min-w-0 pt-8 pb-12 md:pt-11 md:pb-16">
		{#if hero?.filename}
			<div class="relative mb-11 aspect-16/7 overflow-hidden rounded-2xl border border-paper-line">
				<img
					src={hero.filename}
					alt={hero.alt || story.name}
					class="block h-full w-full object-cover"
				/>
			</div>
		{/if}

		<div class="post-body max-w-184">
			{#if richTextDoc}
				<RichTextRenderer doc={richTextDoc} />
			{/if}
			<NextPostCard />
		</div>
	</article>
</div>

<style>
	.post-body :global(> p:first-of-type) {
		font-size: 1.0625rem;
		line-height: 1.72;
		color: var(--ink-soft);
	}
	@media (min-width: 48rem) {
		.post-body :global(> p:first-of-type) {
			font-size: 1.125rem;
		}
	}
</style>
