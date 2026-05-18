<script lang="ts">
	import Button from '$lib/components/Button.svelte';

	const POSTS = [
		{
			tag: 'SEO',
			date: 'Feb 11, 2022',
			title: 'Local SEO Guide: Google Business Profile',
			blurb:
				"Google Business Profile is arguably the most important tool for a business looking to geotarget an area. Here's a guide to getting GBP set up.",
			href: '#'
		},
		{
			tag: 'Performance',
			date: 'Jan 16, 2022',
			title: 'Detecting Memory Leaks in Web Apps',
			blurb:
				'Recently came across a tool to detect memory leaks in your web apps. Notes from running it across a couple production codebases.',
			href: '#'
		},
		{
			tag: 'Talks',
			date: 'Oct 14, 2021',
			title: 'Headless WP & Gatsby at Seattle WP Meetup',
			blurb:
				'Presented at Seattle WP Developers Meetup on my recent headless WordPress rebuild of my digital-nomad blog. Slides + takeaways.',
			href: '#'
		}
	] as const;
</script>

<section id="blog" class="paper-bg relative pt-18 pb-20">
	<div class="container">
		<header class="mb-12 flex flex-wrap items-end justify-between gap-8">
			<div>
				<div
					class="font-mono text-sm tracking-wider text-muted uppercase before:mr-2 before:text-yellow before:content-['●']"
				>
					// 05.writing
				</div>
				<h2 class="mt-2">
					Recent <span class="scribble">
						posts
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
					</span>.
				</h2>
				<p class="mt-3.5 max-w-128 font-mono text-[0.8125rem] leading-[1.7] text-charcoal">
					Field notes, deep dives, and the occasional unhinged opinion. Written between projects.
				</p>
			</div>
			<Button href="#" variant="primary">view all posts →</Button>
		</header>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each POSTS as p, i (p.title)}
				<a
					href={p.href}
					class="post-card group flex flex-col overflow-hidden rounded-2xl border border-paper-line bg-white/40 text-inherit no-underline transition-[transform,box-shadow,border-color] duration-350 hover:-translate-y-1.5 hover:border-ink hover:shadow-[0_1.5rem_3rem_-1.5rem_rgba(0,0,0,0.25)]"
					style="--i: {i}"
				>
					<div class="aspect-[16/9] overflow-hidden bg-ink"></div>
					<div class="flex flex-1 flex-col gap-2.5 px-5 pt-5 pb-6">
						<div class="flex items-center gap-2 font-mono text-[0.6875rem] text-muted">
							<span
								class="rounded-full bg-yellow/10 px-2 py-0.5 font-semibold tracking-[0.04em] text-yellow uppercase"
								>{p.tag}</span
							>
							<span class="tracking-[0.04em]">{p.date}</span>
						</div>
						<h3 class="text-xl leading-tight font-semibold tracking-[-0.015em] text-ink">
							{p.title}
						</h3>
						<p class="m-0 flex-1 font-mono text-xs leading-[1.65] text-body">{p.blurb}</p>
						<span
							class="mt-1.5 inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-ink"
						>
							read post
							<span class="transition-transform duration-250 group-hover:translate-x-1">→</span>
						</span>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>

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
