import { error } from '@sveltejs/kit';
import { resolveSEO } from '$lib/utils/seo';
import { breadcrumbLd } from '$lib/utils/jsonLd';
import { SITE_URL, SITE_NAME } from '$lib/config/site';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, parent, url }) => {
	const { storyblokAPI, version, globals } = await parent();

	try {
		const storyResponse = await storyblokAPI.get(`cdn/stories/services/${params.slug}`, {
			version
		});

		const story = storyResponse.data?.story;
		if (!story) error(404, 'Service not found');

		const seo = resolveSEO({
			pageSEO: story.content?.seo?.[0],
			globalSEO: globals?.content?.seo?.[0],
			fallbacks: { title: `${story.name} — ${SITE_NAME}`, pathname: url.pathname },
			extraJsonLd: [
				breadcrumbLd([
					{ name: 'Home', url: SITE_URL },
					{ name: 'Services', url: `${SITE_URL}/services` },
					{ name: story.name, url: `${SITE_URL}/services/${params.slug}` }
				])
			]
		});

		return { story, slug: params.slug, seo };
	} catch (e: unknown) {
		if (e && typeof e === 'object' && 'status' in e) throw e;
		error(404, 'Service not found');
	}
};
