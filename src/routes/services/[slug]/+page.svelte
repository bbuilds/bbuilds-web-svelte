<script lang="ts">
	import type { PageData } from './$types';
	import ServiceHero from '$lib/components/services/ServiceHero.svelte';
	import Pillars from '$lib/components/services/Pillars.svelte';
	import OtherServices from '$lib/components/services/OtherServices.svelte';
	import Contact from '$lib/components/Contact.svelte';

	let { data }: { data: PageData } = $props();

	const content = $derived(data.story.content);
	const hero = $derived(content.hero?.[0]);
</script>

<ServiceHero slug={data.slug} {hero} />
<Pillars slug={data.slug} {content} />
<OtherServices currentSlug={data.slug} liveSlugs={data.liveSlugs} />
<Contact />
