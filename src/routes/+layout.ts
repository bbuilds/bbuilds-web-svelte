import { apiPlugin, storyblokInit, useStoryblokApi } from '@storyblok/svelte';
import type { ISbStoryData } from '@storyblok/js';
import type { StoryblokGlobals } from '$lib/types/storyblok';
import { resolveSEO } from '$lib/utils/seo';
import { SITE_NAME } from '$lib/config/site';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ url }) => {
	storyblokInit({
		accessToken: import.meta.env.VITE_STORYBLOK_DELIVERY_API_TOKEN,
		apiOptions: {
			region: (import.meta.env.VITE_STORYBLOK_REGION ?? 'eu') as 'eu' | 'us' | 'cn' | 'ca' | 'ap'
		},
		use: [apiPlugin]
	});

	const storyblokAPI = await useStoryblokApi();
	const version: 'draft' | 'published' = import.meta.env.DEV ? 'draft' : 'published';

	let globals: ISbStoryData<StoryblokGlobals> | null = null;
	try {
		const response = await storyblokAPI.get('cdn/stories/globals', { version });
		globals = response.data?.story ?? null;
	} catch (e) {
		console.error('Failed to fetch globals:', e);
	}

	const seo = resolveSEO({
		globalSEO: globals?.content?.seo?.[0],
		fallbacks: { title: SITE_NAME, pathname: url.pathname }
	});

	return {
		storyblokAPI,
		version,
		globals,
		seo
	};
};
