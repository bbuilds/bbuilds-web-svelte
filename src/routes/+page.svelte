<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import Services from '$lib/components/Services.svelte';
	import Process from '$lib/components/Process.svelte';

	let { data } = $props();
	$effect(() => console.log(data.story));
</script>

<Hero />
<Services />
<Process />
