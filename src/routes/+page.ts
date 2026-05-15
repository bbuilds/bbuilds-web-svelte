import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const { storyblokAPI, version } = await parent();
	try {
		const response = await storyblokAPI.get('cdn/stories/home-page', { version });
		return { story: response.data.story };
	} catch (e) {
		console.error(e);
		return { story: null };
	}
};
