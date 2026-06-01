<script lang="ts">
	interface Props {
		variant?: 'thin' | 'thick';
		color?: string;
	}

	let { variant = 'thin', color = 'var(--yellow)' }: Props = $props();
</script>

{#if variant === 'thin'}
	<svg viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden="true">
		<path
			d="M2 9 C 40 2, 80 12, 120 6 S 180 10, 198 5"
			stroke={color}
			stroke-width="4"
			fill="none"
			stroke-linecap="round"
			opacity="0.9"
		/>
	</svg>
{:else}
	<svg viewBox="0 0 200 22" preserveAspectRatio="none" aria-hidden="true">
		<path
			d="M2 14 C 40 4, 80 20, 120 10 S 180 16, 198 8"
			stroke={color}
			stroke-width="8"
			fill="none"
			stroke-linecap="round"
		/>
	</svg>
{/if}
