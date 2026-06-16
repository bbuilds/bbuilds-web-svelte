import { error } from '@sveltejs/kit';
import { initStoryblok } from '$lib/storyblok/client';
import { getStory, getLinks } from '$lib/storyblok/stories';
import type { StoryblokServicesTemplate } from '$lib/types/storyblok';
import { resolveSEO } from '$lib/utils/seo';
import { breadcrumbLd } from '$lib/utils/jsonLd';
import { SITE_URL, SITE_NAME, SITE_OG_IMAGE } from '$lib/config/site';
import type { PageLoad } from './$types';

export const entries = async () => {
	if (!import.meta.env.VITE_STORYBLOK_DELIVERY_API_TOKEN) return [];
	const api = initStoryblok();
	const links = await getLinks(api, { version: 'published', starts_with: 'services/' });
	return links
		.filter((link) => !link.is_folder && link.slug)
		.map((link) => ({ slug: link.slug.replace(/^services\//, '') }));
};

export const load: PageLoad = async ({ params, parent, url }) => {
	const { storyblokAPI, version, globals } = await parent();

	// getStory returns undefined on 404 and rethrows other errors → 500
	const story = await getStory<StoryblokServicesTemplate>(storyblokAPI, `services/${params.slug}`, {
		version
	});

	if (!story) {
		error(404, 'Service not found');
	}

	const seo = resolveSEO({
		pageSEO: story.content?.seo?.[0],
		globalSEO: globals?.content?.seo?.[0],
		fallbacks: {
			title: `${story.name} — ${SITE_NAME}`,
			pathname: url.pathname,
			ogImagePath: SITE_OG_IMAGE
		},
		extraJsonLd: [
			breadcrumbLd([
				{ name: 'Home', url: SITE_URL },
				{ name: 'Services', url: `${SITE_URL}/services` },
				{ name: story.name, url: `${SITE_URL}/services/${params.slug}` }
			])
		]
	});

	return { story, slug: params.slug, seo };
};
