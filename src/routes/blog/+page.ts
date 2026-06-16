import type { StoryblokBlogIndex, StoryblokBlogPost } from '$lib/types/storyblok';
import { resolveSEO } from '$lib/utils/seo';
import { breadcrumbLd } from '$lib/utils/jsonLd';
import { SITE_NAME, SITE_URL, SITE_OG_IMAGE } from '$lib/config/site';
import { getStory, getStories } from '$lib/storyblok/stories';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, url }) => {
	const { storyblokAPI, version, globals } = await parent();

	const [story, posts] = await Promise.all([
		getStory<StoryblokBlogIndex>(storyblokAPI, 'blog', { version }).catch((err: unknown) => {
			console.error('Failed to fetch blog index story:', err);
			return undefined;
		}),
		getStories<StoryblokBlogPost>(storyblokAPI, {
			version,
			starts_with: 'posts/',
			sort_by: 'first_published_at:desc',
			per_page: 100,
			is_startpage: false
		}).catch((err: unknown) => {
			console.error('Failed to fetch blog posts:', err);
			return [];
		})
	]);

	const seo = resolveSEO({
		pageSEO: story?.content?.seo?.[0],
		globalSEO: globals?.content?.seo?.[0],
		fallbacks: {
			title: `Blog — ${SITE_NAME}`,
			description: 'Read articles and posts on web development, SEO, and branding.',
			pathname: url.pathname,
			ogImagePath: SITE_OG_IMAGE
		},
		extraJsonLd: [
			breadcrumbLd([
				{ name: 'Home', url: SITE_URL },
				{ name: 'Blog', url: `${SITE_URL}/blog` }
			])
		]
	});

	return { story: story ?? null, posts, seo };
};
