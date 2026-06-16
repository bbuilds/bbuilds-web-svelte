import { getLinks } from '$lib/storyblok/stories';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent }) => {
	const { storyblokAPI, version } = await parent();

	let liveSlugs: string[] = [];
	try {
		const links = await getLinks(storyblokAPI, { version, starts_with: 'services/' });
		liveSlugs = links.flatMap((link) =>
			link.is_folder || !link.slug ? [] : [link.slug.replace(/^services\//, '')]
		);
	} catch {
		// non-fatal — nav just won't highlight the current service
	}

	return { liveSlugs };
};
