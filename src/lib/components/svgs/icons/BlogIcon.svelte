<script lang="ts">
	import Icon from './Icon.svelte';
	interface Props {
		class?: string;
	}
	let { class: className = 'h-5 w-5' }: Props = $props();
</script>

<Icon class={className}>
	<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
	<path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
</Icon>
