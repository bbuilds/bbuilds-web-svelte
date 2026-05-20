<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import Services from '$lib/components/Services.svelte';
	import Process from '$lib/components/Process.svelte';
	import Quote from '$lib/components/Quote.svelte';
	import Blog from '$lib/components/Blog.svelte';
	import Contact from '$lib/components/Contact.svelte';

	let { data } = $props();
	const content = $derived(data.story?.content);
</script>

<Hero {content} />
<Services {content} />
<Process {content} />
<Quote />
<Blog {content} posts={data.posts} />
<Contact />
