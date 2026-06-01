import { page } from 'vitest/browser';
import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { banner } from '$lib/state/banner.svelte';
import SuccessBanner from './SuccessBanner.svelte';

describe('SuccessBanner', () => {
	beforeEach(() => {
		banner.dismiss();
	});

	afterEach(() => {
		banner.dismiss();
		vi.restoreAllMocks();
	});

	it('is not visible when banner.visible is false', () => {
		const { container } = render(SuccessBanner);
		const wrap = container.querySelector('[role="status"]') as HTMLElement;
		expect(wrap).not.toBeNull();
		expect(wrap.classList.contains('visible')).toBe(false);
	});

	it('becomes visible and shows message after banner.success()', async () => {
		render(SuccessBanner);
		banner.success('All done!');
		await expect.element(page.getByText('All done!')).toBeInTheDocument();
		const wrap = document.querySelector('[role="status"]') as HTMLElement;
		expect(wrap.classList.contains('visible')).toBe(true);
	});

	it('has role="status", aria-live="polite", aria-atomic="true"', () => {
		const { container } = render(SuccessBanner);
		const el = container.querySelector('[role="status"]');
		expect(el?.getAttribute('aria-live')).toBe('polite');
		expect(el?.getAttribute('aria-atomic')).toBe('true');
	});

	it('dismiss button calls banner.dismiss()', async () => {
		render(SuccessBanner);
		banner.success('Test message');
		await expect.element(page.getByText('Test message')).toBeInTheDocument();
		await page.getByRole('button', { name: 'Dismiss' }).click();
		const wrap = document.querySelector('[role="status"]') as HTMLElement;
		expect(wrap.classList.contains('visible')).toBe(false);
	});

	it('is visible immediately after banner.success() and hidden after banner.dismiss()', async () => {
		render(SuccessBanner);
		banner.success('Roundtrip');
		await expect.element(page.getByText('Roundtrip')).toBeInTheDocument();
		banner.dismiss();
		expect(banner.visible).toBe(false);
	});

	it('Escape key dismisses the banner', async () => {
		render(SuccessBanner);
		banner.success('Press Escape');
		await expect.element(page.getByText('Press Escape')).toBeInTheDocument();
		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
		expect(banner.visible).toBe(false);
	});
});
