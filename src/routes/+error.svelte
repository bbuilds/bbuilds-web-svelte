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
	class="flex flex-1 relative overflow-hidden items-center pt-14 pb-20 max-[47.9375rem]:pt-8"
>
	<FallingLeaves />
	<div class="container z-2">
		<div class="grid gap-12 items-center min-[60rem]:grid-cols-[1.05fr_0.95fr] min-[60rem]:gap-16">
			<!-- left column -->
			<div>
				<div
					class="inline-flex items-center gap-2 mb-6 font-mono text-[0.8125rem] tracking-[0.06em] uppercase text-muted meta-dot"
				>
					{copy.eyebrow}
				</div>

				<div
					class="font-sans font-bold tracking-[-0.04em] leading-[0.86] text-[clamp(6rem,18vw,12rem)] flex items-start"
					aria-label={statusStr}
				>
					{statusStr}
				</div>

				<h1
					class="text-[clamp(1.6rem,3.4vw,2.6rem)] font-semibold tracking-[-0.02em] leading-[1.05] mt-7 max-w-[22ch]"
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

				<p class="mt-6 max-w-136 font-mono text-sm text-body leading-[1.7]">{copy.lead}</p>

				{#if page.status !== 404 && page.error?.errorId}
					<p class="mt-3 font-mono text-xs text-muted">
						ref: <code
							class="bg-[color:var(--yellow-14)] text-yellow py-[0.05rem] px-[0.4rem] rounded-[0.3rem] text-[0.95em]"
							>{page.error.errorId}</code
						>
					</p>
				{/if}

				<div class="flex flex-wrap gap-3.5 mt-9">
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
