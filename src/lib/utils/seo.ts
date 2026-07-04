import type { StoryblokRichtext, StoryblokSEO } from '$lib/types/storyblok';
import type { ResolvedSEO } from '$lib/types/seo';
import { storyblokImageUrl } from './storyblokImage';
import { SITE_URL } from '$lib/config/site';

export type { ResolvedSEO };

interface ResolveSEOArgs {
	pageSEO?: StoryblokSEO;
	globalSEO?: StoryblokSEO;
	fallbacks: {
		title: string;
		description?: string;
		pathname: string;
		ogImagePath?: string;
	};
	ogType?: string;
	extraJsonLd?: object[];
}

export function absoluteUrl(path: string, origin = SITE_URL): string {
	if (/^https?:\/\//i.test(path)) return path;
	return `${origin}${path.startsWith('/') ? path : '/' + path}`;
}

export function resolveSEO({
	pageSEO,
	globalSEO,
	fallbacks,
	ogType = 'website',
	extraJsonLd = []
}: ResolveSEOArgs): ResolvedSEO {
	const metaTitle = pageSEO?.meta_title ?? globalSEO?.meta_title ?? fallbacks.title;
	const ogTitle = pageSEO?.og_title ?? globalSEO?.og_title ?? metaTitle;
	const description =
		pageSEO?.meta_description ?? globalSEO?.meta_description ?? fallbacks.description;

	const rawCanonical = pageSEO?.canonical_url ?? globalSEO?.canonical_url;
	const canonical = rawCanonical ? absoluteUrl(rawCanonical) : absoluteUrl(fallbacks.pathname);

	const rawOgUrl = pageSEO?.og_url ?? globalSEO?.og_url;
	const ogUrl = rawOgUrl ? absoluteUrl(rawOgUrl) : canonical;

	let ogImage: ResolvedSEO['ogImage'];
	const ogImageAsset = pageSEO?.og_image ?? globalSEO?.og_image;
	if (ogImageAsset?.filename) {
		ogImage = {
			url: storyblokImageUrl(ogImageAsset.filename, { width: 1200, height: 630, format: 'jpeg' }),
			width: 1200,
			height: 630,
			alt: ogImageAsset.alt ?? undefined
		};
	} else if (fallbacks.ogImagePath) {
		ogImage = { url: absoluteUrl(fallbacks.ogImagePath), width: 1200, height: 630 };
	}

	const noIndex = pageSEO?.no_index ?? globalSEO?.no_index ?? false;
	const noFollow = pageSEO?.no_follow ?? globalSEO?.no_follow ?? false;

	const extraLd: object[] = [];
	const rawJd = pageSEO?.json_structured_data ?? globalSEO?.json_structured_data;
	if (rawJd) {
		try {
			const jsonStr = extractRichtextText(rawJd);
			if (jsonStr.trim()) {
				const parsed: unknown = JSON.parse(jsonStr);
				if (Array.isArray(parsed)) extraLd.push(...(parsed as object[]));
				else extraLd.push(parsed as object);
			}
		} catch {
			// invalid JSON — drop silently
		}
	}

	return {
		title: metaTitle,
		ogTitle,
		ogType,
		description: description || undefined,
		canonical,
		ogUrl,
		ogImage,
		noIndex,
		noFollow,
		jsonLd: [...extraJsonLd, ...extraLd]
	};
}

function extractRichtextText(rt: StoryblokRichtext): string {
	if (rt.text) return rt.text;
	if (!rt.content) return '';
	return rt.content.map(extractRichtextText).join('');
}
