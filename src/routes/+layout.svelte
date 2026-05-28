<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.ico';
	import { page } from '$app/state';
	import SEO from '$lib/components/SEO.svelte';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import BottomNav from '$lib/components/BottomNav.svelte';
	import Contact from '$lib/components/Contact.svelte';
	import ContactModal from '$lib/components/ContactModal.svelte';
	let { children, data } = $props();
</script>

<SEO seo={page.data.seo} />
<svelte:head>
	<link rel="icon" href={favicon} />
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
<ContactModal />
<Footer />
<BottomNav />
