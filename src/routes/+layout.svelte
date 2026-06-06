<script lang="ts">
	import './layout.css';
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
<a class="skip-link" href="#main-content">Skip to content</a>
<Header />
<main id="main-content" tabindex="-1">
	{@render children()}
</main>
<Contact content={data.globals?.content} />
<ContactModal content={data.globals?.content?.contact_modal?.[0]} />
<SuccessBanner />
<Footer />
<BottomNav />
