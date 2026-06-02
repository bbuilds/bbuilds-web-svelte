<script lang="ts">
	import Icon from './Icon.svelte';
	interface Props {
		class?: string;
	}
	let { class: className = 'h-4 w-4' }: Props = $props();
</script>

<Icon class={className}>
	<line x1="18" y1="6" x2="6" y2="18" />
	<line x1="6" y1="6" x2="18" y2="18" />
</Icon>
