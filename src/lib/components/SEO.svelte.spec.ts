import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import SEO from './SEO.svelte';
import type { ResolvedSEO } from '$lib/utils/seo';
import { SITE_URL, SITE_NAME, DEFAULT_OG_LOCALE } from '$lib/config/site';

const baseSEO = (overrides: Partial<ResolvedSEO> = {}): ResolvedSEO => ({
	title: 'Test Page',
	ogTitle: 'Test OG Title',
	ogType: 'website',
	description: 'Test description',
	canonical: `${SITE_URL}/test`,
	ogUrl: `${SITE_URL}/test`,
	noIndex: false,
	noFollow: false,
	jsonLd: [],
	...overrides
});

describe('SEO component', () => {
	it('renders title tag', async () => {
		render(SEO, { seo: baseSEO() });
		expect(document.title).toBe('Test Page');
	});

	it('renders meta description', async () => {
		render(SEO, { seo: baseSEO({ description: 'My description' }) });
		const meta = document.head.querySelector('meta[name="description"]');
		expect(meta?.getAttribute('content')).toBe('My description');
	});

	it('renders canonical link', async () => {
		render(SEO, { seo: baseSEO({ canonical: `${SITE_URL}/canonical` }) });
		const link = document.head.querySelector('link[rel="canonical"]');
		expect(link?.getAttribute('href')).toBe(`${SITE_URL}/canonical`);
	});

	it('renders og:title meta tag', async () => {
		render(SEO, { seo: baseSEO({ ogTitle: 'My OG Title' }) });
		const meta = document.head.querySelector('meta[property="og:title"]');
		expect(meta?.getAttribute('content')).toBe('My OG Title');
	});

	it('renders og:url, og:type, og:site_name, og:locale', async () => {
		render(SEO, { seo: baseSEO() });
		expect(document.head.querySelector('meta[property="og:type"]')?.getAttribute('content')).toBe(
			'website'
		);
		expect(
			document.head.querySelector('meta[property="og:site_name"]')?.getAttribute('content')
		).toBe(SITE_NAME);
		expect(document.head.querySelector('meta[property="og:locale"]')?.getAttribute('content')).toBe(
			DEFAULT_OG_LOCALE
		);
	});

	it('renders og:type from the resolved ogType (e.g. article)', async () => {
		render(SEO, { seo: baseSEO({ ogType: 'article' }) });
		expect(document.head.querySelector('meta[property="og:type"]')?.getAttribute('content')).toBe(
			'article'
		);
	});

	it('does not emit robots meta when noIndex and noFollow are both false', async () => {
		render(SEO, { seo: baseSEO({ noIndex: false, noFollow: false }) });
		expect(document.head.querySelector('meta[name="robots"]')).toBeNull();
	});

	it('emits noindex robots meta when noIndex is true', async () => {
		render(SEO, { seo: baseSEO({ noIndex: true }) });
		const meta = document.head.querySelector('meta[name="robots"]');
		expect(meta?.getAttribute('content')).toContain('noindex');
	});

	it('emits nofollow robots meta when noFollow is true', async () => {
		render(SEO, { seo: baseSEO({ noFollow: true }) });
		const meta = document.head.querySelector('meta[name="robots"]');
		expect(meta?.getAttribute('content')).toContain('nofollow');
	});

	it('emits noindex,nofollow when both are true', async () => {
		render(SEO, { seo: baseSEO({ noIndex: true, noFollow: true }) });
		const content = document.head.querySelector('meta[name="robots"]')?.getAttribute('content');
		expect(content).toContain('noindex');
		expect(content).toContain('nofollow');
	});

	it('omits meta description when description is undefined', async () => {
		render(SEO, { seo: baseSEO({ description: undefined }) });
		expect(document.head.querySelector('meta[name="description"]')).toBeNull();
	});

	it('omits og:image tags when ogImage is undefined', async () => {
		render(SEO, { seo: baseSEO({ ogImage: undefined }) });
		expect(document.head.querySelector('meta[property="og:image"]')).toBeNull();
	});

	it('renders og:image with width, height, and alt when provided', async () => {
		render(SEO, {
			seo: baseSEO({
				ogImage: {
					url: 'https://img.example.com/hero.jpg',
					width: 1200,
					height: 630,
					alt: 'Hero'
				}
			})
		});
		expect(document.head.querySelector('meta[property="og:image"]')?.getAttribute('content')).toBe(
			'https://img.example.com/hero.jpg'
		);
		expect(
			document.head.querySelector('meta[property="og:image:width"]')?.getAttribute('content')
		).toBe('1200');
		expect(
			document.head.querySelector('meta[property="og:image:height"]')?.getAttribute('content')
		).toBe('630');
		expect(
			document.head.querySelector('meta[property="og:image:alt"]')?.getAttribute('content')
		).toBe('Hero');
	});

	it('renders one JSON-LD script per item in jsonLd array', async () => {
		render(SEO, {
			seo: baseSEO({
				jsonLd: [{ '@type': 'Organization' }, { '@type': 'WebSite' }]
			})
		});
		const scripts = document.head.querySelectorAll('script[type="application/ld+json"]');
		expect(scripts).toHaveLength(2);
	});

	it('escapes </ in JSON-LD to prevent script breakout', async () => {
		render(SEO, {
			seo: baseSEO({
				jsonLd: [{ '@type': 'WebPage', description: 'a</script>b' }]
			})
		});
		const script = document.head.querySelector('script[type="application/ld+json"]');
		expect(script?.textContent).not.toContain('</script>');
		expect(script?.textContent).toContain('<\\/script>');
	});
});
