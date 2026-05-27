import { error } from '@sveltejs/kit';
import { resolveSEO } from '$lib/utils/seo';
import { breadcrumbLd } from '$lib/utils/jsonLd';
import { SITE_URL, SITE_NAME } from '$lib/config/site';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, parent, url }) => {
	const { storyblokAPI, version, globals } = await parent();

	try {
		const storyResponse = await storyblokAPI.get(`cdn/stories/posts/${params.slug}`, {
			version
		});

		const story = storyResponse.data?.story;
		if (!story) error(404, 'Post not found');

		const seo = resolveSEO({
			pageSEO: story.content?.seo?.[0],
			globalSEO: globals?.content?.seo?.[0],
			fallbacks: {
				title: `${story.name} — ${SITE_NAME}`,
				description: story.content?.summary,
				pathname: url.pathname
			},
			extraJsonLd: [
				breadcrumbLd([
					{ name: 'Home', url: SITE_URL },
					{ name: 'Blog', url: `${SITE_URL}/#blog` },
					{ name: story.name, url: `${SITE_URL}${url.pathname}` }
				])
			]
		});

		return { story, seo };
	} catch (e: unknown) {
		if (e && typeof e === 'object' && 'status' in e) throw e;
		error(404, 'Post not found');
	}
};
