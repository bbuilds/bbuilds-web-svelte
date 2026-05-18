<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import PostCard from '$lib/components/PostCard.svelte';

	const POSTS = [
		{
			tag: 'SEO',
			datetime: '2022-02-11',
			date: 'Feb 11, 2022',
			title: 'Local SEO Guide: Google Business Profile',
			blurb:
				"Google Business Profile is arguably the most important tool for a business looking to geotarget an area. Here's a guide to getting GBP set up.",
			href: '#'
		},
		{
			tag: 'Performance',
			datetime: '2022-01-16',
			date: 'Jan 16, 2022',
			title: 'Detecting Memory Leaks in Web Apps',
			blurb:
				'Recently came across a tool to detect memory leaks in your web apps. Notes from running it across a couple production codebases.',
			href: '#'
		},
		{
			tag: 'Talks',
			datetime: '2021-10-14',
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
				<p class="mt-3.5 max-w-lg font-mono text-[0.8125rem] leading-[1.7] text-charcoal">
					Field notes, deep dives, and the occasional unhinged opinion. Written between projects.
				</p>
			</div>
			<Button href="#" variant="primary">view all posts →</Button>
		</header>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each POSTS as p, i (p.title)}
				<PostCard {...p} index={i} />
			{/each}
		</div>
	</div>
</section>
