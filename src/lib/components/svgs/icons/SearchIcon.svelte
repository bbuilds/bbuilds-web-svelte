<script lang="ts">
	import Icon from './Icon.svelte';
	interface Props {
		class?: string;
	}
	let { class: className = 'h-4 w-4' }: Props = $props();
</script>

<Icon class={className}>
	<circle cx="11" cy="11" r="8" />
	<path d="m21 21-4.35-4.35" />
</Icon>
