<script lang="ts">
	interface Props {
		class?: string;
	}
	let { class: className = '' }: Props = $props();
</script>

<svg viewBox="0 0 100 160" class={className} aria-hidden="true">
	<path
		d="M50 155 C 50 130, 52 100, 50 70 C 49 50, 50 30, 50 12"
		stroke="var(--ink)"
		stroke-width="1.8"
		fill="none"
		stroke-linecap="round"
	/>
	<path
		d="M50 95 C 32 92, 18 76, 16 50 C 32 56, 46 74, 50 95 Z"
		fill="var(--green)"
		stroke="var(--ink)"
		stroke-width="1.3"
		stroke-linejoin="round"
	/>
	<path
		d="M50 95 C 38 88, 28 74, 22 60"
		stroke="var(--ink)"
		stroke-width="0.6"
		fill="none"
		opacity="0.5"
	/>
	<path
		d="M50 65 C 68 62, 82 46, 84 20 C 68 26, 54 44, 50 65 Z"
		fill="var(--green)"
		stroke="var(--ink)"
		stroke-width="1.3"
		stroke-linejoin="round"
	/>
	<path
		d="M50 65 C 62 58, 72 44, 78 30"
		stroke="var(--ink)"
		stroke-width="0.6"
		fill="none"
		opacity="0.5"
	/>
	<path
		d="M50 40 C 42 30, 42 18, 50 8 C 58 18, 58 30, 50 40 Z"
		fill="var(--green)"
		stroke="var(--ink)"
		stroke-width="1.3"
		stroke-linejoin="round"
	/>
</svg>
