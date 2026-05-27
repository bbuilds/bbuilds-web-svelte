<script lang="ts">
	import Architecture from './illustrations/Architecture.svelte';
	import Engineering from './illustrations/Engineering.svelte';
	import Intelligence from './illustrations/Intelligence.svelte';
	import Identity from './illustrations/Identity.svelte';
	import Continuity from './illustrations/Continuity.svelte';

	interface Props {
		slug: string;
		pillarId: string | undefined;
	}

	let { slug, pillarId }: Props = $props();
</script>

{#if slug === 'architecture'}
	<Architecture {pillarId} />
{:else if slug === 'engineering'}
	<Engineering {pillarId} />
{:else if slug === 'intelligence'}
	<Intelligence {pillarId} />
{:else if slug === 'storytelling'}
	<Identity {pillarId} />
{:else if slug === 'promotion'}
	<Continuity {pillarId} />
{:else}
	<div class="aspect-6/5 w-full bg-ink"></div>
{/if}
