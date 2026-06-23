import { test, expect } from './fixtures/diagnostics';

test.describe('404 page', () => {
	test('unknown route renders the not-found page', async ({ page }) => {
		const response = await page.goto('/this-route-does-not-exist');

		expect(response?.status()).toBe(404);
		await expect(page).toHaveTitle(/404/);
		await expect(page.getByRole('heading', { level: 1 })).toContainText('page not found');
	});

	test('not-found page links back home', async ({ page }) => {
		await page.goto('/this-route-does-not-exist');

		await page.getByRole('link', { name: 'home', exact: true }).click();
		await expect(page).toHaveURL('/');
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
	});

	test('not-found page links to the blog', async ({ page }) => {
		await page.goto('/this-route-does-not-exist');

		await page.getByRole('link', { name: 'browse the blog' }).click();
		await expect(page).toHaveURL('/blog');
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
	});
});
