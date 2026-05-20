<script lang="ts">
	let progress = $state(0);

	$effect(() => {
		const update = () => {
			const doc = document.documentElement;
			const max = Math.max(document.body.scrollHeight, doc.scrollHeight) - window.innerHeight;
			progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
		};
		update();
		window.addEventListener('scroll', update, { passive: true });
		window.addEventListener('resize', update, { passive: true });
		return () => {
			window.removeEventListener('scroll', update);
			window.removeEventListener('resize', update);
		};
	});
</script>

<div
	class="pointer-events-none fixed top-0 right-0 left-0 z-[200] h-[0.1875rem] bg-transparent"
	aria-hidden="true"
>
	<div
		class="h-full origin-left bg-gradient-to-r from-yellow to-[#ffcd67] will-change-transform"
		style:transform="scaleX({progress})"
	></div>
</div>
