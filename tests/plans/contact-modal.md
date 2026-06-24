# Test plan: contact modal

## Route / entry point

`/` (the modal is mounted globally in `src/routes/+layout.svelte`, so any route works — use `/`
for the fastest load). Triggers: header "contact" link, bottom nav "contact" link, and the Contact
section CTA — all of which point at the `#contact-modal` hash. The dialog itself opens via
`createHashDialog` (`src/lib/state/hashDialog.svelte.ts`) watching `location.hash`, so navigating
directly to `/#contact-modal` also opens it.

## SSR caveat

The modal's field set (`fields`) and copy (title, eyebrow, CTA text, success message) come from
Storyblok via the root layout's server `load`. `page.route` cannot intercept that. Scenarios below
assert structure (field count/labels present, role of elements) and behavior, not specific copy.
The Formspree POST in `createContactForm.submit` (`src/lib/state/contactForm.svelte.ts`) **is**
a client-side `fetch` and can be mocked with `page.route` for success/error scenarios — do that
rather than hitting the real Formspree endpoint.

## Scenarios

### 1. Opening the modal via the header contact link

- **Precondition:** On `/`, modal closed (no hash).
- **Locator intent:** Link with accessible name "contact" (header nav), then the dialog itself —
  by role `dialog` (native `<dialog>` exposes `role="dialog"` with `aria-modal="true"`).
- **Action:** Click the header "contact" link.
- **Expected outcome:** URL hash becomes `#contact-modal`; the dialog becomes visible
  (`expect(dialog).toBeVisible()`); a "Close" button (`getByRole('button', { name: 'Close' })`) is
  present; at least one labeled form field is visible inside the dialog.

### 2. Closing the modal via the Close button

- **Precondition:** Modal open (navigate to `/#contact-modal` or trigger via scenario 1's action).
- **Locator intent:** Button with accessible name "Close" inside the dialog.
- **Action:** Click "Close".
- **Expected outcome:** Dialog is no longer visible; URL hash is stripped back to the bare
  pathname (no `#contact-modal`); focus returns to the element that opened the modal (the
  triggering link should regain focus — assert via `expect(trigger).toBeFocused()` when the trigger
  is known/controllable, e.g. when opened from the header link).

### 3. Closing the modal via Escape key

- **Precondition:** Modal open.
- **Locator intent:** None needed for the action (keyboard); assert against the dialog role and
  hash.
- **Action:** Press `Escape` while the dialog is open (native `<dialog>` handles this on
  `showModal()`).
- **Expected outcome:** Dialog closes (no longer visible) and the hash is stripped, same as
  scenario 2. Note: the `close` event handler (`handleDialogClose`) also runs `form.dismissErrors()`
  — verify no error text remains visible if the modal is reopened after a validation error was
  previously triggered (pairs with scenario 5).

### 4. Closing the modal via backdrop click

- **Precondition:** Modal open.
- **Locator intent:** Click on the dialog backdrop, i.e. the `dialog` element itself outside the
  inner content `<div>` (the click handler checks `e.target === dialog`). In Playwright, click at
  a point on the dialog bounding box outside the inner card — e.g. near `{ x: 4, y: 4 }` relative
  to the dialog, or click the dialog element directly via `dialog.click({ position: ... })`.
- **Action:** Click the backdrop area.
- **Expected outcome:** Same close behavior as scenario 2 (dialog hidden, hash stripped).

### 5. Validation errors on blur and on submit with empty fields

- **Precondition:** Modal open, all fields empty.
- **Locator intent:** The submit button — `getByRole('button', { name: /send message/i })` (falls
  back to whatever CMS `cta_text` resolves to, so prefer matching the default "Send message" loosely
  or assert by role + `type=submit` if copy can't be relied on). Each field via
  `getByLabel(<field label>)`.
- **Action:** Click into the first field and blur without typing (tab to next field), then attempt
  to submit the form with all fields still empty.
- **Expected outcome:** Each required field shows an associated error message
  (`aria-invalid="true"` and an error `<p>` referenced by `aria-describedby`); the form does not
  submit (no navigation, no success banner shown); submit button is not stuck in a "Sending…"
  disabled state.

### 6. Validation error for an invalid email, then correction clears it

- **Precondition:** Modal open.
- **Locator intent:** Field via `getByLabel` matching the email field (label text contains "email"
  per `classify()` keyword matching in `contactFields.ts`).
- **Action:** Type an invalid value (e.g. `not-an-email`) into the email field, blur it; observe
  error; then type a valid email and blur again.
- **Expected outcome:** After the first blur, an inline error is visible under the email field.
  After correcting the value and blurring again, the error disappears (`handleBlur` →
  `validateField` re-runs and clears `errors[key]`).

### 7. Successful submission shows the success banner and closes the modal

- **Precondition:** Modal open; mock the Formspree POST via `page.route` on the configured
  `VITE_FORMSPREE_URL` (or a wildcard matching the action URL) to return a 200 JSON success body.
- **Locator intent:** Fill each visible field via `getByLabel`; submit button via
  `getByRole('button', { name: /send message/i })`; success feedback via
  `getByRole('status')` (the `SuccessBanner` div has `role="status"` and `aria-live="polite"`).
- **Action:** Fill all fields with valid values, click submit.
- **Expected outcome:** While the request is in flight, the submit button shows disabled/"Sending…"
  state. After the mocked response resolves: the dialog closes (hash stripped, dialog not visible);
  the success banner (`role="status"`) becomes visible with non-empty text content.

### 8. Submission failure shows an inline error and keeps the modal open

- **Precondition:** Modal open; mock the Formspree POST via `page.route` to return a non-2xx
  response with a JSON body shaped like `{ errors: [{ message: '<msg>' }] }`.
- **Locator intent:** Fill fields via `getByLabel`; submit via
  `getByRole('button', { name: /send message/i })`; error text via `getByText` for the rendered
  `submitError` paragraph (no stable role/label — it's a plain `<p>`, so `getByText` is the
  appropriate fallback per locator order).
- **Action:** Fill all fields with valid values, click submit.
- **Expected outcome:** Dialog remains open (still visible, hash still `#contact-modal`); an error
  message is visible in the form; submitted values remain in the fields (state isn't reset on
  failure, only on success per `contactForm.svelte.ts`).

## Out of scope

- Network/offline failure path (the `catch` branch producing "Network error…") — would need request
  abortion rather than a mocked response; flag for a follow-up scenario using `page.route` with
  `route.abort()`.
- Exact validation regex edge cases (name character set, message min/max length boundaries) — these
  are pure-function behaviors already covered by `src/lib/utils/validation.spec.ts` (Vitest); no
  need to duplicate in e2e.
- Field-set variation by CMS content (number/order of fields, which keyword maps to which type) —
  covered by `contactFields.ts`/`ContactModal.svelte.spec.ts` unit tests; e2e should only assert
  "at least one labeled field is present," not a specific count.
- Reopening the modal preserving previously typed values after a non-submit close (`dismissErrors`
  keeps `values` but clears `errors`/`touched`) — worth a follow-up scenario if this becomes a
  regression risk.
- Focus trap behavior inside the dialog (Tab cycling without escaping to page content) — native
  `<dialog>` with `showModal()` provides this by default; add a scenario only if a regression is
  suspected (e.g. a future change adds elements outside the dialog that intercept focus).
