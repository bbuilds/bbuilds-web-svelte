<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import Services from '$lib/components/Services.svelte';
	import Process from '$lib/components/Process.svelte';
	import type { StoryblokHomePage } from '$lib/types/storyblok';

	let { data } = $props();
	const content = $derived(data.story?.content as StoryblokHomePage | undefined);
</script>

<Hero {content} />
<Services {content} />
<Process />
