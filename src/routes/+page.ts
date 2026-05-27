import type { ISbStoryData } from '@storyblok/js';
import type { StoryblokBlogPost, StoryblokHomePage } from '$lib/types/storyblok';
import { resolveSEO } from '$lib/utils/seo';
import { organizationLd, webSiteLd } from '$lib/utils/jsonLd';
import { fetchServiceLinks } from '$lib/utils/services';
import { SITE_NAME } from '$lib/config/site';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, url }) => {
	const { storyblokAPI, version, globals } = await parent();
	const services = await fetchServiceLinks(storyblokAPI, version);
	try {
		const response = await storyblokAPI.get('cdn/stories/home-page', {
			version,
			resolve_relations: ['Home Page.featured_services', 'Article Cards.articles']
		});

		const story: ISbStoryData<StoryblokHomePage> | undefined = response.data.story;
		const block = story?.content?.articles?.[0];
		const explicit = (block?.articles ?? []).filter(
			(a): a is ISbStoryData<StoryblokBlogPost> => typeof a !== 'string'
		);

		let posts: ISbStoryData<StoryblokBlogPost>[] = explicit.slice(0, 3);

		if (posts.length < 3) {
			try {
				const recentResponse = await storyblokAPI.get('cdn/stories', {
					version,
					starts_with: 'posts/',
					sort_by: 'first_published_at:desc',
					per_page: 3,
					is_startpage: false
				});
				const explicitUuids = new Set(explicit.map((s) => s.uuid));
				const recentStories: ISbStoryData<StoryblokBlogPost>[] = recentResponse.data?.stories ?? [];
				const recent = recentStories.filter((s) => !explicitUuids.has(s.uuid));
				posts = [...posts, ...recent].slice(0, 3);
			} catch (e) {
				console.error('Failed to fetch recent posts:', e);
			}
		}

		const seo = resolveSEO({
			pageSEO: story?.content?.seo?.[0],
			globalSEO: globals?.content?.seo?.[0],
			fallbacks: { title: SITE_NAME, pathname: url.pathname },
			extraJsonLd: [organizationLd(services), webSiteLd()]
		});

		return { story, posts, seo };
	} catch (e) {
		console.error(e);
		const seo = resolveSEO({
			globalSEO: globals?.content?.seo?.[0],
			fallbacks: { title: SITE_NAME, pathname: url.pathname },
			extraJsonLd: [organizationLd(services), webSiteLd()]
		});
		return { story: null, posts: [], seo };
	}
};
