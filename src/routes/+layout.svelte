<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.ico';
	import faviconPng from '$lib/assets/favicon.png';
	import { page } from '$app/state';
	import SEO from '$lib/components/SEO.svelte';
	import Analytics from '$lib/components/Analytics.svelte';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import BottomNav from '$lib/components/BottomNav.svelte';
	import Contact from '$lib/components/Contact.svelte';
	import ContactModal from '$lib/components/ContactModal.svelte';
	import SuccessBanner from '$lib/components/SuccessBanner.svelte';
	let { children, data } = $props();
</script>

{#if !page.error}
	<SEO seo={page.data.seo} />
{/if}
<Analytics gaId={import.meta.env.VITE_GA_ID || undefined} />
<svelte:head>
	<link rel="icon" type="image/x-icon" href={favicon} />
	<link rel="icon" type="image/png" href={faviconPng} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
	<link
		href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800&family=JetBrains+Mono:ital,wght@0,400;0,500;0,700;1,400&family=Caveat:wght@500;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<Header />
{@render children()}
<Contact content={data.globals?.content} />
<ContactModal content={data.globals?.content?.contact_modal?.[0]} />
<SuccessBanner />
<Footer />
<BottomNav />
