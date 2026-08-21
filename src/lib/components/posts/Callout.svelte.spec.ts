import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Callout from './Callout.svelte';

describe('Callout', () => {
	it('renders with role="note"', async () => {
		const { container } = await render(Callout, { callout_type: 'info' });
		expect(container.querySelector('[role="note"]')).not.toBeNull();
	});

	describe('info variant', () => {
		it('renders label "Note"', async () => {
			const { container } = await render(Callout, { callout_type: 'info' });
			expect(container.textContent).toContain('Note');
		});
	});

	describe('warning variant', () => {
		it('renders label "Heads up"', async () => {
			const { container } = await render(Callout, { callout_type: 'warning' });
			expect(container.textContent).toContain('Heads up');
		});

		it('renders with role="note"', async () => {
			const { container } = await render(Callout, { callout_type: 'warning' });
			expect(container.querySelector('[role="note"]')).not.toBeNull();
		});
	});

	describe('success variant', () => {
		it('renders label "Pro tip"', async () => {
			const { container } = await render(Callout, { callout_type: 'success' });
			expect(container.textContent).toContain('Pro tip');
		});

		it('renders with role="note"', async () => {
			const { container } = await render(Callout, { callout_type: 'success' });
			expect(container.querySelector('[role="note"]')).not.toBeNull();
		});
	});

	describe('fallback', () => {
		it('renders "Note" label when callout_type is empty string', async () => {
			const { container } = await render(Callout, { callout_type: '' });
			expect(container.textContent).toContain('Note');
		});

		it('renders "Note" label when callout_type is undefined', async () => {
			const { container } = await render(Callout, {});
			expect(container.textContent).toContain('Note');
		});
	});
});
