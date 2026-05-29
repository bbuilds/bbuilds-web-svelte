import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import type { HandleServerError } from '@sveltejs/kit';
import { handleError } from './hooks.server';

type ErrorArgs = Parameters<HandleServerError>[0];

const args = (overrides: Partial<ErrorArgs> = {}): ErrorArgs =>
	({
		error: new Error('boom'),
		event: { url: new URL('https://example.com/broken') },
		status: 500,
		message: 'Internal Error',
		...overrides
	}) as ErrorArgs;

beforeEach(() => {
	vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
	vi.restoreAllMocks();
});

describe('handleError (server)', () => {
	it('returns a safe message and an errorId', () => {
		const result = handleError(args());

		expect(result).toEqual({
			message: 'Something went wrong on our end.',
			errorId: expect.any(String)
		});
	});

	it('returns a unique errorId per call', () => {
		const a = handleError(args());
		const b = handleError(args());

		expect(a?.errorId).not.toBe(b?.errorId);
	});

	it('logs the errorId alongside the error details', () => {
		const result = handleError(args());

		expect(console.error).toHaveBeenCalledWith(
			result?.errorId,
			expect.objectContaining({
				message: 'boom',
				url: 'https://example.com/broken'
			})
		);
	});

	it('stringifies non-Error throwables in the log message', () => {
		handleError(args({ error: 'just a string' }));

		expect(console.error).toHaveBeenCalledWith(
			expect.any(String),
			expect.objectContaining({ message: 'just a string' })
		);
	});
});
