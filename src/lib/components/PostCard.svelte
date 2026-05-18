<script lang="ts">
	interface Props {
		tag: string;
		date: string;
		datetime: string;
		title: string;
		blurb: string;
		href: string;
		index?: number;
	}

	let { tag, date, datetime, title, blurb, href, index = 0 }: Props = $props();
</script>

<article
	class="post-card relative flex flex-col overflow-hidden rounded-2xl border border-paper-line bg-white/40 transition-[transform,box-shadow,border-color] duration-350 hover:-translate-y-1.5 hover:border-ink hover:shadow-[0_1.5rem_3rem_-1.5rem_rgba(0,0,0,0.25)]"
	style="--i: {index}"
>
	<header class="flex flex-col">
		<div class="aspect-video overflow-hidden bg-ink"></div>
		<h3 class="px-5 pt-5 text-xl leading-tight font-semibold tracking-[-0.015em] text-ink">
			<a
				{href}
				class="text-inherit no-underline before:absolute before:inset-0 before:content-['']"
			>
				{title}
			</a>
		</h3>
	</header>

	<p class="mt-2.5 mb-0 flex-1 px-5 font-mono text-xs leading-[1.65] text-body">{blurb}</p>

	<footer class="mt-2.5 flex items-center gap-2 px-5 pb-6 font-mono text-[0.6875rem] text-muted">
		<span
			class="rounded-full bg-yellow/10 px-2 py-0.5 font-semibold tracking-[0.04em] text-yellow uppercase"
			>{tag}</span
		>
		<time {datetime} class="tracking-[0.04em]">{date}</time>
	</footer>
</article>

<style>
	@keyframes postIn {
		from {
			opacity: 0;
			transform: translateY(1rem);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}

	.post-card {
		opacity: 0;
		animation: postIn 0.6s cubic-bezier(0.2, 0.7, 0.2, 1) both;
		animation-delay: calc(var(--i, 0) * 80ms);
	}
</style>
