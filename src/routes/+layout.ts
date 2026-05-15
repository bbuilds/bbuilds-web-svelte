import { apiPlugin, storyblokInit, useStoryblokApi } from '@storyblok/svelte';

export async function load() {
	storyblokInit({
		accessToken: import.meta.env.VITE_STORYBLOK_DELIVERY_API_TOKEN,
		apiOptions: {
			region: (import.meta.env.VITE_STORYBLOK_REGION ?? 'eu') as 'eu' | 'us' | 'cn' | 'ca' | 'ap'
		},
		use: [apiPlugin]
	});

	const storyblokAPI = await useStoryblokApi();
	const version: 'draft' | 'published' = import.meta.env.DEV ? 'draft' : 'published';

	return {
		storyblokAPI,
		version
	};
}
