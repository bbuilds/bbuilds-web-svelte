<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		text?: string;
		prefix?: boolean;
		tone?: 'light' | 'dark';
		class?: string;
		children?: Snippet;
	}
	let { text, prefix = false, tone = 'light', class: className = '', children }: Props = $props();

	const color = $derived(tone === 'dark' ? 'text-muted-dark' : 'text-muted');
	const label = $derived(text ? (prefix ? `// ${text}` : text) : undefined);
</script>

<div
	class={[
		"font-mono uppercase tracking-wider before:mr-2 before:text-yellow before:content-['●']",
		color,
		className
	]}
>
	{#if children}
		{@render children()}
	{:else}
		{label}
	{/if}
</div>
