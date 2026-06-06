<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import FormField from '$lib/components/FormField.svelte';
	import CloseIcon from '$lib/components/svgs/icons/CloseIcon.svelte';
	import {
		validateName,
		validateEmail,
		validateMessage,
		type ValidationMessages
	} from '$lib/utils/validation';
	import { banner } from '$lib/state/banner.svelte';
	import type { StoryblokContactForm, StoryblokFormInput } from '$lib/types/storyblok';
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props {
		content?: StoryblokContactForm;
	}
	let { content }: Props = $props();

	type NamedField = StoryblokFormInput & { name: string };

	let dialog = $state<HTMLDialogElement | undefined>(undefined);
	let triggerEl = $state<HTMLElement | null>(null);
	const isOpen = $derived(page.url.hash === '#contact-modal');

	const fields = $derived(
		(content?.fields ?? []).filter((f): f is NamedField => typeof f.name === 'string' && !!f.name)
	);

	let values = $state<Record<string, string>>({});
	let errors = $state<Record<string, string | undefined>>({});
	let touched = $state<Record<string, boolean>>({});
	let submitting = $state(false);
	let submitError = $state<string | undefined>(undefined);

	const validators: Record<string, (v: string, m?: ValidationMessages) => string | undefined> = {
		name: validateName,
		email: validateEmail,
		message: validateMessage
	};

	function fieldType(name: string): 'text' | 'email' | 'textarea' {
		const n = name.toLowerCase();
		if (n === 'email') return 'email';
		if (n === 'message') return 'textarea';
		return 'text';
	}

	function fieldAutocomplete(name: string): HTMLInputAttributes['autocomplete'] {
		const n = name.toLowerCase();
		if (n === 'name') return 'name';
		if (n === 'email') return 'email';
		return undefined;
	}

	function runValidation(field: NamedField) {
		const validate = validators[field.name.toLowerCase()];
		errors[field.name] = validate
			? validate(values[field.name] ?? '', {
					required: field.error_message_required,
					invalid: field.error_message_invalid
				})
			: undefined;
	}

	function onBlur(field: NamedField) {
		touched[field.name] = true;
		runValidation(field);
	}

	function onInput(field: NamedField) {
		if (touched[field.name]) runValidation(field);
	}

	function resetForm() {
		values = {};
		errors = {};
		touched = {};
	}

	async function onSubmit(e: SubmitEvent) {
		e.preventDefault();
		fields.forEach((field) => {
			touched[field.name] = true;
			runValidation(field);
		});
		if (fields.some((field) => errors[field.name])) return;

		submitting = true;
		submitError = undefined;
		try {
			const res = await fetch(import.meta.env.VITE_FORMSPREE_URL, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
				body: JSON.stringify(values)
			});
			const data: { errors?: { message: string }[] } = await res.json();
			if (!res.ok) {
				submitError = data.errors?.[0]?.message ?? 'Something went wrong. Please try again.';
			} else {
				resetForm();
				banner.success(
					content?.success_message ?? "Message sent! I'll be in touch soon.",
					content?.success_eyebrow ?? ''
				);
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
		if (isOpen && !dialog.open) {
			triggerEl = document.activeElement instanceof HTMLElement ? document.activeElement : null;
			dialog.showModal();
		} else if (!isOpen && dialog.open) {
			dialog.close();
		}
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
		touched = {};
		submitError = undefined;
		const trigger = triggerEl;
		triggerEl = null;
		if (page.url.hash !== '#contact-modal') {
			trigger?.focus();
			return;
		}
		goto(page.url.pathname + page.url.search, {
			replaceState: true,
			noScroll: true,
			keepFocus: true
		}).then(() => trigger?.focus());
	}

	function onBackdropClick(e: MouseEvent) {
		if (e.target === dialog) close();
	}
</script>

{#if content}
	<dialog
		id="contact-modal"
		bind:this={dialog}
		onclose={onDialogClose}
		onclick={onBackdropClick}
		aria-modal="true"
		aria-labelledby={content.title ? 'contact-modal-title' : undefined}
		class="fixed inset-0 m-auto h-fit max-h-[calc(100dvh-2rem)] w-full max-w-xl rounded-xl"
	>
		<div class="rounded-xl border border-pale-fire/50 bg-ink p-10">
			<div class="mb-6 flex items-start justify-between">
				<div>
					{#if content.eyebrow}
						<div class="flex items-center gap-2">
							<span class="relative inline-flex h-2 w-2">
								<span
									class="absolute inline-flex h-full w-full animate-ping rounded-full bg-pale-fire opacity-75"
								></span>
								<span class="relative inline-flex h-2 w-2 rounded-full bg-pale-fire"></span>
							</span>
							<span class="font-mono text-xs uppercase tracking-widest text-pale-fire"
								>{content.eyebrow}</span
							>
						</div>
					{/if}
					{#if content.title}
						<h2
							id="contact-modal-title"
							class="mt-3 text-[1.85rem] font-bold leading-[1.02] tracking-tight text-white"
						>
							{content.title}
						</h2>
					{/if}
				</div>
				<button
					type="button"
					aria-label="Close"
					onclick={close}
					class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-paper bg-transparent p-1.5 text-white transition-colors hover:bg-charcoal"
				>
					<CloseIcon />
				</button>
			</div>

			<form onsubmit={onSubmit} class="flex flex-col gap-4">
				{#each fields as field (field._uid)}
					<FormField
						id="contact-{field.name}"
						name={field.name}
						label={field.label ?? field.name}
						type={fieldType(field.name)}
						placeholder={field.placeholder}
						autocomplete={fieldAutocomplete(field.name)}
						bind:value={values[field.name]}
						error={errors[field.name]}
						onInput={() => onInput(field)}
						onBlur={() => onBlur(field)}
					/>
				{/each}
				<Button type="submit" disabled={submitting} rounded="lg" class="btn-yellow mt-1 w-full">
					{submitting ? 'Sending…' : (content.cta_text ?? 'Send message')}
				</Button>
				{#if submitError}
					<p class="font-mono text-xs text-red-400">{submitError}</p>
				{/if}
			</form>
		</div>
	</dialog>
{/if}

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
