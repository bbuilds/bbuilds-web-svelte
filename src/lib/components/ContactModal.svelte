<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import FormField from '$lib/components/FormField.svelte';
	import CloseIcon from '$lib/components/svgs/icons/CloseIcon.svelte';
	import { banner } from '$lib/state/banner.svelte';
	import { createContactForm } from '$lib/state/contactForm.svelte';
	import { createHashDialog } from '$lib/state/hashDialog.svelte';
	import { prepareFields } from '$lib/utils/contactFields';
	import type { StoryblokContactForm } from '$lib/types/storyblok';

	interface Props {
		content?: StoryblokContactForm;
	}
	let { content }: Props = $props();

	const MODAL_HASH = '#contact-modal';

	const fields = $derived(prepareFields(content));

	let dialog = $state<HTMLDialogElement>();
	const modal = createHashDialog(MODAL_HASH, () => dialog);
	const form = createContactForm({
		action: import.meta.env.VITE_FORMSPREE_URL,
		getFields: () => fields,
		onSuccess: () => {
			banner.success(
				content?.success_message ?? "Message sent! I'll be in touch soon.",
				content?.success_eyebrow ?? ''
			);
			modal.close();
		}
	});

	// On close, clear validation state (keeping typed values) then strip the hash and restore focus.
	function handleDialogClose() {
		form.dismissErrors();
		return modal.handleClose();
	}
</script>

{#if content}
	<dialog
		id="contact-modal"
		bind:this={dialog}
		onclose={handleDialogClose}
		onclick={modal.handleBackdropClick}
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
					onclick={modal.close}
					class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-paper bg-transparent p-1.5 text-white transition-colors hover:bg-charcoal"
				>
					<CloseIcon />
				</button>
			</div>

			<form onsubmit={form.submit} class="flex flex-col gap-4">
				{#each fields as field (field._uid)}
					<FormField
						id="contact-{field.key}"
						name={field.key}
						label={field.label}
						type={field.type}
						placeholder={field.placeholder}
						autocomplete={field.autocomplete}
						bind:value={
							() => form.values[field.key] ?? '', (v: string) => (form.values[field.key] = v)
						}
						error={form.errors[field.key]}
						onInput={() => form.handleInput(field)}
						onBlur={() => form.handleBlur(field)}
					/>
				{/each}
				<Button
					type="submit"
					disabled={form.submitting}
					rounded="lg"
					class="btn-yellow mt-1 w-full"
				>
					{form.submitting ? 'Sending…' : (content.cta_text ?? 'Send message')}
				</Button>
				{#if form.submitError}
					<p class="font-mono text-xs text-red-400">{form.submitError}</p>
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
