<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import { validateName, validateEmail, validateMessage } from '$lib/utils/validation';

	let dialog = $state<HTMLDialogElement | undefined>(undefined);
	const isOpen = $derived(page.url.hash === '#contact-modal');

	let values = $state({ name: '', email: '', message: '' });
	let errors = $state<{ name?: string; email?: string; message?: string }>({});
	let touched = $state<{ name: boolean; email: boolean; message: boolean }>({
		name: false,
		email: false,
		message: false
	});

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

	function onSubmit(e: SubmitEvent) {
		e.preventDefault();
		(Object.keys(validators) as Field[]).forEach((f) => {
			touched[f] = true;
			runValidation(f);
		});
		const valid = !errors.name && !errors.email && !errors.message;
		if (valid) {
			values = { name: '', email: '', message: '' };
			errors = {};
			touched = { name: false, email: false, message: false };
			close();
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

	function inputClass(hasError: string | undefined) {
		return `w-full rounded-lg border bg-paper px-3 py-2.5 text-sm leading-normal text-ink transition-colors placeholder:text-charcoal focus:outline-none ${hasError ? 'border-red-500 focus:border-red-500' : 'border-black/10 focus:border-ink'}`;
	}
</script>

<dialog
	bind:this={dialog}
	onclose={onDialogClose}
	onclick={onBackdropClick}
	class="fixed inset-0 m-auto h-fit max-h-[calc(100dvh-2rem)] w-full max-w-xl rounded-xl"
>
	<div class="rounded-xl border border-pale-fire/50 bg-ink p-10">
		<div class="mb-5 flex items-center justify-between">
			<h2 class="font-mono text-base font-bold tracking-tight text-white">Contact</h2>
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
			<div class="flex flex-col gap-1.5">
				<label for="contact-name" class="font-mono text-sm text-white">Name</label>
				<input
					id="contact-name"
					name="name"
					type="text"
					placeholder="Your name"
					autocomplete="name"
					bind:value={values.name}
					oninput={() => onInput('name')}
					onblur={() => onBlur('name')}
					aria-invalid={errors.name ? 'true' : undefined}
					aria-describedby={errors.name ? 'contact-name-error' : undefined}
					class={inputClass(errors.name)}
				/>
				{#if errors.name}
					<p id="contact-name-error" class="font-mono text-xs text-red-400">{errors.name}</p>
				{/if}
			</div>
			<div class="flex flex-col gap-1.5">
				<label for="contact-email" class="font-mono text-sm text-white">Email</label>
				<input
					id="contact-email"
					name="email"
					type="email"
					placeholder="you@example.com"
					autocomplete="email"
					bind:value={values.email}
					oninput={() => onInput('email')}
					onblur={() => onBlur('email')}
					aria-invalid={errors.email ? 'true' : undefined}
					aria-describedby={errors.email ? 'contact-email-error' : undefined}
					class={inputClass(errors.email)}
				/>
				{#if errors.email}
					<p id="contact-email-error" class="font-mono text-xs text-red-400">{errors.email}</p>
				{/if}
			</div>
			<div class="flex flex-col gap-1.5">
				<label for="contact-message" class="font-mono text-sm text-white">Message</label>
				<textarea
					id="contact-message"
					name="message"
					rows="5"
					placeholder="What's on your mind?"
					bind:value={values.message}
					oninput={() => onInput('message')}
					onblur={() => onBlur('message')}
					aria-invalid={errors.message ? 'true' : undefined}
					aria-describedby={errors.message ? 'contact-message-error' : undefined}
					class="resize-y {inputClass(errors.message)}"
				></textarea>
				{#if errors.message}
					<p id="contact-message-error" class="font-mono text-xs text-red-400">{errors.message}</p>
				{/if}
			</div>
			<Button type="submit" rounded="lg" class="btn-yellow mt-1 w-full">Send message</Button>
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
