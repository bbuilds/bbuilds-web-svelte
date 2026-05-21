# ContactModal Form Validation

## Context

The contact form in [src/lib/components/ContactModal.svelte](src/lib/components/ContactModal.svelte) currently has no validation — its `onsubmit` just calls `preventDefault()`. We need real validation on the three fields (name, email, message).

Decisions confirmed with user:

- **Timing**: validate on blur first; once a field has been touched and shown an error, re-validate on every input.
- **Submission**: client-side only for now — no server endpoint. On valid submit, close the modal (no network call yet).
- **Error UI**: red text below the field, red border around the field.
- **Message rules**: required, min 10, max 1000 chars.

Validation utilities live in [src/lib/utils/](src/lib/utils/) alongside `format.ts` and `links.ts`, matching their named-arrow-export style.

---

## New files

### `src/lib/utils/validation.ts`

Pure functions, each returns `string | undefined` (the error message, or `undefined` if valid). Matches the existing utils style: named `export const` arrow functions with explicit return types, no JSDoc.

Constants and rules:

- `NAME_REGEX = /^[a-zA-Z](?:[ '.\-a-zA-Z]\*[a-zA-Z])?$/``.
- `NAME_MAX = 50`
- `MESSAGE_MIN = 10`
- `MESSAGE_MAX = 1000`
- Email: simple practical regex (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) — Yup's `.email()` equivalent for our scope.

Exports:

```ts
export const validateName = (value: string): string | undefined;
export const validateEmail = (value: string): string | undefined;
export const validateMessage = (value: string): string | undefined;
```

Each:

- Trims input before checking length/required.
- Returns a user-friendly message: e.g. `'Name is required'`, `'Name contains invalid characters'`, `'Name must be 50 characters or fewer'`, `'Email is required'`, `'Please enter a valid email'`, `'Message is required'`, `'Message must be at least 10 characters'`, `'Message must be 1000 characters or fewer'`.

### `src/lib/utils/validation.spec.ts`

Mirrors [src/lib/utils/format.spec.ts](src/lib/utils/format.spec.ts) and [src/lib/utils/links.spec.ts](src/lib/utils/links.spec.ts) structure: `describe('validateName', ...)`, `describe('validateEmail', ...)`, `describe('validateMessage', ...)` with `it(...)` cases covering:

- empty / whitespace-only → required error
- valid input → `undefined`
- name: special-char rejection, max-length boundary (50 ok, 51 fails)
- email: missing `@`, missing TLD, valid pass
- message: 9 chars fails, 10 ok, 1000 ok, 1001 fails

Runs under the existing `server` vitest project (Node env) since these are pure logic — no `.svelte.` suffix.

---

## Modifying `src/lib/components/ContactModal.svelte`

Add to the `<script>`:

```ts
import { validateName, validateEmail, validateMessage } from '$lib/utils/validation';

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
```

Reset state when the modal opens so re-opens start clean — add inside the existing `$effect` that watches `isOpen`:

```ts
if (isOpen) {
	errors = {};
	touched = { name: false, email: false, message: false };
}
```

### Template changes for each field

For each input/textarea:

- `bind:value={values.name}` (etc.)
- `oninput={() => onInput('name')}`
- `onblur={() => onBlur('name')}`
- `aria-invalid={errors.name ? 'true' : undefined}`
- `aria-describedby={errors.name ? 'contact-name-error' : undefined}`
- Conditionally swap the border classes: when `errors.name`, replace `border-black/10 focus:border-ink` with `border-red-500 focus:border-red-500`.

Below each field, conditionally render the error:

```svelte
{#if errors.name}
	<p id="contact-name-error" class="font-mono text-xs text-red-600">{errors.name}</p>
{/if}
```

Wire the form: `<form onsubmit={onSubmit} ...>` (replaces the inline `preventDefault`).

Red colors use Tailwind defaults (`text-red-600`, `border-red-500`) — easy to swap later if a design token is added.

---

## Verification

1. `npm run check` — type-check passes (new utility types, runes state).
2. `npm run test:unit -- --run src/lib/utils/validation.spec.ts` — unit tests pass.
3. `npm run dev`, open the site, trigger the contact modal (`#contact-modal`). Manually verify:
   - Submit empty form → all three fields show red borders + red error text below.
   - Type one char in Name, blur → "must be 50 or fewer" does not fire; required clears.
   - Type `not-an-email` in Email, blur → "Please enter a valid email"; fix to `a@b.co` → error clears on input.
   - Type 5-char message → "at least 10 characters"; extend → clears.
   - Submit a fully valid form → modal closes, fields reset.
   - Re-open modal → no stale errors.
4. `npm run lint` — prettier + eslint clean.

---

## Critical files

- New: [src/lib/utils/validation.ts](src/lib/utils/validation.ts)
- New: [src/lib/utils/validation.spec.ts](src/lib/utils/validation.spec.ts)
- Modified: [src/lib/components/ContactModal.svelte](src/lib/components/ContactModal.svelte)

## Reused patterns

- Util export style: [src/lib/utils/format.ts](src/lib/utils/format.ts), [src/lib/utils/links.ts](src/lib/utils/links.ts)
- Test structure: [src/lib/utils/format.spec.ts](src/lib/utils/format.spec.ts)
