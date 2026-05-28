<script lang="ts">
	import ShareButtons from './ShareButtons.svelte';

	interface Props {
		name: string;
		kicker: string;
		dateDisplay: string;
		datetime: string;
		updatedDateDisplay?: string;
		updatedDatetime?: string;
		readTime: string;
		topics: string[];
	}

	let {
		name,
		kicker,
		dateDisplay,
		datetime,
		updatedDateDisplay,
		updatedDatetime,
		readTime,
		topics
	}: Props = $props();
</script>

<header
	class="paper-bg relative border-b border-paper-line pt-8 pb-7 md:pt-14 md:pb-11"
	style="background: var(--paper)"
>
	<div class="container text-center">
		<div class="mb-4 flex flex-wrap items-center justify-center gap-2.5">
			<span
				class="rounded-full bg-yellow/10 px-2.5 py-1 font-mono text-[0.6875rem] font-semibold tracking-[0.06em] text-yellow uppercase"
			>
				{kicker}
			</span>
			<span class="text-[0.3125rem] text-muted opacity-50">●</span>
			<time {datetime} class="font-mono text-xs tracking-[0.03em] text-muted">{dateDisplay}</time>
			{#if updatedDateDisplay && updatedDatetime}
				<span class="text-[0.3125rem] text-muted opacity-50">●</span>
				<span class="font-mono text-xs tracking-[0.03em] text-muted italic">Updated</span>
				<time datetime={updatedDatetime} class="font-mono text-xs tracking-[0.03em] text-muted"
					>{updatedDateDisplay}</time
				>
			{/if}
			<span class="text-[0.3125rem] text-muted opacity-50">●</span>
			<span class="font-mono text-xs tracking-[0.03em] text-muted">{readTime}</span>
		</div>

		<h1
			class="mt-2.5 text-[clamp(2rem,5vw,3.75rem)] leading-[1.06] font-bold tracking-[-0.03em] text-ink"
		>
			{name}
		</h1>

		<nav
			class="mt-5 flex flex-wrap items-center justify-center gap-2 font-mono text-[0.6875rem] tracking-[0.06em] text-muted uppercase"
			aria-label="Breadcrumb"
		>
			<a href="/" class="no-underline transition-colors hover:text-ink">Home</a>
			<span class="opacity-35" aria-hidden="true">›</span>
			<a href="/#blog" class="no-underline transition-colors hover:text-ink">Blog</a>
			<span class="opacity-35" aria-hidden="true">›</span>
			<span class="text-charcoal" aria-current="page">{name}</span>
		</nav>

		<div class="mt-6 flex flex-wrap justify-center gap-2 border-t border-paper-line pt-5 lg:hidden">
			<ShareButtons title={name} variant="mobile" />
		</div>

		{#if topics.length > 0}
			<div class="mt-4 flex flex-wrap justify-center gap-1.5 lg:hidden">
				{#each topics as topic (topic)}
					<a
						href="/#blog"
						class="rounded-full border border-paper-line px-2.25 py-0.75 font-mono text-[0.625rem] tracking-[0.06em] text-ink-soft uppercase no-underline transition-colors hover:border-ink hover:bg-ink/4 hover:text-ink"
					>
						{topic}
					</a>
				{/each}
			</div>
		{/if}
	</div>
</header>
