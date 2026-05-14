import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const { storyblokAPI, version } = await parent();
	const response = await storyblokAPI.get('cdn/stories/home-page', {
		version
	});

	return {
		story: response.data.story
	};
};
