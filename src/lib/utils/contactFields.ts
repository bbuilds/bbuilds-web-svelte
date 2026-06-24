import type { HTMLInputAttributes } from 'svelte/elements';
import type { StoryblokContactForm, StoryblokFormInput } from '$lib/types/storyblok';
import {
	validateName,
	validateEmail,
	validateMessage,
	type ValidationMessages
} from '$lib/utils/validation';
import { slugify } from '$lib/utils/slugify';

export type Validator = (value: string, messages?: ValidationMessages) => string | undefined;

export interface PreparedField {
	_uid: string;
	name: string;
	/**
	 * Slugified field name — used for the input `name`/`id` attributes and as the key into the
	 * values/errors/touched records, so spaces in CMS names ("full name") never leak into the
	 * DOM or the submitted payload.
	 */
	key: string;
	label: string;
	placeholder?: string;
	type: 'text' | 'email' | 'textarea';
	autocomplete: HTMLInputAttributes['autocomplete'];
	validate?: Validator;
	messages: ValidationMessages;
}

type FieldKind = 'email' | 'message' | 'name' | 'other';

// Classify a CMS field by keyword (not exact match), so authored names like "full name" or
// "email address" still map to the right type/validator/autocomplete. Precedence matters:
// email → message → name.
function classify(name: string): FieldKind {
	const n = name.toLowerCase();
	if (n.includes('email')) return 'email';
	if (n.includes('message')) return 'message';
	if (n.includes('name')) return 'name';
	return 'other';
}

const VALIDATORS: Record<FieldKind, Validator | undefined> = {
	email: validateEmail,
	message: validateMessage,
	name: validateName,
	other: undefined
};

const TYPES: Record<FieldKind, PreparedField['type']> = {
	email: 'email',
	message: 'textarea',
	name: 'text',
	other: 'text'
};

const AUTOCOMPLETE: Record<FieldKind, PreparedField['autocomplete']> = {
	email: 'email',
	name: 'name',
	message: undefined,
	other: undefined
};

type NamedField = StoryblokFormInput & { name: string };

/**
 * Turn raw Storyblok form inputs into render-ready fields: drops inputs without a usable name,
 * derives the slug key, and resolves type/autocomplete/validator/messages once per field.
 */
export function prepareFields(content?: StoryblokContactForm): PreparedField[] {
	return (content?.fields ?? [])
		.filter((f): f is NamedField => typeof f.name === 'string' && !!f.name)
		.map((f): PreparedField => {
			const kind = classify(f.name);
			return {
				_uid: f._uid,
				name: f.name,
				key: slugify(f.name),
				label: f.label ?? f.name,
				placeholder: f.placeholder,
				type: TYPES[kind],
				autocomplete: AUTOCOMPLETE[kind],
				validate: VALIDATORS[kind],
				messages: { required: f.error_message_required, invalid: f.error_message_invalid }
			};
		});
}
