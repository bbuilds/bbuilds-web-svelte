import { test, expect } from '@playwright/test';

test.describe('Site navigation', () => {
	test('skip link is the first focusable element and targets main content', async ({ page }) => {
		await page.goto('/');

		const skipLink = page.getByRole('link', { name: 'Skip to content' });
		await expect(skipLink).toHaveAttribute('href', '#main-content');

		await page.keyboard.press('Tab');
		await expect(skipLink).toBeFocused();
	});

	test('header exposes the primary nav links', async ({ page }) => {
		await page.goto('/');

		const header = page.getByRole('navigation').first();
		await expect(header.getByRole('link', { name: 'Branden Builds' })).toHaveAttribute('href', '/');
		await expect(header.getByRole('link', { name: 'services' })).toHaveAttribute(
			'href',
			'/#services'
		);
		await expect(header.getByRole('link', { name: 'process' })).toHaveAttribute(
			'href',
			'/#process'
		);
		await expect(header.getByRole('link', { name: 'blog' })).toHaveAttribute('href', '/#blog');
		await expect(header.getByRole('link', { name: 'contact' })).toHaveAttribute(
			'href',
			'#contact-modal'
		);
	});

	test('mobile bottom nav is shown on small viewports', async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await page.goto('/');

		const mobileNav = page.getByRole('navigation', { name: 'Mobile navigation' });
		await expect(mobileNav).toBeVisible();
		await expect(mobileNav.getByRole('link', { name: 'Services' })).toHaveAttribute(
			'href',
			'/#services'
		);
		await expect(mobileNav.getByRole('link', { name: 'Contact' })).toHaveAttribute(
			'href',
			'#contact-modal'
		);
	});
});
