import type { Handle, HandleServerError } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set(
		'Permissions-Policy',
		'camera=(), microphone=(), geolocation=(), browsing-topics=()'
	);
	response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
	return response;
};

export const handleError: HandleServerError = ({ error, event }) => {
	const errorId = crypto.randomUUID();
	console.error(errorId, {
		message: error instanceof Error ? error.message : String(error),
		url: event.url.toString(),
		error
	});
	return { message: 'Something went wrong on our end.', errorId };
};
