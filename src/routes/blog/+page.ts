import type { ISbStoryData } from '@storyblok/js';
import type { StoryblokBlogIndex, StoryblokBlogPost } from '$lib/types/storyblok';
import { resolveSEO } from '$lib/utils/seo';
import { breadcrumbLd } from '$lib/utils/jsonLd';
import { SITE_NAME, SITE_URL } from '$lib/config/site';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, url }) => {
	const { storyblokAPI, version, globals } = await parent();

	const [story, posts] = await Promise.all([
		storyblokAPI
			.get('cdn/stories/blog', { version })
			.then((res) => res.data?.story as ISbStoryData<StoryblokBlogIndex> | undefined)
			.catch((err: unknown) => {
				if ((err as { status?: number } | null)?.status !== 404) {
					console.error('Failed to fetch blog index story:', err);
				}
				return undefined;
			}),
		storyblokAPI
			.get('cdn/stories', {
				version,
				starts_with: 'posts/',
				sort_by: 'first_published_at:desc',
				per_page: 100,
				is_startpage: false
			})
			.then((res) => (res.data?.stories ?? []) as ISbStoryData<StoryblokBlogPost>[])
			.catch((err: unknown) => {
				if ((err as { status?: number } | null)?.status !== 404) {
					console.error('Failed to fetch blog posts:', err);
				}
				return [];
			})
	]);

	const seo = resolveSEO({
		pageSEO: story?.content?.seo?.[0],
		globalSEO: globals?.content?.seo?.[0],
		fallbacks: {
			title: `Blog — ${SITE_NAME}`,
			description: 'Read articles and posts on web development, SEO, and branding.',
			pathname: url.pathname
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
