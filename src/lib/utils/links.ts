import type { StoryblokMultilink } from '$lib/types/storyblok';

const INDEX_SLUG = 'home-page';
const EXTERNAL_URL = /^https?:\/\//i;

export const isExternalUrl = (url: string): boolean => EXTERNAL_URL.test(url);

export interface ResolvedLink {
	href: string;
	target?: '_blank';
	rel?: string;
}

export const resolveMultilink = (
	link: StoryblokMultilink | undefined
): ResolvedLink | undefined => {
	if (!link) return undefined;

	if (link.linktype === 'story') {
		const raw = link.cached_url || link.url;
		if (!raw) return undefined;
		const slug = raw.replace(/^\/+/, '');
		const path = slug === INDEX_SLUG ? '/' : `/${slug}`;
		const href = link.anchor ? `${path}#${link.anchor}` : path;
		return { href };
	}

	if (link.linktype === 'url') {
		const href = link.url || link.cached_url;
		if (!href) return undefined;
		if (isExternalUrl(href)) {
			return { href, target: '_blank', rel: 'noopener noreferrer' };
		}
		return { href };
	}

	return undefined;
};
