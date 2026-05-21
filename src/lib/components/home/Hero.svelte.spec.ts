import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Hero from './Hero.svelte';

describe('Hero', () => {
	it('renders the first rotating word on mount', async () => {
		render(Hero);
		await expect.element(page.getByText('hardened systems')).toBeInTheDocument();
	});

	it('renders the heading', async () => {
		render(Hero);
		await expect.element(page.getByRole('heading', { level: 1 })).toBeInTheDocument();
	});

	it('renders the CTA button linking to #contact', async () => {
		render(Hero);
		const link = page.getByRole('link', { name: /start a project/i });
		await expect.element(link).toBeInTheDocument();
		await expect.element(link).toHaveAttribute('href', '#contact');
	});

	it('renders the intro label', async () => {
		render(Hero);
		await expect.element(page.getByText("greetings, I'm Branden Builds")).toBeInTheDocument();
	});
});
