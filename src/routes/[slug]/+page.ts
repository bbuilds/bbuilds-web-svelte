import { error } from '@sveltejs/kit';
import { resolveSEO } from '$lib/utils/seo';
import { breadcrumbLd } from '$lib/utils/jsonLd';
import { SITE_URL, SITE_NAME, SITE_OG_IMAGE } from '$lib/config/site';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, parent, url }) => {
	const { storyblokAPI, version, globals } = await parent();

	const storyResponse = await storyblokAPI
		.get(`cdn/stories/posts/${params.slug}`, { version })
		.catch((err: unknown) => {
			// Only swallow Storyblok's real 404; network / 5xx / auth failures
			// must bubble so handleError logs them and SvelteKit returns 500.
			if ((err as { status?: number } | null)?.status === 404) return null;
			throw err;
		});

	const story = storyResponse?.data?.story;
	if (!story) {
		error(404, 'Post not found');
	}

	const seo = resolveSEO({
		pageSEO: story.content?.seo?.[0],
		globalSEO: globals?.content?.seo?.[0],
		fallbacks: {
			title: `${story.name} — ${SITE_NAME}`,
			description: story.content?.summary,
			pathname: url.pathname,
			ogImagePath: SITE_OG_IMAGE
		},
		extraJsonLd: [
			breadcrumbLd([
				{ name: 'Home', url: SITE_URL },
				{ name: 'Blog', url: `${SITE_URL}/#blog` },
				{ name: story.name, url: new URL(url.pathname, SITE_URL).href }
			])
		]
	});

	return { story, seo };
};
