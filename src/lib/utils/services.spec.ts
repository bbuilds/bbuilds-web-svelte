import { describe, expect, it, vi } from 'vitest';
import { fetchServiceLinks } from './services';

type Api = Parameters<typeof fetchServiceLinks>[0];

const apiReturning = (links: Record<string, unknown>) =>
	({ get: vi.fn().mockResolvedValue({ data: { links } }) }) as unknown as Api;

describe('fetchServiceLinks', () => {
	it('returns name + slug for service stories, skipping the folder and slugless entries', async () => {
		const api = apiReturning({
			root: { name: 'Services', slug: 'services', is_folder: true, position: 0 },
			eng: {
				name: 'Product Engineering',
				slug: 'services/engineering',
				is_folder: false,
				position: 1
			},
			blank: { name: 'Orphan', slug: '', is_folder: false, position: 2 }
		});

		expect(await fetchServiceLinks(api, 'published')).toEqual([
			{ name: 'Product Engineering', slug: 'services/engineering' }
		]);
	});

	it('orders results by Storyblok position', async () => {
		const api = apiReturning({
			b: { name: 'B', slug: 'services/b', is_folder: false, position: 2 },
			a: { name: 'A', slug: 'services/a', is_folder: false, position: 1 }
		});

		expect((await fetchServiceLinks(api, 'published')).map((s) => s.name)).toEqual(['A', 'B']);
	});

	it('scopes the links query to the services/ folder and version', async () => {
		const get = vi.fn().mockResolvedValue({ data: { links: {} } });
		const api = { get } as unknown as Api;

		await fetchServiceLinks(api, 'draft');

		expect(get).toHaveBeenCalledWith('cdn/links', {
			version: 'draft',
			starts_with: 'services/'
		});
	});

	it('returns [] when the links endpoint fails', async () => {
		const api = { get: vi.fn().mockRejectedValue(new Error('network')) } as unknown as Api;

		expect(await fetchServiceLinks(api, 'published')).toEqual([]);
	});
});
