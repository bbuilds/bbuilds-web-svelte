import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Icon from './Icon.svelte';
import { createRawSnippet } from 'svelte';

const pathSnippet = createRawSnippet(() => ({
	render: () => `<path d="M12 2L2 22h20z" />`
}));

describe('Icon', () => {
	it('renders an SVG element', async () => {
		const { container } = await render(Icon, { children: pathSnippet });
		expect(container.querySelector('svg')).not.toBeNull();
	});

	it('has aria-hidden="true"', async () => {
		const { container } = await render(Icon, { children: pathSnippet });
		expect(container.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
	});

	it('uses the default viewBox of 0 0 24 24', async () => {
		const { container } = await render(Icon, { children: pathSnippet });
		expect(container.querySelector('svg')?.getAttribute('viewBox')).toBe('0 0 24 24');
	});

	it('applies a custom viewBox when provided', async () => {
		const { container } = await render(Icon, { children: pathSnippet, viewBox: '0 0 20 20' });
		expect(container.querySelector('svg')?.getAttribute('viewBox')).toBe('0 0 20 20');
	});

	it('applies class prop to the SVG', async () => {
		const { container } = await render(Icon, { children: pathSnippet, class: 'h-5 w-5' });
		const svg = container.querySelector('svg');
		expect(svg?.getAttribute('class')).toContain('h-5');
		expect(svg?.getAttribute('class')).toContain('w-5');
	});

	it('has fill=none and stroke=currentColor', async () => {
		const { container } = await render(Icon, { children: pathSnippet });
		const svg = container.querySelector('svg');
		expect(svg?.getAttribute('fill')).toBe('none');
		expect(svg?.getAttribute('stroke')).toBe('currentColor');
	});

	it('renders children inside the SVG', async () => {
		const { container } = await render(Icon, { children: pathSnippet });
		expect(container.querySelector('svg path')).not.toBeNull();
	});
});
