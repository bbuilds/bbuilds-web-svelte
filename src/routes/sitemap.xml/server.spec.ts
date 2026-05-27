import { describe, expect, it, vi, beforeEach } from 'vitest';
import { SITE_URL } from '$lib/config/site';

const mockGetAll = vi.fn();

vi.mock('@storyblok/svelte', () => ({
	storyblokInit: vi.fn(),
	apiPlugin: {},
	useStoryblokApi: () => ({ getAll: mockGetAll })
}));

const link = (slug: string, overrides: Record<string, unknown> = {}) => ({
	slug,
	is_folder: false,
	is_startpage: false,
	published: true,
	published_at: '2025-03-01T00:00:00.000Z',
	...overrides
});

beforeEach(() => {
	mockGetAll.mockReset();
	mockGetAll.mockResolvedValue([]);
});

describe('GET /sitemap.xml', () => {
	it('returns 200 with application/xml content type', async () => {
		const { GET } = await import('./+server');
		const response = await GET();

		expect(response.status).toBe(200);
		expect(response.headers.get('Content-Type')).toBe('application/xml');
	});

	it('queries the links endpoint with include_dates', async () => {
		const { GET } = await import('./+server');
		await GET();

		expect(mockGetAll).toHaveBeenCalledWith(
			'cdn/links',
			expect.objectContaining({ version: 'published', include_dates: 1 })
		);
	});

	it('always includes the home URL', async () => {
		const { GET } = await import('./+server');
		const response = await GET();
		const xml = await response.text();

		expect(xml).toContain(`<loc>${SITE_URL}/</loc>`);
	});

	it('maps the home-page story to the root path with its lastmod', async () => {
		mockGetAll.mockResolvedValue([link('home-page', { published_at: '2025-01-15T10:00:00.000Z' })]);

		const { GET } = await import('./+server');
		const response = await GET();
		const xml = await response.text();

		expect(xml).toContain(`<loc>${SITE_URL}/</loc>`);
		expect(xml).toContain('<lastmod>2025-01-15</lastmod>');
	});

	it('includes service URLs from the links endpoint', async () => {
		mockGetAll.mockResolvedValue([link('services/frontend'), link('services/backend')]);

		const { GET } = await import('./+server');
		const response = await GET();
		const xml = await response.text();

		expect(xml).toContain(`<loc>${SITE_URL}/services/frontend</loc>`);
		expect(xml).toContain(`<loc>${SITE_URL}/services/backend</loc>`);
	});

	it('excludes folders, unpublished links, and non-routable stories', async () => {
		mockGetAll.mockResolvedValue([
			link('services', { is_folder: true }),
			link('services/draft', { published: false }),
			link('globals'),
			link('services/live')
		]);

		const { GET } = await import('./+server');
		const response = await GET();
		const xml = await response.text();

		expect(xml).toContain('services/live');
		expect(xml).not.toContain('services/draft');
		expect(xml).not.toContain('<loc>' + SITE_URL + '/globals</loc>');
		expect(xml).not.toContain('<loc>' + SITE_URL + '/services</loc>');
	});

	it('falls back to today as lastmod when published_at is missing', async () => {
		mockGetAll.mockResolvedValue([link('services/frontend', { published_at: undefined })]);

		const { GET } = await import('./+server');
		const response = await GET();
		const xml = await response.text();
		const today = new Date().toISOString().split('T')[0];

		expect(xml).toContain(`<lastmod>${today}</lastmod>`);
	});

	it('still serves the home URL when the links endpoint fails', async () => {
		mockGetAll.mockRejectedValue(new Error('network'));

		const { GET } = await import('./+server');
		const response = await GET();
		const xml = await response.text();

		expect(response.status).toBe(200);
		expect(xml).toContain(`<loc>${SITE_URL}/</loc>`);
	});

	it('sets cache-control header', async () => {
		const { GET } = await import('./+server');
		const response = await GET();

		expect(response.headers.get('Cache-Control')).toContain('max-age=3600');
	});

	it('maps posts/* slugs to root-level paths', async () => {
		mockGetAll.mockResolvedValue([link('posts/my-first-post')]);

		const { GET } = await import('./+server');
		const response = await GET();
		const xml = await response.text();

		expect(xml).toContain(`<loc>${SITE_URL}/my-first-post</loc>`);
		expect(xml).not.toContain(`<loc>${SITE_URL}/posts/my-first-post</loc>`);
	});

	it('excludes posts/ folder from sitemap', async () => {
		mockGetAll.mockResolvedValue([link('posts', { is_folder: true })]);

		const { GET } = await import('./+server');
		const response = await GET();
		const xml = await response.text();

		expect(xml).not.toContain(`/posts`);
	});

	it('excludes unpublished posts from sitemap', async () => {
		mockGetAll.mockResolvedValue([link('posts/draft-post', { published: false })]);

		const { GET } = await import('./+server');
		const response = await GET();
		const xml = await response.text();

		expect(xml).not.toContain('draft-post');
	});

	it('does not map non-posts, non-services, non-homepage slugs', async () => {
		mockGetAll.mockResolvedValue([link('random-story')]);

		const { GET } = await import('./+server');
		const response = await GET();
		const xml = await response.text();

		expect(xml).not.toContain(`<loc>${SITE_URL}/random-story</loc>`);
	});
});
