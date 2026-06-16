import { apiPlugin, storyblokInit, useStoryblokApi } from '@storyblok/svelte';

export type StoryblokApi = ReturnType<typeof useStoryblokApi>;

export function initStoryblok(): StoryblokApi {
	storyblokInit({
		accessToken: import.meta.env.VITE_STORYBLOK_DELIVERY_API_TOKEN,
		apiOptions: {
			region: import.meta.env.VITE_STORYBLOK_REGION ?? 'eu'
		},
		use: [apiPlugin]
	});
	return useStoryblokApi();
}
