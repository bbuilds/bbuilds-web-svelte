import type { HandleClientError } from '@sveltejs/kit';

export const handleError: HandleClientError = ({ error, event }) => {
	const errorId = crypto.randomUUID();
	console.error(errorId, {
		message: error instanceof Error ? error.message : String(error),
		url: event.url.toString(),
		error
	});
	return { message: 'Something went wrong on our end.', errorId };
};
