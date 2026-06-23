import { test, expect } from './fixtures/diagnostics';

test.describe('Home page', () => {
	test('primary navigation is visible', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('navigation')).toBeVisible();
	});

	test('page has a heading', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
	});

	test('/blog page loads', async ({ page }) => {
		await page.goto('/blog');
		await expect(page).toHaveURL('/blog');
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
	});
});
