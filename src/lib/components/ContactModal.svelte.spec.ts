import { page } from 'vitest/browser';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import ContactModal from './ContactModal.svelte';
import { banner } from '$lib/state/banner.svelte';

function openDialog() {
	document.querySelector('dialog')?.showModal();
}

describe('ContactModal', () => {
	afterEach(() => {
		banner.dismiss();
		vi.restoreAllMocks();
	});

	it('renders eyebrow text "Start a project"', () => {
		render(ContactModal);
		const eyebrow = document.querySelector('.font-mono.uppercase');
		expect(eyebrow?.textContent?.trim()).toBe('Start a project');
	});

	it('renders the heading "Let\'s build something good."', () => {
		render(ContactModal);
		const heading = document.querySelector('h2');
		expect(heading?.textContent?.trim()).toBe("Let's build something good.");
	});

	it('renders Name, Email, and Message labels', () => {
		render(ContactModal);
		expect(document.querySelector('label[for="contact-name"]')?.textContent).toBe('Name');
		expect(document.querySelector('label[for="contact-email"]')?.textContent).toBe('Email');
		expect(document.querySelector('label[for="contact-message"]')?.textContent).toBe('Message');
	});

	it('shows aria-invalid and error message on blur with empty field', async () => {
		render(ContactModal);
		openDialog();
		const input = document.querySelector('input[name="name"]') as HTMLInputElement;
		input.focus();
		input.blur();
		await vi.waitFor(() => {
			expect(input.getAttribute('aria-invalid')).toBe('true');
		});
		expect(input.getAttribute('aria-describedby')).toBe('contact-name-error');
		await expect.element(page.getByText('Name is required')).toBeInTheDocument();
	});

	it('does not set aria-invalid when no error', () => {
		render(ContactModal);
		const input = document.querySelector('input[name="name"]') as HTMLInputElement;
		expect(input.getAttribute('aria-invalid')).toBeNull();
	});

	it('does not call fetch when form is submitted with empty fields', async () => {
		const fetchSpy = vi.spyOn(globalThis, 'fetch');
		render(ContactModal);
		openDialog();
		await page.getByRole('button', { name: /send message/i }).click();
		expect(fetchSpy).not.toHaveBeenCalled();
	});

	it('calls banner.success and closes dialog on successful submit', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
			new Response(JSON.stringify({}), { status: 200 })
		);
		const successSpy = vi.spyOn(banner, 'success');
		render(ContactModal);
		openDialog();

		await page.getByLabelText('Name').fill('Alice');
		await page.getByLabelText('Email').fill('alice@example.com');
		await page.getByLabelText('Message').fill('Hello, this is a test message.');
		await page.getByRole('button', { name: /send message/i }).click();

		await vi.waitFor(() => {
			expect(successSpy).toHaveBeenCalledWith("Message sent! I'll be in touch soon.");
		});
	});

	it('shows submitError message on failed fetch', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
			new Response(JSON.stringify({ errors: [{ message: 'Invalid email' }] }), { status: 422 })
		);
		render(ContactModal);
		openDialog();

		await page.getByLabelText('Name').fill('Bob');
		await page.getByLabelText('Email').fill('bob@example.com');
		await page.getByLabelText('Message').fill('This is a test message.');
		await page.getByRole('button', { name: /send message/i }).click();

		await expect.element(page.getByText('Invalid email')).toBeInTheDocument();
	});

	it('shows network error message when fetch throws', async () => {
		vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network failure'));
		render(ContactModal);
		openDialog();

		await page.getByLabelText('Name').fill('Carol');
		await page.getByLabelText('Email').fill('carol@example.com');
		await page.getByLabelText('Message').fill('This is a test message.');
		await page.getByRole('button', { name: /send message/i }).click();

		await expect
			.element(page.getByText('Network error. Please check your connection and try again.'))
			.toBeInTheDocument();
	});

	it('close button has aria-label="Close"', () => {
		render(ContactModal);
		expect(document.querySelector('button[aria-label="Close"]')).not.toBeNull();
	});
});
