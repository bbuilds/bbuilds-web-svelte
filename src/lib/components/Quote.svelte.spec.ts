import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Quote from './Quote.svelte';

describe('Quote', () => {
	it('renders the eyebrow text', async () => {
		render(Quote);
		await expect.element(page.getByText('// 04.proof')).toBeInTheDocument();
	});

	it('renders the quote body', async () => {
		render(Quote);
		await expect.element(page.getByText(/work with Branden for 4\+ years/i)).toBeInTheDocument();
	});

	it('renders the attribution name as an external link to LinkedIn', async () => {
		render(Quote);
		const link = page.getByRole('link', { name: /kat williams/i });
		await expect
			.element(link)
			.toHaveAttribute(
				'href',
				'https://www.linkedin.com/in/branden-builds/details/recommendations/'
			);
		await expect.element(link).toHaveAttribute('target', '_blank');
		await expect.element(link).toHaveAttribute('rel', 'noopener noreferrer');
	});

	it('renders the role', async () => {
		render(Quote);
		await expect
			.element(page.getByText('Sr. Manager, Digital Experience at The Trade Desk'))
			.toBeInTheDocument();
	});
});
