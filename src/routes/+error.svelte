<script lang="ts">
	import { page } from '$app/state';
	import { SITE_NAME } from '$lib/config/site';
	import Button from '$lib/components/Button.svelte';
	import ErrorTerminal from '$lib/components/error/ErrorTerminal.svelte';
	import FallingLeaves from '$lib/components/svgs/illustrations/FallingLeaves.svelte';

	const statusStr = $derived(String(page.status));

	const copy = $derived(
		page.status === 404
			? {
					eyebrow: 'Error · route not found',
					headlinePre: 'page not ',
					headlineHighlight: 'found',
					headlinePost: '.',
					lead: 'You’ve hit a dead end. Most likely a moved page, an outdated bookmark, or a typo. You can click below to get back to solid ground, or just enjoy the falling leaves.',
					title: `404 — this page didn't compile · ${SITE_NAME}`
				}
			: {
					eyebrow: 'Error · something broke',
					headlinePre: "Something didn't ",
					headlineHighlight: 'compile',
					headlinePost: '.',
					lead: "Something broke on our end. It's not you — the server hit an unexpected error. Try again in a moment or head back home.",
					title: `${page.status} — something broke · ${SITE_NAME}`
				}
	);
</script>

<svelte:head>
	<title>{copy.title}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section
	class="relative flex flex-1 items-center overflow-hidden pt-14 pb-20 max-[47.9375rem]:pt-8"
>
	<FallingLeaves />
	<div class="z-2 container">
		<div class="grid items-center gap-12 min-[60rem]:grid-cols-[1.05fr_0.95fr] min-[60rem]:gap-16">
			<!-- left column -->
			<div>
				<div
					class="meta-dot mb-6 inline-flex items-center gap-2 font-mono text-[0.8125rem] tracking-[0.06em] text-muted uppercase"
				>
					{copy.eyebrow}
				</div>

				<div
					class="flex items-start font-sans text-[clamp(6rem,18vw,12rem)] leading-[0.86] font-bold tracking-[-0.04em]"
					aria-label={statusStr}
				>
					{statusStr}
				</div>

				<h1
					class="mt-7 max-w-[22ch] text-[clamp(1.6rem,3.4vw,2.6rem)] leading-[1.05] font-semibold tracking-[-0.02em]"
				>
					{copy.headlinePre}<span class="scribble"
						>{copy.headlineHighlight}<svg
							viewBox="0 0 360 18"
							preserveAspectRatio="none"
							aria-hidden="true"
							><path
								d="M2 12 Q 60 -2, 120 8 T 240 8 T 358 10"
								stroke="var(--yellow)"
								stroke-width="3"
								fill="none"
								stroke-linecap="round"
							/></svg
						></span
					>{copy.headlinePost}
				</h1>

				<p class="mt-6 max-w-136 font-mono text-sm leading-[1.7] text-body">{copy.lead}</p>

				{#if page.status !== 404 && page.error?.errorId}
					<p class="mt-3 font-mono text-xs text-muted">
						ref: <code
							class="rounded-[0.3rem] bg-[color:var(--yellow-14)] px-[0.4rem] py-[0.05rem] text-[0.95em] text-yellow"
							>{page.error.errorId}</code
						>
					</p>
				{/if}

				<div class="mt-9 flex flex-wrap gap-3.5">
					<Button href="/" variant="primary">home</Button>
					<Button href="/blog" variant="ghost">browse the blog</Button>
				</div>
			</div>

			<!-- right column: terminal -->
			<div class="pb-8">
				<ErrorTerminal path={page.url.pathname} status={page.status} />
			</div>
		</div>
	</div>
</section>

<style>
	.meta-dot::before {
		content: '●';
		color: var(--yellow);
		margin-right: 0.5rem;
	}
</style>
