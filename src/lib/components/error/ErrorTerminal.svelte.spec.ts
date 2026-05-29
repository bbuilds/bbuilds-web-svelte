import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import ErrorTerminal from './ErrorTerminal.svelte';

describe('ErrorTerminal', () => {
	it('exposes the terminal as an image to assistive tech', async () => {
		const { container } = render(ErrorTerminal, { path: '/missing', status: 404 });
		const term = container.querySelector('[role="img"]');

		expect(term?.getAttribute('aria-label')).toBe('Terminal showing a 404 error');
	});

	it('reflects the status in the aria-label', async () => {
		const { container } = render(ErrorTerminal, { path: '/oops', status: 500 });
		const term = container.querySelector('[role="img"]');

		expect(term?.getAttribute('aria-label')).toBe('Terminal showing a 500 error');
	});

	it('types out the requested path', async () => {
		const { container } = render(ErrorTerminal, { path: '/some/missing/page', status: 404 });

		await expect.poll(() => container.textContent).toContain('/some/missing/page');
	});

	it('reports "page not found" for a 404', async () => {
		const { container } = render(ErrorTerminal, { path: '/missing', status: 404 });

		await expect.poll(() => container.textContent).toContain('page not found');
	});

	it('reports "internal server error" for a 500', async () => {
		const { container } = render(ErrorTerminal, { path: '/oops', status: 500 });

		await expect.poll(() => container.textContent).toContain('internal server error');
	});
});
