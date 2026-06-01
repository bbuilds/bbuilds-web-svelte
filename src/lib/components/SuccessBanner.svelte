<script lang="ts">
	import { banner } from '$lib/state/banner.svelte';

	$effect(() => {
		if (!banner.visible) return;

		const timer = setTimeout(() => {
			banner.dismiss();
		}, 5200);

		return () => {
			clearTimeout(timer);
		};
	});

	$effect(() => {
		function onKeydown(e: KeyboardEvent) {
			if (e.key === 'Escape' && banner.visible) {
				banner.dismiss();
			}
		}

		document.addEventListener('keydown', onKeydown);

		return () => {
			document.removeEventListener('keydown', onKeydown);
		};
	});
</script>

<div
	role="status"
	aria-live="polite"
	aria-atomic="true"
	class="toast pointer-events-none fixed left-0 right-0 top-0 z-80 flex justify-center"
	class:visible={banner.visible}
>
	<div
		class="toast-inner pointer-events-auto w-full border-b border-[#14210f]/20 bg-green text-[#14210f]"
	>
		<div class="mx-auto flex w-[min(100%-3rem,85rem)] items-center gap-4 px-5 py-[0.85rem]">
			<span class="badge flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-paper">
				<svg viewBox="0 0 100 160" class="w-6" aria-hidden="true">
					<path
						d="M50 155 C 50 130, 52 100, 50 70 C 49 50, 50 30, 50 12"
						stroke="#1a1a1a"
						stroke-width="1.8"
						fill="none"
						stroke-linecap="round"
					/>
					<path
						d="M50 95 C 32 92, 18 76, 16 50 C 32 56, 46 74, 50 95 Z"
						fill="#7ba87b"
						stroke="#1a1a1a"
						stroke-width="1.3"
						stroke-linejoin="round"
					/>
					<path
						d="M50 95 C 38 88, 28 74, 22 60"
						stroke="#1a1a1a"
						stroke-width="0.6"
						fill="none"
						opacity="0.5"
					/>
					<path
						d="M50 65 C 68 62, 82 46, 84 20 C 68 26, 54 44, 50 65 Z"
						fill="#7ba87b"
						stroke="#1a1a1a"
						stroke-width="1.3"
						stroke-linejoin="round"
					/>
					<path
						d="M50 65 C 62 58, 72 44, 78 30"
						stroke="#1a1a1a"
						stroke-width="0.6"
						fill="none"
						opacity="0.5"
					/>
					<path
						d="M50 40 C 42 30, 42 18, 50 8 C 58 18, 58 30, 50 40 Z"
						fill="#7ba87b"
						stroke="#1a1a1a"
						stroke-width="1.3"
						stroke-linejoin="round"
					/>
				</svg>
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
				onclick={banner.dismiss}
				class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-ink bg-paper p-1.5 text-ink transition-colors hover:bg-white"
			>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
					class="h-4 w-4"
				>
					<line x1="18" y1="6" x2="6" y2="18" />
					<line x1="6" y1="6" x2="18" y2="18" />
				</svg>
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
