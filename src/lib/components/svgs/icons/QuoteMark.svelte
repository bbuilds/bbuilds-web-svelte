<script lang="ts">
	interface Props {
		class?: string;
	}
	let { class: className = 'h-11 w-11' }: Props = $props();
</script>

<svg class={className} viewBox="0 0 60 60" aria-hidden="true">
	<path
		d="M 14 44 C 6 38, 6 26, 12 18 C 18 12, 26 10, 32 12 L 30 18 C 24 18, 18 22, 16 28 C 22 27, 28 32, 28 38 C 28 44, 22 48, 14 44 Z M 38 44 C 30 38, 30 26, 36 18 C 42 12, 50 10, 56 12 L 54 18 C 48 18, 42 22, 40 28 C 46 27, 52 32, 52 38 C 52 44, 46 48, 38 44 Z"
		fill="none"
		stroke="var(--color-ink)"
		stroke-width="1.4"
		stroke-linejoin="round"
		opacity="0.45"
	/>
</svg>
