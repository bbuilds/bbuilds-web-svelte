import type { ISbStoryData, ISbStoryParams, ISbStoriesParams } from '@storyblok/js';
import type { StoryblokMultilinkLink } from '$lib/types/storyblok';
import type { StoryblokApi } from './client';

export function isNotFound(err: unknown): boolean {
	return typeof err === 'object' && err !== null && 'status' in err && err.status === 404;
}

export async function getStory<C>(
	api: StoryblokApi,
	slug: string,
	params?: ISbStoryParams
): Promise<ISbStoryData<C> | undefined> {
	try {
		const res = await api.getStory(slug, params);
		return res.data.story as ISbStoryData<C>;
	} catch (err) {
		if (isNotFound(err)) return undefined;
		throw err;
	}
}

export async function getStories<C>(
	api: StoryblokApi,
	params: ISbStoriesParams
): Promise<ISbStoryData<C>[]> {
	const res = await api.getStories(params);
	return res.data.stories as ISbStoryData<C>[];
}

export async function getAllStories<C>(
	api: StoryblokApi,
	params: ISbStoriesParams
): Promise<ISbStoryData<C>[]> {
	return (await api.getAll('cdn/stories', params)) as ISbStoryData<C>[];
}

// Subset of the SDK's ISbLinksParams (which `@storyblok/js` doesn't re-export).
// Typed so `api.get('cdn/links', …)` resolves to the typed overload returning
// ISbLinksResult (data: ISbLinks) rather than the untyped `any` overload.
type LinksParams = { version?: 'draft' | 'published'; starts_with?: string };

export async function getLinks(
	api: StoryblokApi,
	params?: LinksParams
): Promise<StoryblokMultilinkLink[]> {
	const res = await api.get('cdn/links', params);
	return Object.values(res.data.links ?? {}) as StoryblokMultilinkLink[];
}

export async function getAllLinks<L = StoryblokMultilinkLink>(
	api: StoryblokApi,
	params?: ISbStoriesParams
): Promise<L[]> {
	return (await api.getAll('cdn/links', params)) as L[];
}
