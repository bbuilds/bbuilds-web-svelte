import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, parent }) => {
	const { storyblokAPI, version } = await parent();

	try {
		const [storyResponse, linksResponse] = await Promise.all([
			storyblokAPI.get(`cdn/stories/services/${params.slug}`, { version }),
			storyblokAPI.get('cdn/links', { version, starts_with: 'services/' })
		]);

		const story = storyResponse.data?.story;
		if (!story) error(404, 'Service not found');

		const liveSlugs = Object.values(linksResponse.data?.links ?? {}).flatMap((link) =>
			link.is_folder || !link.slug ? [] : [link.slug.replace(/^services\//, '')]
		);

		return { story, slug: params.slug, liveSlugs };
	} catch (e: unknown) {
		if (e && typeof e === 'object' && 'status' in e) throw e;
		error(404, 'Service not found');
	}
};
