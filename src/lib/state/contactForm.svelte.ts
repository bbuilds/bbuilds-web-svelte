import type { PreparedField } from '$lib/utils/contactFields';

interface ContactFormConfig {
	/** Endpoint the form POSTs to (Formspree). */
	action: string;
	/** Current prepared fields, read lazily so it tracks the reactive source. */
	getFields: () => PreparedField[];
	/** Run after a successful submit — e.g. show the success banner and close the dialog. */
	onSuccess: () => void;
}

/**
 * Reactive contact-form state machine: holds field values + validation state, validates on
 * blur/input/submit, and POSTs to `action`. Stays agnostic of the CMS and the banner — the
 * caller wires those up via `onSuccess`.
 */
export function createContactForm({ action, getFields, onSuccess }: ContactFormConfig) {
	let values = $state<Record<string, string>>({});
	let errors = $state<Record<string, string | undefined>>({});
	let touched = $state<Record<string, boolean>>({});
	let submitting = $state(false);
	let submitError = $state<string | undefined>(undefined);

	function validateField(field: PreparedField) {
		errors[field.key] = field.validate
			? field.validate(values[field.key] ?? '', field.messages)
			: undefined;
	}

	function handleBlur(field: PreparedField) {
		touched[field.key] = true;
		validateField(field);
	}

	function handleInput(field: PreparedField) {
		if (touched[field.key]) validateField(field);
	}

	// Clear validation state but keep typed values, so closing and reopening preserves input.
	function dismissErrors() {
		errors = {};
		touched = {};
		submitError = undefined;
	}

	// Full reset including values — used after a successful submit.
	function reset() {
		values = {};
		errors = {};
		touched = {};
	}

	async function submit(e: SubmitEvent) {
		e.preventDefault();
		const fields = getFields();
		fields.forEach((field) => {
			touched[field.key] = true;
			validateField(field);
		});
		if (fields.some((field) => errors[field.key])) return;

		submitting = true;
		submitError = undefined;
		try {
			const res = await fetch(action, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
				body: JSON.stringify(values)
			});
			const data: { errors?: { message: string }[] } = await res.json();
			if (!res.ok) {
				submitError = data.errors?.[0]?.message ?? 'Something went wrong. Please try again.';
			} else {
				reset();
				onSuccess();
			}
		} catch {
			submitError = 'Network error. Please check your connection and try again.';
		} finally {
			submitting = false;
		}
	}

	return {
		get values() {
			return values;
		},
		get errors() {
			return errors;
		},
		get submitting() {
			return submitting;
		},
		get submitError() {
			return submitError;
		},
		handleBlur,
		handleInput,
		submit,
		dismissErrors
	};
}
