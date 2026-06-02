<script lang="ts">
	let { gaId }: { gaId?: string } = $props();
</script>

<svelte:head>
	{#if gaId}
		<script async src="https://www.googletagmanager.com/gtag/js?id={gaId}"></script>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- gaId is a trusted build-time env var, not user input -->
		{@html `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');</script>`}
	{/if}
</svelte:head>
