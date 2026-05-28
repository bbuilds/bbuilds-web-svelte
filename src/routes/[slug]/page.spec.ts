import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SITE_URL, SITE_NAME } from '$lib/config/site';
import type { PageLoad } from './$types';

const mockGet = vi.fn();

const mockParent = vi.fn().mockResolvedValue({
	storyblokAPI: { get: mockGet },
	version: 'published' as const,
	globals: null
});

const event = (slug: string) =>
	({
		params: { slug },
		parent: mockParent,
		url: new URL(`${SITE_URL}/${slug}`)
	}) as unknown as Parameters<PageLoad>[0];

const story = (overrides: Record<string, unknown> = {}) => ({
	name: 'My Post',
	first_published_at: '2024-01-15T00:00:00.000Z',
	tag_list: ['gatsby', 'javascript'],
	content: {
		seo: [],
		summary: 'A great post',
		Category: [],
		content: { type: 'doc', content: [] },
		featured_image: { filename: 'https://example.com/img.jpg', alt: '' }
	},
	...overrides
});

beforeEach(() => {
	vi.resetModules();
	mockGet.mockReset();
	mockParent.mockResolvedValue({
		storyblokAPI: { get: mockGet },
		version: 'published' as const,
		globals: null
	});
});

describe('GET /[slug] (blog post)', () => {
	it('fetches from cdn/stories/posts/<slug>', async () => {
		mockGet.mockResolvedValue({ data: { story: story() } });
		const { load } = await import('./+page');

		await load(event('my-post'));

		expect(mockGet).toHaveBeenCalledWith(
			'cdn/stories/posts/my-post',
			expect.objectContaining({ version: 'published' })
		);
	});

	it('returns story and seo on success', async () => {
		const s = story();
		mockGet.mockResolvedValue({ data: { story: s } });
		const { load } = await import('./+page');

		const result = await load(event('my-post'));

		expect(result!.story).toBe(s);
		expect(result!.seo).toBeDefined();
		expect(result!.seo.title).toContain('My Post');
		expect(result!.seo.title).toContain(SITE_NAME);
	});

	it('throws 404 when story is missing', async () => {
		mockGet.mockResolvedValue({ data: {} });
		const { load } = await import('./+page');

		await expect(load(event('not-found'))).rejects.toMatchObject({ status: 404 });
	});

	it('throws 404 when Storyblok rejects with status 404', async () => {
		mockGet.mockRejectedValue({ status: 404, message: 'Not found', response: { status: 404 } });
		const { load } = await import('./+page');

		await expect(load(event('not-found'))).rejects.toMatchObject({ status: 404 });
	});

	it('re-throws non-404 Storyblok errors so SvelteKit returns 500', async () => {
		const sbError = { status: 503, message: 'Service unavailable' };
		mockGet.mockRejectedValue(sbError);
		const { load } = await import('./+page');

		await expect(load(event('my-post'))).rejects.toBe(sbError);
	});

	it('re-throws network errors without a status field', async () => {
		const netErr = new Error('network');
		mockGet.mockRejectedValue(netErr);
		const { load } = await import('./+page');

		await expect(load(event('my-post'))).rejects.toBe(netErr);
	});

	it('re-throws SvelteKit errors with a status field', async () => {
		const kitError = { status: 403, body: { message: 'Forbidden' } };
		mockGet.mockRejectedValue(kitError);
		const { load } = await import('./+page');

		await expect(load(event('my-post'))).rejects.toBe(kitError);
	});

	it('includes breadcrumb JSON-LD with Home, Blog, and post name', async () => {
		mockGet.mockResolvedValue({ data: { story: story({ name: 'Cool Article' }) } });
		const { load } = await import('./+page');

		const result = await load(event('cool-article'));

		const breadcrumb = result!.seo.jsonLd?.find(
			(ld: Record<string, unknown>) => ld['@type'] === 'BreadcrumbList'
		);
		expect(breadcrumb).toBeDefined();
		const items = (breadcrumb as Record<string, unknown>).itemListElement as {
			name: string;
			item: string;
		}[];
		expect(items[0].name).toBe('Home');
		expect(items[1].name).toBe('Blog');
		expect(items[2].name).toBe('Cool Article');
		expect(items[2].item).toBe(`${SITE_URL}/cool-article`);
	});
});
