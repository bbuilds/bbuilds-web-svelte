import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import type { HandleClientError } from '@sveltejs/kit';
import { handleError } from './hooks.client';

type ErrorArgs = Parameters<HandleClientError>[0];

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

describe('handleError (client)', () => {
	it('returns a safe message and an errorId', () => {
		const result = handleError(args()) as App.Error;

		expect(result).toEqual({
			message: 'Something went wrong on our end.',
			errorId: expect.any(String) as string
		});
	});

	it('returns a unique errorId per call', () => {
		const a = handleError(args()) as App.Error;
		const b = handleError(args()) as App.Error;

		expect(a?.errorId).not.toBe(b?.errorId);
	});

	it('logs the errorId alongside the error details', () => {
		const result = handleError(args()) as App.Error;

		expect(console.error).toHaveBeenCalledWith(
			result.errorId,
			expect.objectContaining({
				message: 'boom',
				url: 'https://example.com/broken'
			})
		);
	});

	it('stringifies non-Error throwables in the log message', async () => {
		await handleError(args({ error: { weird: true } }));

		expect(console.error).toHaveBeenCalledWith(
			expect.any(String) as string,
			expect.objectContaining({ message: '[object Object]' })
		);
	});
});
