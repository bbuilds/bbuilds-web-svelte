<script lang="ts">
	import Icon from './Icon.svelte';
	interface Props {
		class?: string;
	}
	let { class: className = 'h-5 w-5' }: Props = $props();
</script>

<Icon class={className}>
	<path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
	<rect x="2" y="4" width="20" height="16" rx="2" />
</Icon>
