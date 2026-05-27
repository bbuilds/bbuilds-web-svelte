import type { StoryblokMultilinkLink } from 'storyblok';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent }) => {
	const { storyblokAPI, version } = await parent();

	let liveSlugs: string[] = [];
	try {
		const linksResponse = await storyblokAPI.get('cdn/links', {
			version,
			starts_with: 'services/'
		});
		liveSlugs = (
			Object.values(linksResponse.data?.links ?? {}) as StoryblokMultilinkLink[]
		).flatMap((link) =>
			link.is_folder || !link.slug ? [] : [link.slug.replace(/^services\//, '')]
		);
	} catch {
		// non-fatal — nav just won't highlight the current service
	}

	return { liveSlugs };
};
