import type { ISbStoryData } from '@storyblok/js';
import type { StoryblokBlogPost, StoryblokHomePage } from '$lib/types/storyblok';
import { resolveSEO } from '$lib/utils/seo';
import { organizationLd, webSiteLd } from '$lib/utils/jsonLd';
import { fetchServiceLinks } from '$lib/utils/services';
import { SITE_NAME, SITE_OG_IMAGE } from '$lib/config/site';
import { getStory, getStories } from '$lib/storyblok/stories';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, url }) => {
	const { storyblokAPI, version, globals } = await parent();
	const services = await fetchServiceLinks(storyblokAPI, version);

	const story = await getStory<StoryblokHomePage>(storyblokAPI, 'home-page', {
		version,
		resolve_relations: ['Home Page.featured_services', 'Article Cards.articles']
	}).catch((err: unknown) => {
		console.error('Failed to fetch home-page story:', err);
		return undefined;
	});

	const block = story?.content?.articles?.[0];
	const explicit = (block?.articles ?? []).filter(
		(a): a is ISbStoryData<StoryblokBlogPost> => typeof a !== 'string'
	);

	let posts: ISbStoryData<StoryblokBlogPost>[] = explicit.slice(0, 3);

	if (posts.length < 3) {
		const recent = await getStories<StoryblokBlogPost>(storyblokAPI, {
			version,
			starts_with: 'posts/',
			sort_by: 'published_at:desc',
			per_page: 3,
			is_startpage: false
		}).catch((err: unknown) => {
			console.error('Failed to fetch recent posts:', err);
			return [];
		});

		const effectiveTime = (s: ISbStoryData<StoryblokBlogPost>): number => {
			const updated =
				s.content?.updated_date && !isNaN(new Date(s.content.updated_date).getTime())
					? new Date(s.content.updated_date).getTime()
					: 0;
			const published = new Date(s.first_published_at ?? s.published_at ?? '').getTime() || 0;
			return Math.max(updated, published);
		};

		const explicitUuids = new Set(explicit.map((s) => s.uuid));
		const fillers = recent
			.filter((s) => !explicitUuids.has(s.uuid))
			.sort((a, b) => effectiveTime(b) - effectiveTime(a))
			.slice(0, 3 - posts.length);

		posts = [...posts, ...fillers];
	}

	const seo = resolveSEO({
		pageSEO: story?.content?.seo?.[0],
		globalSEO: globals?.content?.seo?.[0],
		fallbacks: { title: SITE_NAME, pathname: url.pathname, ogImagePath: SITE_OG_IMAGE },
		extraJsonLd: [organizationLd(services), webSiteLd()]
	});

	return { story: story ?? null, posts, seo };
};
