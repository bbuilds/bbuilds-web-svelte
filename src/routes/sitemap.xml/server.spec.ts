import { describe, expect, it, vi, beforeEach } from 'vitest';
import { SITE_URL } from '$lib/config/site';

const mockGet = vi.fn();

vi.mock('@storyblok/svelte', () => ({
	storyblokInit: vi.fn(),
	apiPlugin: {},
	useStoryblokApi: () => ({ get: mockGet })
}));

const homeStory = (overrides: Record<string, unknown> = {}) => ({
	published_at: '2025-01-15T10:00:00.000Z',
	content: { seo: [] },
	...overrides
});

const serviceStory = (slug: string, overrides: Record<string, unknown> = {}) => ({
	name: `Service ${slug}`,
	full_slug: `services/${slug}`,
	published_at: '2025-03-01T00:00:00.000Z',
	content: { seo: [] },
	...overrides
});

beforeEach(() => {
	mockGet.mockReset();
});

describe('GET /sitemap.xml', () => {
	it('returns 200 with application/xml content type', async () => {
		mockGet.mockResolvedValue({ data: { story: homeStory() } });
		mockGet.mockResolvedValueOnce({ data: { story: homeStory() } });
		mockGet.mockResolvedValueOnce({ data: { stories: [] } });

		const { GET } = await import('./+server');
		const response = await GET();

		expect(response.status).toBe(200);
		expect(response.headers.get('Content-Type')).toBe('application/xml');
	});

	it('includes home URL in urlset', async () => {
		mockGet.mockResolvedValueOnce({ data: { story: homeStory() } });
		mockGet.mockResolvedValueOnce({ data: { stories: [] } });

		const { GET } = await import('./+server');
		const response = await GET();
		const xml = await response.text();

		expect(xml).toContain(`<loc>${SITE_URL}/</loc>`);
		expect(xml).toContain('<lastmod>2025-01-15</lastmod>');
	});

	it('includes service URLs prefixed by SITE_URL', async () => {
		mockGet.mockResolvedValueOnce({ data: { story: homeStory() } });
		mockGet.mockResolvedValueOnce({
			data: { stories: [serviceStory('frontend'), serviceStory('backend')] }
		});

		const { GET } = await import('./+server');
		const response = await GET();
		const xml = await response.text();

		expect(xml).toContain(`<loc>${SITE_URL}/services/frontend</loc>`);
		expect(xml).toContain(`<loc>${SITE_URL}/services/backend</loc>`);
	});

	it('excludes stories where seo[0].no_index is true', async () => {
		mockGet.mockResolvedValueOnce({ data: { story: homeStory() } });
		mockGet.mockResolvedValueOnce({
			data: {
				stories: [
					serviceStory('visible'),
					serviceStory('hidden', { content: { seo: [{ no_index: true }] } })
				]
			}
		});

		const { GET } = await import('./+server');
		const response = await GET();
		const xml = await response.text();

		expect(xml).toContain('services/visible');
		expect(xml).not.toContain('services/hidden');
	});

	it('uses today as lastmod when published_at is missing', async () => {
		mockGet.mockResolvedValueOnce({
			data: { story: homeStory({ published_at: undefined }) }
		});
		mockGet.mockResolvedValueOnce({ data: { stories: [] } });

		const { GET } = await import('./+server');
		const response = await GET();
		const xml = await response.text();
		const today = new Date().toISOString().split('T')[0];

		expect(xml).toContain(`<lastmod>${today}</lastmod>`);
	});

	it('sets cache-control header', async () => {
		mockGet.mockResolvedValueOnce({ data: { story: homeStory() } });
		mockGet.mockResolvedValueOnce({ data: { stories: [] } });

		const { GET } = await import('./+server');
		const response = await GET();

		expect(response.headers.get('Cache-Control')).toContain('max-age=3600');
	});
});
