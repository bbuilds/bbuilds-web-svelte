import { apiPlugin, storyblokInit, useStoryblokApi } from '@storyblok/svelte';

export async function load() {
	storyblokInit({
		accessToken: import.meta.env.VITE_STORYBLOK_DELIVERY_API_TOKEN,
		apiOptions: {
			region: 'eu'
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
