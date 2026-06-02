<script lang="ts">
	import Icon from './Icon.svelte';
	interface Props {
		class?: string;
	}
	let { class: className = '' }: Props = $props();
</script>

<Icon class={className}>
	<rect width="14" height="14" x="8" y="8" rx="2" />
	<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
</Icon>
