import type { ISbStoryData } from '@storyblok/js';
import type { StoryblokGlobals } from '$lib/types/storyblok';
import { resolveSEO } from '$lib/utils/seo';
import { SITE_NAME, SITE_OG_IMAGE } from '$lib/config/site';
import { initStoryblok } from '$lib/storyblok/client';
import { getStory } from '$lib/storyblok/stories';
import type { LayoutLoad } from './$types';

export const prerender = true;

export const load: LayoutLoad = async ({ url }) => {
	const storyblokAPI = initStoryblok();
	const version: 'draft' | 'published' = import.meta.env.DEV ? 'draft' : 'published';

	let globals: ISbStoryData<StoryblokGlobals> | null = null;
	try {
		globals = (await getStory<StoryblokGlobals>(storyblokAPI, 'globals', { version })) ?? null;
	} catch (e) {
		console.error('Failed to fetch globals:', e);
	}

	const seo = resolveSEO({
		globalSEO: globals?.content?.seo?.[0],
		fallbacks: { title: SITE_NAME, pathname: url.pathname, ogImagePath: SITE_OG_IMAGE }
	});

	return {
		storyblokAPI,
		version,
		globals,
		seo
	};
};
