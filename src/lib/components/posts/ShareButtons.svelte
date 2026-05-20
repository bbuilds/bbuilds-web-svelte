<script lang="ts">
	import { page } from '$app/state';

	interface Props {
		title: string;
		variant?: 'sidebar' | 'mobile';
	}

	let { title, variant = 'sidebar' }: Props = $props();

	let copied = $state(false);
	let copyTimer: ReturnType<typeof setTimeout> | undefined;

	const url = $derived(page.url.href);
	const tweetUrl = $derived(
		`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
	);
	const linkedInUrl = $derived(
		`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
	);

	const sidebarCls =
		'flex w-full items-center gap-2.5 rounded-lg border border-paper-line bg-transparent px-3 py-2 text-left font-mono text-xs text-charcoal no-underline transition-colors hover:border-charcoal hover:bg-black/[0.03] hover:text-ink';
	const mobileCls =
		'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-paper-line bg-transparent px-3 py-1.5 font-mono text-[0.6875rem] text-charcoal no-underline transition-colors hover:border-ink hover:text-ink';

	const cls = $derived(variant === 'mobile' ? mobileCls : sidebarCls);
	const iconCls = $derived(
		variant === 'mobile' ? 'h-3.5 w-3.5 flex-shrink-0' : 'h-[0.9375rem] w-[0.9375rem] flex-shrink-0'
	);

	const copy = async () => {
		try {
			await navigator.clipboard.writeText(url);
		} catch {
			/* ignore */
		}
		copied = true;
		clearTimeout(copyTimer);
		copyTimer = setTimeout(() => {
			copied = false;
		}, 2000);
	};

	$effect(() => {
		return () => clearTimeout(copyTimer);
	});
</script>

<a href={tweetUrl} target="_blank" rel="noopener noreferrer" class={cls}>
	<svg viewBox="0 0 24 24" fill="currentColor" class={iconCls} aria-hidden="true">
		<path
			d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.906-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"
		/>
	</svg>
	Share on X
</a>

<a href={linkedInUrl} target="_blank" rel="noopener noreferrer" class={cls}>
	<svg viewBox="0 0 24 24" fill="currentColor" class={iconCls} aria-hidden="true">
		<path
			d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
		/>
	</svg>
	LinkedIn
</a>

<button type="button" onclick={copy} class={cls}>
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		class={iconCls}
		aria-hidden="true"
	>
		<rect width="14" height="14" x="8" y="8" rx="2" />
		<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
	</svg>
	{copied ? 'Copied!' : 'Copy link'}
</button>
