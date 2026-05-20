<script lang="ts">
	import PostHeader from '$lib/components/posts/PostHeader.svelte';
	import PostSidebar from '$lib/components/posts/PostSidebar.svelte';
	import RichTextRenderer from '$lib/components/posts/RichTextRenderer.svelte';
	import ReadingProgress from '$lib/components/posts/ReadingProgress.svelte';
	import NextPostCard from '$lib/components/posts/NextPostCard.svelte';
	import { formatDate, kickerTag, readTime } from '$lib/utils/format';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const post = $derived(data.post);

	const dateDisplay = $derived(formatDate(post.first_published_at));
	const readTimeDisplay = $derived(readTime(post.content.content));
	const kicker = $derived(kickerTag(post));
	const hero = $derived(post.content.featured_image);
</script>

<svelte:head>
	<title>{post.name} — BrandenBuilds</title>
	<meta name="description" content={post.content.summary} />
</svelte:head>

<ReadingProgress />

<PostHeader
	name={post.name}
	{kicker}
	{dateDisplay}
	datetime={post.first_published_at.slice(0, 10)}
	readTime={readTimeDisplay}
	topics={post.tag_list}
/>

<div
	class="post-wrap mx-auto grid max-w-352 grid-cols-1 px-4.5 md:px-8 lg:grid-cols-[13.5rem_1fr] lg:items-start lg:gap-x-16 lg:px-10"
>
	<PostSidebar title={post.name} />

	<article class="min-w-0 pt-8 pb-12 md:pt-11 md:pb-16">
		<div class="relative mb-11 aspect-16/7 overflow-hidden rounded-2xl border border-paper-line">
			<img
				src={hero.filename}
				alt={hero.alt ?? post.name}
				class="block h-full w-full object-cover"
			/>
		</div>

		<div class="post-body max-w-184">
			<RichTextRenderer doc={post.content.content} />
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
