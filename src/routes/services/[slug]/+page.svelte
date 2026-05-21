<script lang="ts">
	import type { PageData } from './$types';
	import ServiceHero from '$lib/components/services/ServiceHero.svelte';
	import Pillars from '$lib/components/services/Pillars.svelte';
	import OtherServices from '$lib/components/services/OtherServices.svelte';
	import Contact from '$lib/components/Contact.svelte';

	let { data }: { data: PageData } = $props();
	const service = $derived(data.service);
</script>

<svelte:head>
	<title>{service.title} — Branden Builds</title>
	<meta name="description" content={service.lead.map((s) => s.text).join('')} />
</svelte:head>

<ServiceHero {service} />
<Pillars head={service.pillarsHead} items={service.pillars} />
<OtherServices currentSlug={service.slug} />
<Contact />
