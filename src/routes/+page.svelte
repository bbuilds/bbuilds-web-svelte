<script lang="ts">
	import Hero from '$lib/components/home/Hero.svelte';
	import Services from '$lib/components/home/Services.svelte';
	import Process from '$lib/components/home/Process.svelte';
	import Quote from '$lib/components/home/Quote.svelte';
	import Blog from '$lib/components/home/Blog.svelte';

	let { data } = $props();
	const content = $derived(data.story?.content);
</script>

<Hero {content} />
<Services {content} />
<Process {content} />
<Quote />
<Blog {content} posts={data.posts} />
