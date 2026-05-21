import { error } from '@sveltejs/kit';
import { getService } from '$lib/services';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const service = getService(params.slug);
	if (!service) error(404, 'Service not found');
	return { service };
};
