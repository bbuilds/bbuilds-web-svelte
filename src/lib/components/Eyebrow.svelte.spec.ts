import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Eyebrow from './Eyebrow.svelte';

describe('Eyebrow', () => {
	it('renders text prop as content', async () => {
		await render(Eyebrow, { text: 'services' });
		await expect.element(page.getByText('services')).toBeInTheDocument();
	});

	it('prepends // when prefix=true', async () => {
		await render(Eyebrow, { text: 'services', prefix: true });
		await expect.element(page.getByText('// services')).toBeInTheDocument();
	});

	it('does not prepend // when prefix=false (default)', async () => {
		await render(Eyebrow, { text: 'services' });
		const text = document.body.textContent ?? '';
		expect(text).not.toContain('// services');
	});

	it('applies text-muted class for light tone (default)', async () => {
		const { container } = await render(Eyebrow, { text: 'label' });
		const div = container.querySelector('div');
		expect(div?.className).toContain('text-muted');
		expect(div?.className).not.toContain('text-muted-dark');
	});

	it('applies text-muted-dark class for dark tone', async () => {
		const { container } = await render(Eyebrow, { text: 'label', tone: 'dark' });
		const div = container.querySelector('div');
		expect(div?.className).toContain('text-muted-dark');
	});

	it('forwards extra class to the wrapper div', async () => {
		const { container } = await render(Eyebrow, { text: 'label', class: 'text-sm mb-4' });
		const div = container.querySelector('div');
		expect(div?.className).toContain('text-sm');
		expect(div?.className).toContain('mb-4');
	});

	it('renders nothing when neither text nor children are provided', async () => {
		const { container } = await render(Eyebrow);
		const div = container.querySelector('div');
		expect(div?.textContent?.trim()).toBe('');
	});
});
