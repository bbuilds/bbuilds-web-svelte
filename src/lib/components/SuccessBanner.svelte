<script lang="ts">
	import { banner } from '$lib/state/banner.svelte';
	import CloseIcon from '$lib/components/svgs/icons/CloseIcon.svelte';
	import Sprout from '$lib/components/svgs/illustrations/Sprout.svelte';

	$effect(() => {
		if (!banner.visible) return;

		const timer = setTimeout(() => {
			banner.dismiss();
		}, 5200);

		return () => {
			clearTimeout(timer);
		};
	});

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && banner.visible) {
			banner.dismiss();
		}
	}
</script>

<svelte:document onkeydown={onKeydown} />

<div
	role="status"
	aria-live="polite"
	aria-atomic="true"
	class={[
		'toast pointer-events-none fixed left-0 right-0 top-0 z-80 flex justify-center',
		{ visible: banner.visible }
	]}
>
	<div
		class="toast-inner pointer-events-auto w-full border-b border-[#14210f]/20 bg-green text-[#14210f]"
	>
		<div class="mx-auto flex w-[min(100%-3rem,85rem)] items-center gap-4 px-5 py-[0.85rem]">
			<span class="badge flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-paper">
				<Sprout class="w-6" />
			</span>

			<div class="min-w-0 flex-1">
				{#if banner.eyebrow}
					<p class="font-mono text-[0.9rem] font-bold tracking-[-0.01em]">{banner.eyebrow}</p>
				{/if}
				<p class="mt-[0.1rem] font-mono text-[0.8rem] leading-[1.4] text-[#243a18]">
					{banner.message}
				</p>
			</div>

			<button
				type="button"
				aria-label="Dismiss"
				onclick={() => banner.dismiss()}
				class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-ink bg-paper p-1.5 text-ink transition-colors hover:bg-white"
			>
				<CloseIcon />
			</button>
		</div>
	</div>
</div>

<style>
	.toast-inner {
		box-shadow: 0 0.875rem 2.5rem -1rem rgba(0, 0, 0, 0.45);
		transform: translateY(-110%);
		transition: transform 0.42s cubic-bezier(0.22, 1.2, 0.4, 1);
	}

	.toast.visible .toast-inner {
		transform: translateY(0);
	}

	.badge {
		box-shadow: inset 0 0 0 0.0625rem rgba(20, 33, 15, 0.12);
	}

	@media (prefers-reduced-motion: reduce) {
		.toast-inner {
			transition: none;
		}
	}
</style>
