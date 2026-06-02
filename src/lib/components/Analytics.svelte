<script lang="ts">
	let { gaId }: { gaId?: string } = $props();

	$effect(() => {
		if (!gaId) return;
		window.dataLayer = window.dataLayer || [];
		const gtag: Gtag.Gtag = function () {
			window.dataLayer.push(arguments);
		};
		gtag('js', new Date());
		gtag('config', gaId);
	});
</script>

<svelte:head>
	{#if gaId}
		<script async src="https://www.googletagmanager.com/gtag/js?id={gaId}"></script>
	{/if}
</svelte:head>
