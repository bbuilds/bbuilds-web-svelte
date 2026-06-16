import type { StoryblokApi } from '$lib/storyblok/client';
import { getLinks } from '$lib/storyblok/stories';

export interface ServiceLink {
	name: string;
	/** Full Storyblok slug, e.g. "services/engineering". */
	slug: string;
}

export async function fetchServiceLinks(
	api: StoryblokApi,
	version: 'draft' | 'published'
): Promise<ServiceLink[]> {
	try {
		const links = await getLinks(api, { version, starts_with: 'services/' });
		return links
			.filter((link) => !link.is_folder && !!link.slug)
			.sort((a, b) => a.position - b.position)
			.map((link) => ({ name: link.name, slug: link.slug }));
	} catch (e) {
		console.error('Failed to fetch service links:', e);
		return [];
	}
}
