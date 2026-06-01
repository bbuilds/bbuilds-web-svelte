# **Plan: Formspree Integration for ContactModal**

## **Context**

The ContactModal form currently validates locally but doesn't send data anywhere — `onSubmit` just resets the form and calls `close()`. The goal is to wire it up to Formspree so messages actually get delivered, using the endpoint `https://formspree.io/f/xjvjpbqb`.

`@formspree/ajax` is installed, but its `initForm` API is designed for data-attribute-driven DOM manipulation (attaching to a form element and wiring up `data-fs-*` attributes). That approach doesn't compose well with Svelte's reactive state — there's no clean way to prevent its submit interception when validation fails, and all state would live outside Svelte's reactivity. A direct `fetch` to the Formspree endpoint is simpler, more maintainable, and fits the existing component pattern exactly.

## **Implementation**

**File:** `src/lib/components/ContactModal.svelte`

### **State additions (in `<script>`)**

Add two new `$state` variables after the existing `errors`/`touched` declarations:

```tsx
let submitting = $state(false);
let submitError = $state<string | undefined>(undefined);
```

### **Updated `onSubmit` handler**

Replace the current handler body with one that:

1. Runs full validation (existing logic, unchanged)
2. Bails early if any field is invalid (existing logic, unchanged)
3. On valid: sets `submitting = true`, clears any previous `submitError`
4. POSTs JSON to Formspree with `Accept: application/json` header (required for JSON error responses)
5. On success (`res.ok`): reset form state, call `close()`
6. On Formspree validation error: surface `data.errors[0].message` into `submitError`
7. On network/unexpected failure: set a generic `submitError`
8. Always sets `submitting = false` in a `finally` block

```tsx
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
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: JSON.stringify({
				name: values.name,
				email: values.email,
				message: values.message
			})
		});
		const data = await res.json();
		if (!res.ok) {
			submitError = data.errors?.[0]?.message ?? 'Something went wrong. Please try again.';
		} else {
			values = { name: '', email: '', message: '' };
			errors = {};
			touched = { name: false, email: false, message: false };
			close();
		}
	} catch {
		submitError = 'Network error. Please check your connection and try again.';
	} finally {
		submitting = false;
	}
}
```

### **Template changes**

1. **Submit button** — pass `submitting` as `disabled` and update label:

   ```
   <Button type="submit" disabled={submitting} rounded="lg" class="btn-yellow mt-1 w-full">
     {submitting ? 'Sending…' : 'Send message'}
   </Button>
   ```

2. **Submit error** — show below the button if `submitError` is set:

   ```
   {#if submitError}
     <p class="font-mono text-xs text-red-400">{submitError}</p>
   {/if}
   ```

3. **Clear `submitError` on dialog close** — add `submitError = undefined` to `onDialogClose()` so stale errors don't reappear when the modal is reopened.

## **Verification**

1. Run `npm run dev`
2. Open modal, submit empty form → field errors appear (regression check)
3. Fill in valid data, submit → button shows "Sending…" while in-flight, modal closes on success
4. Check Formspree dashboard (`https://formspree.io/forms/xjvjpbqb/submissions`) for the submission
5. Simulate network failure (DevTools → offline) → "Network error" message appears below button
6. Run `npm run check` for type errors
