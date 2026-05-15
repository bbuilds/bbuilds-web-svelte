import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import type { ISbStoryData } from '@storyblok/js';
import type { StoryblokHomePage, StoryblokServicesTemplate } from '$lib/types/storyblok';
import Services from './Services.svelte';

function makeServiceStory(
	uid: string,
	cardTitle: string,
	bulletLabel: string,
	bulletText: string
): ISbStoryData<StoryblokServicesTemplate> {
	return {
		name: cardTitle,
		uuid: uid,
		id: 0,
		slug: uid,
		full_slug: `services/${uid}`,
		created_at: '',
		published_at: null,
		first_published_at: null,
		sort_by_date: null,
		position: 0,
		tag_list: [],
		is_startpage: false,
		parent_id: null,
		meta_data: null,
		group_id: '',
		lang: '',
		path: null,
		alternates: [],
		default_full_slug: null,
		translated_slugs: null,
		content: {
			_uid: uid,
			component: 'Services Template',
			card_title: cardTitle,
			card_list_items: {
				type: 'doc',
				content: [
					{
						type: 'bullet_list',
						content: [
							{
								type: 'list_item',
								content: [
									{
										type: 'paragraph',
										content: [
											{ type: 'text', text: bulletLabel, marks: [{ type: 'bold' }] },
											{ type: 'text', text: ` ${bulletText}` }
										]
									}
								]
							}
						]
					}
				]
			}
		}
	} as unknown as ISbStoryData<StoryblokServicesTemplate>;
}

const mockContent: StoryblokHomePage = {
	_uid: 'home',
	component: 'Home Page',
	featured_services: [
		makeServiceStory('s1', 'Mock Practice One', 'Alpha.', 'first bullet description.'),
		makeServiceStory('s2', 'Mock Practice Two', 'Beta.', 'second bullet description.')
	]
};

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
			.element(page.getByRole('heading', { level: 3, name: /discovery & transformation/i }))
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
		const btn = page.getByRole('button', { name: /discovery & transformation/i });
		await expect.element(btn).toHaveAttribute('aria-expanded', 'true');
	});

	it('clicking a different practice opens it and closes the first', async () => {
		render(Services);
		const first = page.getByRole('button', { name: /discovery & transformation/i });
		const second = page.getByRole('button', { name: /product engineering/i });

		await expect.element(first).toHaveAttribute('aria-expanded', 'true');
		await second.click();
		await expect.element(second).toHaveAttribute('aria-expanded', 'true');
		await expect.element(first).toHaveAttribute('aria-expanded', 'false');
	});

	it('clicking an open practice closes it', async () => {
		render(Services);
		const first = page.getByRole('button', { name: /discovery & transformation/i });
		await expect.element(first).toHaveAttribute('aria-expanded', 'true');
		await first.click();
		await expect.element(first).toHaveAttribute('aria-expanded', 'false');
	});

	it('renders chapter titles and richtext bullets from Storyblok content when provided', async () => {
		render(Services, { content: mockContent });

		await expect
			.element(page.getByRole('heading', { level: 3, name: /mock practice one/i }))
			.toBeInTheDocument();
		await expect
			.element(page.getByRole('heading', { level: 3, name: /mock practice two/i }))
			.toBeInTheDocument();

		await expect
			.element(page.getByRole('heading', { level: 3, name: /discovery & transformation/i }))
			.not.toBeInTheDocument();

		await expect.element(page.getByText('Alpha.').first()).toBeInTheDocument();
	});
});
