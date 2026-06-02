import { describe, expect, it, vi, afterEach } from 'vitest';
import { prefersReducedMotion } from './motion';

afterEach(() => {
	vi.restoreAllMocks();
});

describe('prefersReducedMotion', () => {
	it('returns false when window is undefined (SSR guard)', () => {
		const orig = globalThis.window;
		// @ts-expect-error simulate SSR
		delete globalThis.window;
		expect(prefersReducedMotion()).toBe(false);
		globalThis.window = orig;
	});

	it('returns true when matchMedia reports reduce', () => {
		vi.stubGlobal('window', {
			matchMedia: (query: string) => ({
				matches: query === '(prefers-reduced-motion: reduce)',
				media: query
			})
		});
		expect(prefersReducedMotion()).toBe(true);
	});

	it('returns false when matchMedia reports no preference', () => {
		vi.stubGlobal('window', {
			matchMedia: () => ({ matches: false })
		});
		expect(prefersReducedMotion()).toBe(false);
	});
});
