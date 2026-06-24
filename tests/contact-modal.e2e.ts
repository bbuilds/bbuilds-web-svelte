import type { Locator } from '@playwright/test';
import { test, expect } from './fixtures/diagnostics';

const SUBMIT_BUTTON_NAME = /send/i;

/**
 * Fills every visible field in the dialog with a value that passes validation. The email,
 * message, and name fields are matched by accessible name (per `contactFields.ts` keyword
 * classification: email → message → name), so this stays valid regardless of how many fields
 * the CMS defines (see the plan's "out of scope" note on field-set variation). Returns each
 * filled field's locator alongside its value, for asserting values persist after a failed submit.
 */
async function fillValidContactForm(dialog: Locator): Promise<{ field: Locator; value: string }[]> {
	const filled: { field: Locator; value: string }[] = [
		{ field: dialog.getByLabel(/name/i), value: 'Jane Doe' },
		{ field: dialog.getByLabel(/email/i), value: 'valid@example.com' },
		{
			field: dialog.getByLabel(/message/i),
			value: 'This is a valid message that is long enough to pass validation.'
		}
	];

	for (const { field, value } of filled) {
		await field.fill(value);
	}

	return filled;
}

test.describe('Contact modal', () => {
	test('1. opening the modal via the header contact link', async ({ page }) => {
		await page.goto('/');

		const headerNav = page.getByRole('navigation').first();
		const trigger = headerNav.getByRole('link', { name: 'contact' });
		await trigger.click();

		await expect(page).toHaveURL(/#contact-modal$/);

		const dialog = page.getByRole('dialog');
		await expect(dialog).toBeVisible();
		await expect(dialog.getByRole('button', { name: 'Close' })).toBeVisible();

		const labeledFields = dialog.getByRole('textbox');
		await expect(labeledFields.first()).toBeVisible();
	});

	test('2. closing the modal via the Close button strips the hash', async ({ page }) => {
		await page.goto('/');

		const headerNav = page.getByRole('navigation').first();
		const trigger = headerNav.getByRole('link', { name: 'contact' });
		await trigger.click();

		const dialog = page.getByRole('dialog');
		await expect(dialog).toBeVisible();

		await dialog.getByRole('button', { name: 'Close' }).click();

		await expect(dialog).toBeHidden();
		await expect(page).toHaveURL(/^[^#]*$/);
	});

	// BUG: createHashDialog's trigger-tracking click listener
	// (src/lib/state/hashDialog.svelte.ts) is registered inside a `$effect`, which
	// mounts well after the page becomes interactive/clickable. Clicking the header
	// "contact" link before that listener registers means `triggerEl` is never set, so
	// `handleClose`'s `trigger?.focus()` is a silent no-op and focus falls back to
	// `<body>` instead of returning to the trigger. Repro showed the click-vs-listener
	// race lands the click ~400ms before the capture listener registers (~470ms) on a
	// fresh page load — reproduced in ~80% of runs locally. Fix belongs in the app
	// (register the trigger-tracking listener earlier, e.g. outside the `$effect`, or
	// track the trigger via the click handler bound directly on each `a[href="#contact-modal"]`
	// link rather than a document-level listener that races hydration).
	test.fixme('2b. closing the modal via the Close button returns focus to the trigger', async ({
		page
	}) => {
		await page.goto('/');

		const headerNav = page.getByRole('navigation').first();
		const trigger = headerNav.getByRole('link', { name: 'contact' });
		await trigger.click();

		const dialog = page.getByRole('dialog');
		await expect(dialog).toBeVisible();

		await dialog.getByRole('button', { name: 'Close' }).click();

		await expect(dialog).toBeHidden();
		await expect(trigger).toBeFocused();
	});

	test('3. closing the modal via Escape key clears prior validation errors', async ({ page }) => {
		await page.goto('/#contact-modal');

		const dialog = page.getByRole('dialog');
		await expect(dialog).toBeVisible();

		// Trigger a validation error first.
		await dialog.getByRole('button', { name: SUBMIT_BUTTON_NAME }).click();
		const fields = dialog.getByRole('textbox');
		await expect(fields.first()).toHaveAttribute('aria-invalid', 'true');

		await page.keyboard.press('Escape');

		await expect(dialog).toBeHidden();
		await expect(page).toHaveURL(/^[^#]*$/);

		// Reopen and verify no stale error text remains.
		await page.goto('/#contact-modal');
		await expect(dialog).toBeVisible();
		await expect(fields.first()).not.toHaveAttribute('aria-invalid', 'true');
	});

	test('4. closing the modal via backdrop click', async ({ page }) => {
		await page.goto('/#contact-modal');

		const dialog = page.getByRole('dialog');
		await expect(dialog).toBeVisible();

		// The dialog's own box hugs its content; the clickable backdrop is the native
		// ::backdrop pseudo-element filling the rest of the viewport, so click a point
		// guaranteed to be outside the content box (the dialog click handler checks
		// e.target === dialog, which is true for backdrop clicks).
		await page.mouse.click(5, 5);

		await expect(dialog).toBeHidden();
		await expect(page).toHaveURL(/^[^#]*$/);
	});

	test('5. validation errors on blur and on submit with empty fields', async ({ page }) => {
		await page.goto('/#contact-modal');

		const dialog = page.getByRole('dialog');
		await expect(dialog).toBeVisible();

		const fields = dialog.getByRole('textbox');
		const fieldCount = await fields.count();
		expect(fieldCount).toBeGreaterThan(0);

		// Focus the first field, then blur via Tab without typing.
		await fields.first().focus();
		await page.keyboard.press('Tab');
		await expect(fields.first()).toHaveAttribute('aria-invalid', 'true');

		const submitButton = dialog.getByRole('button', { name: SUBMIT_BUTTON_NAME });
		await submitButton.click();

		for (let i = 0; i < fieldCount; i++) {
			await expect(fields.nth(i)).toHaveAttribute('aria-invalid', 'true');
		}

		// Form did not submit: dialog stays open, hash unchanged, no success banner text,
		// submit button not stuck. The success-banner container is always present in the DOM
		// (shown/hidden via an off-screen CSS transform, not display/visibility), so assert its
		// text content rather than `toBeVisible()`, which can't see the transform.
		await expect(dialog).toBeVisible();
		await expect(page).toHaveURL(/#contact-modal$/);
		await expect(page.getByRole('status')).toBeEmpty();
		await expect(submitButton).toBeEnabled();
		await expect(submitButton).not.toHaveText(/sending/i);
	});

	test('6. invalid email shows an error, then correction clears it', async ({ page }) => {
		await page.goto('/#contact-modal');

		const dialog = page.getByRole('dialog');
		await expect(dialog).toBeVisible();

		const emailField = dialog.getByLabel(/email/i);
		await emailField.fill('not-an-email');
		await emailField.blur();

		await expect(emailField).toHaveAttribute('aria-invalid', 'true');

		await emailField.fill('valid@example.com');
		await emailField.blur();

		await expect(emailField).not.toHaveAttribute('aria-invalid', 'true');
	});

	test('7. successful submission shows the success banner and closes the modal', async ({
		page
	}) => {
		await page.route('**/formspree.io/**', async (route) => {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({ ok: true })
			});
		});

		await page.goto('/#contact-modal');

		const dialog = page.getByRole('dialog');
		await expect(dialog).toBeVisible();

		await fillValidContactForm(dialog);

		const submitButton = dialog.getByRole('button', { name: SUBMIT_BUTTON_NAME });
		await submitButton.click();

		await expect(dialog).toBeHidden();
		await expect(page).toHaveURL(/^[^#]*$/);

		// The banner container is always present in the DOM (shown/hidden via an off-screen
		// CSS transform on a `.visible` class toggle, not display/visibility), so assert the
		// `visible` class plus non-empty text rather than `toBeVisible()`, which can't see the
		// transform and would report "visible" even when dismissed.
		const successBanner = page.getByRole('status');
		await expect(successBanner).toHaveClass(/visible/);
		await expect(successBanner).not.toBeEmpty();
	});

	test('8. submission failure shows an inline error and keeps the modal open', async ({ page }) => {
		const errorMessage = 'Something went wrong on the server.';
		await page.route('**/formspree.io/**', async (route) => {
			await route.fulfill({
				status: 422,
				contentType: 'application/json',
				body: JSON.stringify({ errors: [{ message: errorMessage }] })
			});
		});

		await page.goto('/#contact-modal');

		const dialog = page.getByRole('dialog');
		await expect(dialog).toBeVisible();

		const filledFields = await fillValidContactForm(dialog);

		const submitButton = dialog.getByRole('button', { name: SUBMIT_BUTTON_NAME });
		await submitButton.click();

		await expect(page.getByText(errorMessage)).toBeVisible();
		await expect(dialog).toBeVisible();
		await expect(page).toHaveURL(/#contact-modal$/);

		for (const { field, value } of filledFields) {
			await expect(field).toHaveValue(value);
		}
	});
});
