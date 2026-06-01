<script lang="ts">
	import { page } from '$app/state';
	import TwitterIcon from '$lib/components/svgs/icons/TwitterIcon.svelte';
	import LinkedInIcon from '$lib/components/svgs/icons/LinkedInIcon.svelte';
	import CopyIcon from '$lib/components/svgs/icons/CopyIcon.svelte';

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
		'flex w-full items-center gap-2.5 rounded-lg border border-paper-line bg-transparent px-3 py-2 text-left font-mono text-xs text-ink no-underline transition-colors hover:border-ink hover:bg-ink/4 hover:text-ink';
	const mobileCls =
		'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-paper-line bg-transparent px-3 py-1.5 font-mono text-[0.6875rem] text-ink no-underline transition-colors hover:border-ink hover:text-ink';

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
	<TwitterIcon class={iconCls} />
	Share on X
</a>

<a href={linkedInUrl} target="_blank" rel="noopener noreferrer" class={cls}>
	<LinkedInIcon class={iconCls} />
	LinkedIn
</a>

<button type="button" onclick={copy} class={cls}>
	<CopyIcon class={iconCls} />
	{copied ? 'Copied!' : 'Copy link'}
</button>
