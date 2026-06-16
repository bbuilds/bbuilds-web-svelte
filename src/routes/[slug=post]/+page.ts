import { error } from '@sveltejs/kit';
import { initStoryblok } from '$lib/storyblok/client';
import { getStory, getAllStories } from '$lib/storyblok/stories';
import type { StoryblokBlogPost } from '$lib/types/storyblok';
import { resolveSEO } from '$lib/utils/seo';
import { breadcrumbLd } from '$lib/utils/jsonLd';
import { SITE_URL, SITE_NAME, SITE_OG_IMAGE } from '$lib/config/site';
import type { PageLoad } from './$types';

export const entries = async () => {
	const api = initStoryblok();
	const stories = await getAllStories<StoryblokBlogPost>(api, {
		version: 'published',
		starts_with: 'posts/',
		per_page: 100,
		is_startpage: false
	});
	return stories.map((s) => ({ slug: s.slug }));
};

export const load: PageLoad = async ({ params, parent, url }) => {
	const { storyblokAPI, version, globals } = await parent();

	// getStory returns undefined on 404 and rethrows other errors → 500
	const story = await getStory<StoryblokBlogPost>(storyblokAPI, `posts/${params.slug}`, {
		version
	});

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
