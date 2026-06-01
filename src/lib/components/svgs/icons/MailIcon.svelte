<script lang="ts">
	interface Props {
		class?: string;
	}
	let { class: className = 'h-5 w-5' }: Props = $props();
</script>

<svg
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="2"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
	class={className}
>
	<path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
	<rect x="2" y="4" width="20" height="16" rx="2" />
</svg>
