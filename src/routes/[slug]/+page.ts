import { error } from '@sveltejs/kit';
import { getPost } from '$lib/posts';
import { resolveSEO } from '$lib/utils/seo';
import { SITE_NAME } from '$lib/config/site';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params, url }) => {
	const post = getPost(params.slug);
	if (!post) error(404, 'Post not found');

	const seo = resolveSEO({
		fallbacks: {
			title: `${post.name} — ${SITE_NAME}`,
			description: post.content.summary,
			pathname: url.pathname
		}
	});

	return { post, seo };
};
