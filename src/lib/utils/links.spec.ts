import { describe, expect, it } from 'vitest';
import type { StoryblokMultilink } from '$lib/types/storyblok';
import { isExternalUrl, resolveMultilink } from './links';

const storyLink = (overrides: Partial<Extract<StoryblokMultilink, { linktype: 'story' }>> = {}) =>
	({
		fieldtype: 'multilink',
		id: 'id',
		url: '',
		cached_url: '',
		linktype: 'story',
		...overrides
	}) as Extract<StoryblokMultilink, { linktype: 'story' }>;

const urlLink = (overrides: Partial<Extract<StoryblokMultilink, { linktype: 'url' }>> = {}) =>
	({
		fieldtype: 'multilink',
		id: 'id',
		url: '',
		cached_url: '',
		linktype: 'url',
		...overrides
	}) as Extract<StoryblokMultilink, { linktype: 'url' }>;

describe('isExternalUrl', () => {
	it('matches http and https', () => {
		expect(isExternalUrl('http://example.com')).toBe(true);
		expect(isExternalUrl('https://example.com/path')).toBe(true);
		expect(isExternalUrl('HTTPS://EXAMPLE.COM')).toBe(true);
	});

	it('does not match relative or root-relative paths', () => {
		expect(isExternalUrl('/about')).toBe(false);
		expect(isExternalUrl('about')).toBe(false);
		expect(isExternalUrl('#contact')).toBe(false);
		expect(isExternalUrl('mailto:hi@example.com')).toBe(false);
	});
});

describe('resolveMultilink', () => {
	it('returns undefined when link is missing', () => {
		expect(resolveMultilink(undefined)).toBeUndefined();
	});

	describe('story linktype', () => {
		it('prefixes a leading slash on the cached_url slug', () => {
			expect(resolveMultilink(storyLink({ cached_url: 'work/case-study' }))).toEqual({
				href: '/work/case-study'
			});
		});

		it('maps home-page to /', () => {
			expect(resolveMultilink(storyLink({ cached_url: 'home-page' }))).toEqual({ href: '/' });
		});

		it('strips redundant leading slashes from the slug', () => {
			expect(resolveMultilink(storyLink({ cached_url: '/work' }))).toEqual({ href: '/work' });
			expect(resolveMultilink(storyLink({ cached_url: '///work' }))).toEqual({ href: '/work' });
		});

		it('appends the anchor when present', () => {
			expect(resolveMultilink(storyLink({ cached_url: 'home-page', anchor: 'contact' }))).toEqual({
				href: '/#contact'
			});
			expect(resolveMultilink(storyLink({ cached_url: 'work/case-study', anchor: 'top' }))).toEqual(
				{ href: '/work/case-study#top' }
			);
		});

		it('falls back to url when cached_url is empty', () => {
			expect(resolveMultilink(storyLink({ url: 'about' }))).toEqual({ href: '/about' });
		});

		it('returns undefined when both url and cached_url are empty', () => {
			expect(resolveMultilink(storyLink())).toBeUndefined();
		});

		it('does not set target/rel for internal story links', () => {
			const resolved = resolveMultilink(storyLink({ cached_url: 'work' }));
			expect(resolved?.target).toBeUndefined();
			expect(resolved?.rel).toBeUndefined();
		});
	});

	describe('url linktype', () => {
		it('marks external https URLs with target and rel', () => {
			expect(resolveMultilink(urlLink({ url: 'https://example.com' }))).toEqual({
				href: 'https://example.com',
				target: '_blank',
				rel: 'noopener noreferrer'
			});
		});

		it('does not set target/rel for non-http URLs', () => {
			expect(resolveMultilink(urlLink({ url: 'mailto:hi@example.com' }))).toEqual({
				href: 'mailto:hi@example.com'
			});
		});

		it('returns undefined when no url is set', () => {
			expect(resolveMultilink(urlLink())).toBeUndefined();
		});
	});
});
