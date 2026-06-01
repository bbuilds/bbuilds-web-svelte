<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import FormField from '$lib/components/FormField.svelte';
	import { validateName, validateEmail, validateMessage } from '$lib/utils/validation';
	import { banner } from '$lib/state/banner.svelte';

	let dialog = $state<HTMLDialogElement | undefined>(undefined);
	const isOpen = $derived(page.url.hash === '#contact-modal');

	let values = $state({ name: '', email: '', message: '' });
	let errors = $state<{ name?: string; email?: string; message?: string }>({});
	let touched = $state<{ name: boolean; email: boolean; message: boolean }>({
		name: false,
		email: false,
		message: false
	});
	let submitting = $state(false);
	let submitError = $state<string | undefined>(undefined);

	const validators = {
		name: validateName,
		email: validateEmail,
		message: validateMessage
	} as const;

	type Field = keyof typeof validators;

	function runValidation(field: Field) {
		errors[field] = validators[field](values[field]);
	}

	function onBlur(field: Field) {
		touched[field] = true;
		runValidation(field);
	}

	function onInput(field: Field) {
		if (touched[field]) runValidation(field);
	}

	async function onSubmit(e: SubmitEvent) {
		e.preventDefault();
		(Object.keys(validators) as Field[]).forEach((f) => {
			touched[f] = true;
			runValidation(f);
		});
		if (errors.name || errors.email || errors.message) return;

		submitting = true;
		submitError = undefined;
		try {
			const res = await fetch('https://formspree.io/f/xjvjpbqb', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
				body: JSON.stringify({ name: values.name, email: values.email, message: values.message })
			});
			const data: { errors?: { message: string }[] } = await res.json();
			if (!res.ok) {
				submitError = data.errors?.[0]?.message ?? 'Something went wrong. Please try again.';
			} else {
				values = { name: '', email: '', message: '' };
				errors = {};
				touched = { name: false, email: false, message: false };
				banner.success("Message sent! I'll be in touch soon.");
				close();
			}
		} catch {
			submitError = 'Network error. Please check your connection and try again.';
		} finally {
			submitting = false;
		}
	}

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
		errors = {};
		touched = { name: false, email: false, message: false };
		submitError = undefined;
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
	class="fixed inset-0 m-auto h-fit max-h-[calc(100dvh-2rem)] w-full max-w-xl rounded-xl"
>
	<div class="rounded-xl border border-pale-fire/50 bg-ink p-10">
		<div class="mb-6 flex items-start justify-between">
			<div>
				<div class="flex items-center gap-2">
					<span class="relative inline-flex h-2 w-2">
						<span
							class="absolute inline-flex h-full w-full animate-ping rounded-full bg-pale-fire opacity-75"
						></span>
						<span class="relative inline-flex h-2 w-2 rounded-full bg-pale-fire"></span>
					</span>
					<span class="font-mono text-xs uppercase tracking-widest text-pale-fire"
						>Start a project</span
					>
				</div>
				<h2 class="mt-3 text-[1.85rem] font-bold leading-[1.02] tracking-tight text-white">
					Let's build something good.
				</h2>
			</div>
			<button
				type="button"
				aria-label="Close"
				onclick={close}
				class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-paper bg-transparent p-1.5 text-white transition-colors hover:bg-charcoal"
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

		<form onsubmit={onSubmit} class="flex flex-col gap-4">
			<FormField
				id="contact-name"
				name="name"
				label="Name"
				placeholder="Your name"
				autocomplete="name"
				bind:value={values.name}
				error={errors.name}
				onInput={() => onInput('name')}
				onBlur={() => onBlur('name')}
			/>
			<FormField
				id="contact-email"
				name="email"
				label="Email"
				type="email"
				placeholder="you@example.com"
				autocomplete="email"
				bind:value={values.email}
				error={errors.email}
				onInput={() => onInput('email')}
				onBlur={() => onBlur('email')}
			/>
			<FormField
				id="contact-message"
				name="message"
				label="Message"
				type="textarea"
				placeholder="What's on your mind?"
				bind:value={values.message}
				error={errors.message}
				onInput={() => onInput('message')}
				onBlur={() => onBlur('message')}
			/>
			<Button type="submit" disabled={submitting} rounded="lg" class="btn-yellow mt-1 w-full">
				{submitting ? 'Sending…' : 'Send message'}
			</Button>
			{#if submitError}
				<p class="font-mono text-xs text-red-400">{submitError}</p>
			{/if}
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
