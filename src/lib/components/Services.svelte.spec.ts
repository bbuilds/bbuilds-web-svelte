import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Services from './Services.svelte';

describe('Services', () => {
	it('renders the eyebrow text', async () => {
		render(Services);
		await expect.element(page.getByText('// 02.services')).toBeInTheDocument();
	});

	it('renders the h2', async () => {
		render(Services);
		await expect
			.element(page.getByRole('heading', { level: 2, name: /diving deep into digital/i }))
			.toBeInTheDocument();
	});

	it('renders the lede', async () => {
		render(Services);
		await expect
			.element(page.getByText(/bridge the gap between creative discovery/i))
			.toBeInTheDocument();
	});

	it('renders all five practice titles as h3s', async () => {
		render(Services);
		await expect
			.element(page.getByRole('heading', { level: 3, name: /discovery & architecture/i }))
			.toBeInTheDocument();
		await expect
			.element(page.getByRole('heading', { level: 3, name: /product engineering/i }))
			.toBeInTheDocument();
		await expect
			.element(page.getByRole('heading', { level: 3, name: /applied intelligence/i }))
			.toBeInTheDocument();
		await expect
			.element(page.getByRole('heading', { level: 3, name: /identity & experience/i }))
			.toBeInTheDocument();
		await expect
			.element(page.getByRole('heading', { level: 3, name: /continuity & growth/i }))
			.toBeInTheDocument();
	});

	it('first practice is open by default', async () => {
		render(Services);
		const btn = page.getByRole('button', { name: /discovery & architecture/i });
		await expect.element(btn).toHaveAttribute('aria-expanded', 'true');
	});

	it('clicking a different practice opens it and closes the first', async () => {
		render(Services);
		const first = page.getByRole('button', { name: /discovery & architecture/i });
		const second = page.getByRole('button', { name: /product engineering/i });

		await expect.element(first).toHaveAttribute('aria-expanded', 'true');
		await second.click();
		await expect.element(second).toHaveAttribute('aria-expanded', 'true');
		await expect.element(first).toHaveAttribute('aria-expanded', 'false');
	});

	it('clicking an open practice closes it', async () => {
		render(Services);
		const first = page.getByRole('button', { name: /discovery & architecture/i });
		await expect.element(first).toHaveAttribute('aria-expanded', 'true');
		await first.click();
		await expect.element(first).toHaveAttribute('aria-expanded', 'false');
	});
});
