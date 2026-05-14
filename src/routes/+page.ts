import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const { storyblokAPI } = await parent();
	const response = await storyblokAPI.get('cdn/stories/home-page', {
		version: 'draft'
	});

	return {
		story: response.data.story
	};
};
