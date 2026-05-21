<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	let dialog = $state<HTMLDialogElement | undefined>(undefined);
	const isOpen = $derived(page.url.hash === '#contact-modal');

	$effect(() => {
		if (!dialog) return;
		if (isOpen && !dialog.open) dialog.showModal();
		else if (!isOpen && dialog.open) dialog.close();
	});

	$effect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
			return () => {
				document.body.style.overflow = '';
			};
		}
	});

	function close() {
		dialog?.close();
	}

	function onDialogClose() {
		if (page.url.hash !== '#contact-modal') return;
		goto(page.url.pathname + page.url.search, {
			replaceState: true,
			noScroll: true,
			keepFocus: true
		});
	}

	function onBackdropClick(e: MouseEvent) {
		if (e.target === dialog) close();
	}
</script>

<dialog
	bind:this={dialog}
	onclose={onDialogClose}
	onclick={onBackdropClick}
	class="fixed inset-0 m-auto h-fit max-h-[calc(100dvh-2rem)] w-full max-w-125 rounded-xl border-none bg-transparent p-0"
>
	<div class="rounded-xl border border-black/[0.07] bg-paper p-6">
		<div class="mb-5 flex items-center justify-between">
			<h2 class="font-mono text-base font-bold tracking-tight text-ink">Contact</h2>
			<button
				type="button"
				aria-label="Close"
				onclick={close}
				class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-black/[0.07] bg-transparent p-1.5 text-ink transition-colors hover:bg-black/5"
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

		<form onsubmit={(e) => e.preventDefault()} class="flex flex-col gap-4">
			<div class="flex flex-col gap-1.5">
				<label for="contact-name" class="font-mono text-sm text-muted">Name</label>
				<input
					id="contact-name"
					name="name"
					type="text"
					placeholder="Your name"
					autocomplete="name"
					class="w-full rounded-lg border border-black/10 bg-paper px-3 py-2.5 text-sm leading-normal text-ink transition-colors placeholder:text-muted focus:border-ink focus:outline-none"
				/>
			</div>
			<div class="flex flex-col gap-1.5">
				<label for="contact-email" class="font-mono text-sm text-muted">Email</label>
				<input
					id="contact-email"
					name="email"
					type="email"
					placeholder="you@example.com"
					autocomplete="email"
					class="w-full rounded-lg border border-black/10 bg-paper px-3 py-2.5 text-sm leading-normal text-ink transition-colors placeholder:text-muted focus:border-ink focus:outline-none"
				/>
			</div>
			<div class="flex flex-col gap-1.5">
				<label for="contact-message" class="font-mono text-sm text-muted">Message</label>
				<textarea
					id="contact-message"
					name="message"
					rows="5"
					placeholder="What's on your mind?"
					class="w-full resize-y rounded-lg border border-black/10 bg-paper px-3 py-2.5 text-sm leading-normal text-ink transition-colors placeholder:text-muted focus:border-ink focus:outline-none"
				></textarea>
			</div>
			<button
				type="submit"
				class="mt-1 w-full cursor-pointer rounded-lg border border-ink bg-ink px-5.5 py-3 font-mono text-[0.8125rem] font-medium text-paper transition-opacity hover:opacity-85"
			>
				Send message
			</button>
		</form>
	</div>
</dialog>

<style>
	dialog {
		opacity: 0;
		transform: scale(0.96) translateY(0.5rem);
		transition:
			opacity 0.2s ease,
			transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
			overlay 0.2s ease allow-discrete,
			display 0.2s ease allow-discrete;
	}
	dialog[open] {
		opacity: 1;
		transform: scale(1) translateY(0);
	}
	@starting-style {
		dialog[open] {
			opacity: 0;
			transform: scale(0.96) translateY(0.5rem);
		}
	}
	dialog::backdrop {
		background: rgb(0 0 0 / 0);
		transition:
			background 0.2s ease,
			overlay 0.2s ease allow-discrete,
			display 0.2s ease allow-discrete;
	}
	dialog[open]::backdrop {
		background: rgb(0 0 0 / 0.6);
	}
	@starting-style {
		dialog[open]::backdrop {
			background: rgb(0 0 0 / 0);
		}
	}
</style>
