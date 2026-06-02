<script lang="ts">
	let scrollY = $state(0);
	let innerHeight = $state(0);

	const progress = $derived.by(() => {
		const doc = document.documentElement;
		const max = Math.max(document.body.scrollHeight, doc.scrollHeight) - innerHeight;
		return max > 0 ? Math.min(scrollY / max, 1) : 0;
	});
</script>

<svelte:window bind:scrollY bind:innerHeight />

<div
	class="pointer-events-none fixed top-0 right-0 left-0 z-200 h-0.75 bg-transparent"
	aria-hidden="true"
>
	<div
		class="h-full origin-left bg-linear-to-r from-yellow to-pale-fire will-change-transform"
		style:transform="scaleX({progress})"
	></div>
</div>
