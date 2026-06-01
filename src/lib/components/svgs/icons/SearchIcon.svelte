<script lang="ts">
	interface Props {
		class?: string;
	}
	let { class: className = 'h-4 w-4' }: Props = $props();
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
	<circle cx="11" cy="11" r="8" />
	<path d="m21 21-4.35-4.35" />
</svg>
