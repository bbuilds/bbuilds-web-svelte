<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string;
		viewBox?: string;
		children: Snippet;
	}
	let { class: className = '', viewBox = '0 0 24 24', children }: Props = $props();
</script>

<svg
	{viewBox}
	fill="none"
	stroke="currentColor"
	stroke-width="2"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
	class={className}
>
	{@render children()}
</svg>
