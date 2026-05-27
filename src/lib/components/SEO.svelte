<script lang="ts">
	import type { ResolvedSEO } from '$lib/utils/seo';
	import { SITE_NAME, DEFAULT_OG_LOCALE } from '$lib/config/site';

	let { seo }: { seo: ResolvedSEO } = $props();

	function jsonLdScript(item: object): string {
		const json = JSON.stringify(item).replace(/<\//g, '<\\/');
		return '<script type="application/ld+json">' + json + '</' + 'script>';
	}
</script>

<svelte:head>
	<title>{seo.title}</title>
	{#if seo.description}
		<meta name="description" content={seo.description} />
	{/if}
	<link rel="canonical" href={seo.canonical} />
	{#if seo.noIndex || seo.noFollow}
		<meta
			name="robots"
			content="{seo.noIndex ? 'noindex' : 'index'},{seo.noFollow ? 'nofollow' : 'follow'}"
		/>
	{/if}

	<meta property="og:title" content={seo.ogTitle} />
	{#if seo.description}
		<meta property="og:description" content={seo.description} />
	{/if}
	<meta property="og:url" content={seo.ogUrl} />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:locale" content={DEFAULT_OG_LOCALE} />
	{#if seo.ogImage}
		<meta property="og:image" content={seo.ogImage.url} />
		{#if seo.ogImage.width}
			<meta property="og:image:width" content={String(seo.ogImage.width)} />
		{/if}
		{#if seo.ogImage.height}
			<meta property="og:image:height" content={String(seo.ogImage.height)} />
		{/if}
		{#if seo.ogImage.alt}
			<meta property="og:image:alt" content={seo.ogImage.alt} />
		{/if}
	{/if}

	{#each seo.jsonLd as item, i (i)}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html jsonLdScript(item)}
	{/each}
</svelte:head>
