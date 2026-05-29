import type { ISbStoryData } from '@storyblok/js';
import type { StoryblokBlogPost } from '$lib/types/storyblok';
import { formatDate, kickerTag } from '$lib/utils/format';

export interface BlogCard {
	key: string;
	tag: string;
	datetime: string;
	date: string;
	effectiveAt: number;
	title: string;
	blurb: string;
	href: string;
	image: StoryblokBlogPost['featured_image'];
	searchHaystack: string;
}

export function toBlogCard(story: ISbStoryData<StoryblokBlogPost>): BlogCard {
	const updated =
		story.content?.updated_date && !isNaN(new Date(story.content.updated_date).getTime())
			? story.content.updated_date
			: undefined;
	const effectiveIso = updated ?? story.first_published_at ?? story.published_at ?? '';
	const tag = kickerTag(story.content?.Category, story.tag_list ?? []);

	return {
		key: story.uuid ?? story.slug,
		tag,
		datetime: effectiveIso,
		date: effectiveIso ? formatDate(effectiveIso) : '',
		effectiveAt: effectiveIso ? new Date(effectiveIso).getTime() : 0,
		title: story.name ?? '',
		blurb: story.content?.summary ?? '',
		href: `/${story.slug}`,
		image: story.content?.featured_image,
		searchHaystack: [story.name ?? '', story.content?.summary ?? '', tag, ...(story.tag_list ?? [])]
			.join(' ')
			.toLowerCase()
	};
}
