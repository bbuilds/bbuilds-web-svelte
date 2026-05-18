import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Contact from './Contact.svelte';

describe('Contact', () => {
	it('renders the eyebrow text', async () => {
		render(Contact);
		await expect.element(page.getByText('// 06.contact')).toBeInTheDocument();
	});

	it('renders the lead copy', async () => {
		render(Contact);
		await expect.element(page.getByText(/prototype/i)).toBeInTheDocument();
	});

	it('renders the email button as a mailto link', async () => {
		render(Contact);
		const link = page.getByRole('link', { name: /hi@brandenbuilds\.com/i });
		await expect.element(link).toHaveAttribute('href', 'mailto:hi@brandenbuilds.com');
	});

	it('section has id="contact" for anchor navigation', async () => {
		const { container } = render(Contact);
		expect(container.querySelector('section#contact')).not.toBeNull();
	});
});
