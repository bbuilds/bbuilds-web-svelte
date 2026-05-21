import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Process from './Process.svelte';
import type { StoryblokHomePage, StoryblokProcessCards } from '$lib/types/storyblok';

const makeCard = (title: string, copy: string): StoryblokProcessCards => ({
	component: 'Process Cards',
	_uid: title,
	title,
	copy
});

const content: StoryblokHomePage = {
	component: 'Home Page',
	_uid: 'test',
	process_eyebrow: '// 03.process',
	process_copy: 'Every engagement runs the same loop.',
	process_cards: [
		makeCard('Discover', 'Aligning on the actual problem.'),
		makeCard('Research', 'Survey the landscape.'),
		makeCard('Create', 'Design and build in vertical slices.'),
		makeCard('Ship', 'Production rollout, instrumentation, then iterate.')
	]
};

describe('Process', () => {
	it('renders the eyebrow from content', async () => {
		render(Process, { props: { content } });
		await expect.element(page.getByText('// 03.process')).toBeInTheDocument();
	});

	it('renders the lede from content', async () => {
		render(Process, { props: { content } });
		await expect
			.element(page.getByText(/every engagement runs the same loop/i))
			.toBeInTheDocument();
	});

	it('renders the h2', async () => {
		render(Process, { props: { content } });
		await expect
			.element(page.getByRole('heading', { level: 2, name: /the runtime loop/i }))
			.toBeInTheDocument();
	});

	it('renders all phase titles as h3s', async () => {
		render(Process, { props: { content } });
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
		render(Process, { props: { content } });
		const cards = page.getByRole('group', { name: /phase cards/i });
		await expect.element(cards.getByRole('button').nth(0)).toHaveClass('is-active');
	});

	it('clicking a different phase makes it active and deactivates the first', async () => {
		render(Process, { props: { content } });
		const cards = page.getByRole('group', { name: /phase cards/i });
		const firstCard = cards.getByRole('button').nth(0);
		const secondCard = cards.getByRole('button').nth(1);

		await expect.element(firstCard).toHaveClass('is-active');
		await secondCard.click();
		await expect.element(secondCard).toHaveClass('is-active');
		await expect.element(firstCard).not.toHaveClass('is-active');
	});

	it('clicking a dot activates that phase', async () => {
		render(Process, { props: { content } });
		await page.getByRole('button', { name: /go to step 03 create/i }).click();
		const cards = page.getByRole('group', { name: /phase cards/i });
		await expect.element(cards.getByRole('button').nth(2)).toHaveClass('is-active');
	});
});
