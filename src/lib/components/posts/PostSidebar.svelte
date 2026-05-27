<script lang="ts">
	import ShareButtons from './ShareButtons.svelte';

	interface PrevPost {
		title: string;
		href: string;
	}

	interface Props {
		title: string;
		prev?: PrevPost;
		topics?: string[];
	}

	let { title, prev, topics = [] }: Props = $props();
</script>

<aside
	class="sticky top-22 hidden min-w-0 flex-col gap-0 self-start py-10 lg:flex"
	aria-label="Article sidebar"
>
	<div class="mb-3 font-mono text-[0.625rem] font-semibold tracking-widest text-ink-soft uppercase">
		share
	</div>
	<div class="flex flex-col gap-1.75">
		<ShareButtons {title} variant="sidebar" />
	</div>

	<hr class="my-5.5 border-t border-paper-line" />

	{#if topics.length > 0}
		<div
			class="mb-3 font-mono text-[0.625rem] font-semibold tracking-widest text-ink-soft uppercase"
		>
			topics
		</div>
		<div class="flex flex-wrap gap-1.5">
			{#each topics as topic (topic)}
				<a
					href="/#blog"
					class="rounded-full border border-paper-line px-2.25 py-0.75 font-mono text-[0.625rem] tracking-[0.06em] text-ink-soft uppercase no-underline transition-colors hover:border-ink hover:bg-ink/4 hover:text-ink"
				>
					{topic}
				</a>
			{/each}
		</div>

		<hr class="my-5.5 border-t border-paper-line" />
	{/if}

	<nav class="flex flex-col gap-0" aria-label="Post navigation">
		<a
			href="/#blog"
			class="group flex items-center gap-2 py-1.5 font-mono text-xs text-charcoal no-underline transition-colors hover:text-ink"
		>
			<span class="transition-transform group-hover:-translate-x-1">←</span>
			<span>Back to blog</span>
		</a>

		{#if prev}
			<div class="mt-5">
				<span class="mb-1.5 block font-mono text-[0.5625rem] tracking-widest text-muted uppercase">
					previous post
				</span>
				<a
					href={prev.href}
					class="block font-mono text-xs leading-[1.45] text-charcoal no-underline transition-colors hover:text-ink"
				>
					{prev.title}
				</a>
			</div>
		{/if}
	</nav>
</aside>
