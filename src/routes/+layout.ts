import { apiPlugin, storyblokInit, useStoryblokApi } from '@storyblok/svelte';
import type { ISbStoryData } from '@storyblok/js';
import type { StoryblokGlobals } from '$lib/types/storyblok';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
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

	return {
		storyblokAPI,
		version,
		globals
	};
};
