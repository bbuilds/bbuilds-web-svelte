import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, parent }) => {
	const { storyblokAPI, version } = await parent();

	try {
		const storyResponse = await storyblokAPI.get(`cdn/stories/services/${params.slug}`, {
			version
		});

		const story = storyResponse.data?.story;
		if (!story) error(404, 'Service not found');

		return { story, slug: params.slug };
	} catch (e: unknown) {
		if (e && typeof e === 'object' && 'status' in e) throw e;
		error(404, 'Service not found');
	}
};
