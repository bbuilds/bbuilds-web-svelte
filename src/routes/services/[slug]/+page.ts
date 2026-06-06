import { error } from '@sveltejs/kit';
import { apiPlugin, storyblokInit, useStoryblokApi } from '@storyblok/svelte';
import type { StoryblokMultilinkLink } from 'storyblok';
import { resolveSEO } from '$lib/utils/seo';
import { breadcrumbLd } from '$lib/utils/jsonLd';
import { SITE_URL, SITE_NAME, SITE_OG_IMAGE } from '$lib/config/site';
import type { PageLoad } from './$types';

export const entries = async () => {
	storyblokInit({
		accessToken: import.meta.env.VITE_STORYBLOK_DELIVERY_API_TOKEN,
		apiOptions: {
			region: (import.meta.env.VITE_STORYBLOK_REGION ?? 'eu') as 'eu' | 'us' | 'cn' | 'ca' | 'ap'
		},
		use: [apiPlugin]
	});
	const api = useStoryblokApi();
	const response = await api.get('cdn/links', {
		version: 'published',
		starts_with: 'services/'
	});
	const links = Object.values(response.data?.links ?? {}) as StoryblokMultilinkLink[];
	return links
		.filter((link) => !link.is_folder && link.slug)
		.map((link) => ({ slug: link.slug.replace(/^services\//, '') }));
};

export const load: PageLoad = async ({ params, parent, url }) => {
	const { storyblokAPI, version, globals } = await parent();

	const storyResponse = await storyblokAPI
		.get(`cdn/stories/services/${params.slug}`, { version })
		.catch((err: unknown) => {
			// Only swallow Storyblok's real 404; network / 5xx / auth failures
			// must bubble so handleError logs them and SvelteKit returns 500.
			if ((err as { status?: number } | null)?.status === 404) return null;
			throw err;
		});

	const story = storyResponse?.data?.story;
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
