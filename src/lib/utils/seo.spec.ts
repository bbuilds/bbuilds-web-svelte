import { describe, expect, it } from 'vitest';
import type { StoryblokSEO } from '$lib/types/storyblok';
import { resolveSEO, absoluteUrl } from './seo';
import { SITE_URL } from '$lib/config/site';

const seoBlok = (overrides: Partial<StoryblokSEO> = {}): StoryblokSEO => ({
	component: 'SEO',
	_uid: 'uid',
	...overrides
});

describe('absoluteUrl', () => {
	it('passes through absolute https URLs', () => {
		expect(absoluteUrl('https://example.com/page')).toBe('https://example.com/page');
	});

	it('passes through absolute http URLs', () => {
		expect(absoluteUrl('http://example.com')).toBe('http://example.com');
	});

	it('resolves root-relative paths against SITE_URL', () => {
		expect(absoluteUrl('/services/foo')).toBe(`${SITE_URL}/services/foo`);
	});

	it('resolves bare paths with a leading slash prepended', () => {
		expect(absoluteUrl('about')).toBe(`${SITE_URL}/about`);
	});
});

describe('resolveSEO', () => {
	it('uses page SEO over global SEO over fallbacks', () => {
		const result = resolveSEO({
			pageSEO: seoBlok({ meta_title: 'Page Title', meta_description: 'Page desc' }),
			globalSEO: seoBlok({ meta_title: 'Global Title', meta_description: 'Global desc' }),
			fallbacks: { title: 'Fallback Title', pathname: '/' }
		});
		expect(result.title).toBe('Page Title');
		expect(result.description).toBe('Page desc');
	});

	it('falls back to global SEO when page SEO is absent', () => {
		const result = resolveSEO({
			globalSEO: seoBlok({ meta_title: 'Global Title', meta_description: 'Global desc' }),
			fallbacks: { title: 'Fallback Title', pathname: '/' }
		});
		expect(result.title).toBe('Global Title');
		expect(result.description).toBe('Global desc');
	});

	it('falls back to fallbacks when both SEO bloks are absent', () => {
		const result = resolveSEO({
			fallbacks: { title: 'Fallback Title', description: 'Fallback desc', pathname: '/' }
		});
		expect(result.title).toBe('Fallback Title');
		expect(result.description).toBe('Fallback desc');
	});

	it('resolves fields independently — page title + global description', () => {
		const result = resolveSEO({
			pageSEO: seoBlok({ meta_title: 'Page Title' }),
			globalSEO: seoBlok({ meta_description: 'Global desc' }),
			fallbacks: { title: 'Fallback', pathname: '/' }
		});
		expect(result.title).toBe('Page Title');
		expect(result.description).toBe('Global desc');
	});

	it('uses fallback og_title derived from meta_title', () => {
		const result = resolveSEO({
			pageSEO: seoBlok({ meta_title: 'My Page' }),
			fallbacks: { title: 'Fallback', pathname: '/' }
		});
		expect(result.ogTitle).toBe('My Page');
	});

	it('uses explicit og_title when set', () => {
		const result = resolveSEO({
			pageSEO: seoBlok({ meta_title: 'My Page', og_title: 'OG Title' }),
			fallbacks: { title: 'Fallback', pathname: '/' }
		});
		expect(result.ogTitle).toBe('OG Title');
	});

	it('builds canonical from pathname', () => {
		const result = resolveSEO({
			fallbacks: { title: 'T', pathname: '/services/foo' }
		});
		expect(result.canonical).toBe(`${SITE_URL}/services/foo`);
	});

	it('canonical is self-referential — homepage keeps its trailing slash (sitemap parity)', () => {
		const result = resolveSEO({ fallbacks: { title: 'T', pathname: '/' } });
		expect(result.canonical).toBe(`${SITE_URL}/`);
	});

	it('defaults ogType to website', () => {
		const result = resolveSEO({ fallbacks: { title: 'T', pathname: '/' } });
		expect(result.ogType).toBe('website');
	});

	it('returns the ogType passed by the caller (e.g. article for blog posts)', () => {
		const result = resolveSEO({
			ogType: 'article',
			fallbacks: { title: 'T', pathname: '/my-post' }
		});
		expect(result.ogType).toBe('article');
	});

	it('converts og_image asset to 1200x630 storyblok URL', () => {
		const result = resolveSEO({
			pageSEO: seoBlok({
				og_image: {
					filename: 'https://a.storyblok.com/f/1/img.jpg',
					alt: 'Hero image',
					copyright: null,
					fieldtype: 'asset',
					id: 1,
					name: 'img',
					title: null,
					focus: null,
					meta_data: {},
					source: null,
					is_external_url: false,
					is_private: false,
					src: '',
					updated_at: '',
					width: null,
					height: null,
					aspect_ratio: null,
					public_id: null,
					content_type: 'image/jpeg'
				}
			}),
			fallbacks: { title: 'T', pathname: '/' }
		});
		expect(result.ogImage?.url).toContain('https://a.storyblok.com/f/1/img.jpg');
		expect(result.ogImage?.url).toContain('1200x630');
		expect(result.ogImage?.width).toBe(1200);
		expect(result.ogImage?.height).toBe(630);
		expect(result.ogImage?.alt).toBe('Hero image');
	});

	it('leaves ogImage undefined when no image is set', () => {
		const result = resolveSEO({ fallbacks: { title: 'T', pathname: '/' } });
		expect(result.ogImage).toBeUndefined();
	});

	it('defaults noIndex and noFollow to false', () => {
		const result = resolveSEO({ fallbacks: { title: 'T', pathname: '/' } });
		expect(result.noIndex).toBe(false);
		expect(result.noFollow).toBe(false);
	});

	it('picks up noIndex and noFollow from page SEO', () => {
		const result = resolveSEO({
			pageSEO: seoBlok({ no_index: true, no_follow: true }),
			fallbacks: { title: 'T', pathname: '/' }
		});
		expect(result.noIndex).toBe(true);
		expect(result.noFollow).toBe(true);
	});

	it('appends extraJsonLd items to jsonLd array', () => {
		const extra = { '@type': 'Organization' };
		const result = resolveSEO({
			fallbacks: { title: 'T', pathname: '/' },
			extraJsonLd: [extra]
		});
		expect(result.jsonLd).toContain(extra);
	});

	it('parses and appends json_structured_data from richtext field', () => {
		const result = resolveSEO({
			pageSEO: seoBlok({
				json_structured_data: {
					type: 'doc',
					content: [
						{
							type: 'paragraph',
							content: [{ type: 'text', text: '{"@type":"WebPage"}' }]
						}
					]
				}
			}),
			fallbacks: { title: 'T', pathname: '/' }
		});
		expect(result.jsonLd).toContainEqual({ '@type': 'WebPage' });
	});

	it('silently drops invalid json_structured_data', () => {
		const result = resolveSEO({
			pageSEO: seoBlok({
				json_structured_data: { type: 'doc', content: [{ type: 'text', text: 'not json' }] }
			}),
			fallbacks: { title: 'T', pathname: '/' }
		});
		expect(result.jsonLd).toHaveLength(0);
	});

	it('omits description when not set anywhere', () => {
		const result = resolveSEO({ fallbacks: { title: 'T', pathname: '/' } });
		expect(result.description).toBeUndefined();
	});
});
