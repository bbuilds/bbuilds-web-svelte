import { useStoryblokApi } from '@storyblok/svelte';
import type { StoryblokMultilinkLink } from '$lib/types/storyblok';

type StoryblokApi = Awaited<ReturnType<typeof useStoryblokApi>>;

export interface ServiceLink {
	name: string;
	/** Full Storyblok slug, e.g. "services/engineering". */
	slug: string;
}

/**
 * Fetches the live service stories from Storyblok (name + slug), ordered by
 * their position in the `services/` folder. Folders and slugless entries are
 * skipped. Returns `[]` if the links endpoint is unavailable so callers can
 * degrade gracefully.
 */
export async function fetchServiceLinks(
	api: StoryblokApi,
	version: 'draft' | 'published'
): Promise<ServiceLink[]> {
	try {
		const response = await api.get('cdn/links', { version, starts_with: 'services/' });
		const links = Object.values(response.data?.links ?? {}) as StoryblokMultilinkLink[];
		return links
			.filter((link) => !link.is_folder && link.slug)
			.sort((a, b) => a.position - b.position)
			.map((link) => ({ name: link.name, slug: link.slug }));
	} catch (e) {
		console.error('Failed to fetch service links:', e);
		return [];
	}
}
