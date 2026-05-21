import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import ScribbleUnderline from './ScribbleUnderline.svelte';

describe('ScribbleUnderline', () => {
	it('renders an svg element', async () => {
		const { container } = render(ScribbleUnderline);
		expect(container.querySelector('svg')).not.toBeNull();
	});

	it('thin variant uses 200x14 viewBox', async () => {
		const { container } = render(ScribbleUnderline, { variant: 'thin' });
		const svg = container.querySelector('svg');
		expect(svg?.getAttribute('viewBox')).toBe('0 0 200 14');
	});

	it('thick variant uses 200x22 viewBox', async () => {
		const { container } = render(ScribbleUnderline, { variant: 'thick' });
		const svg = container.querySelector('svg');
		expect(svg?.getAttribute('viewBox')).toBe('0 0 200 22');
	});

	it('color prop drives the stroke attribute on the path', async () => {
		const { container } = render(ScribbleUnderline, { color: 'red' });
		const path = container.querySelector('path');
		expect(path?.getAttribute('stroke')).toBe('red');
	});

	it('defaults to var(--yellow) stroke color', async () => {
		const { container } = render(ScribbleUnderline);
		const path = container.querySelector('path');
		expect(path?.getAttribute('stroke')).toBe('var(--yellow)');
	});
});
