import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Process from './Process.svelte';

describe('Process', () => {
	it('renders the eyebrow text', async () => {
		render(Process);
		await expect.element(page.getByText('// 03.process')).toBeInTheDocument();
	});

	it('renders the h2', async () => {
		render(Process);
		await expect
			.element(page.getByRole('heading', { level: 2, name: /how we work together/i }))
			.toBeInTheDocument();
	});

	it('renders the lede', async () => {
		render(Process);
		await expect
			.element(page.getByText(/every engagement runs the same loop/i))
			.toBeInTheDocument();
	});

	it('renders all four phase titles as h3s', async () => {
		render(Process);
		await expect
			.element(page.getByRole('heading', { level: 3, name: /discover/i }))
			.toBeInTheDocument();
		await expect
			.element(page.getByRole('heading', { level: 3, name: /research/i }))
			.toBeInTheDocument();
		await expect
			.element(page.getByRole('heading', { level: 3, name: /create/i }))
			.toBeInTheDocument();
		await expect
			.element(page.getByRole('heading', { level: 3, name: /ship/i }))
			.toBeInTheDocument();
	});

	it('first phase is active by default', async () => {
		render(Process);
		const firstCard = page.getByRole('article').nth(0);
		await expect.element(firstCard).toHaveClass('is-active');
	});

	it('clicking a different phase makes it active and deactivates the first', async () => {
		render(Process);
		const firstCard = page.getByRole('article').nth(0);
		const secondCard = page.getByRole('article').nth(1);

		await expect.element(firstCard).toHaveClass('is-active');
		await secondCard.click();
		await expect.element(secondCard).toHaveClass('is-active');
		await expect.element(firstCard).not.toHaveClass('is-active');
	});

	it('clicking a dot activates that phase', async () => {
		render(Process);
		await page.getByRole('tab', { name: /go to step 03 create/i }).click();
		await expect.element(page.getByRole('article').nth(2)).toHaveClass('is-active');
	});
});
