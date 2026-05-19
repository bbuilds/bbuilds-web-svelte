<script lang="ts">
	import ShareButtons from './ShareButtons.svelte';

	interface Props {
		name: string;
		kicker: string;
		dateDisplay: string;
		datetime: string;
		readTime: string;
		topics: string[];
	}

	let { name, kicker, dateDisplay, datetime, readTime, topics }: Props = $props();
</script>

<header class="paper-bg relative border-b border-paper-line pt-14 pb-11">
	<div class="container">
		<nav
			class="mb-7 flex flex-wrap items-center gap-2 font-mono text-[0.6875rem] tracking-[0.06em] text-muted uppercase"
			aria-label="Breadcrumb"
		>
			<a href="/" class="no-underline transition-colors hover:text-ink">Home</a>
			<span class="opacity-35">›</span>
			<a href="/#blog" class="no-underline transition-colors hover:text-ink">Blog</a>
			<span class="opacity-35">›</span>
			<span class="text-charcoal">{name}</span>
		</nav>

		<div class="mb-4 flex flex-wrap items-center gap-2.5">
			<span
				class="rounded-full bg-yellow/10 px-2.5 py-1 font-mono text-[0.6875rem] font-semibold tracking-[0.06em] text-yellow uppercase"
			>
				{kicker}
			</span>
			<span class="text-[0.3125rem] text-muted opacity-50">●</span>
			<time {datetime} class="font-mono text-xs tracking-[0.03em] text-muted">{dateDisplay}</time>
			<span class="text-[0.3125rem] text-muted opacity-50">●</span>
			<span class="font-mono text-xs tracking-[0.03em] text-muted">{readTime}</span>
		</div>

		<h1
			class="mt-2.5 max-w-[34rem] text-[clamp(2rem,5vw,3.75rem)] leading-[1.06] font-bold tracking-[-0.03em] text-ink"
		>
			{name}
		</h1>

		{#if topics.length > 0}
			<div class="mt-5 flex flex-wrap gap-1.5">
				{#each topics as topic (topic)}
					<span
						class="rounded-full border border-paper-line px-2.5 py-0.5 font-mono text-[0.625rem] tracking-[0.06em] text-charcoal uppercase transition-colors hover:border-charcoal hover:text-ink"
					>
						{topic}
					</span>
				{/each}
			</div>
		{/if}

		<div class="mt-6 flex flex-wrap gap-2 border-t border-paper-line pt-5 lg:hidden">
			<ShareButtons title={name} variant="mobile" />
		</div>
	</div>
</header>
