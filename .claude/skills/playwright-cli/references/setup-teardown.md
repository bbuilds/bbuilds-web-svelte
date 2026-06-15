# Setup / Teardown Projects

This repo currently has **no setup/teardown projects** — there is no auth, no DB, and no storageState needed.

This file documents the patterns for future reference.

## When to use setup/teardown projects

Model as a Playwright `project` (not `beforeAll`) when the work:

- Creates auth sessions / `storageState` (login once, reuse across all tests)
- Seeds a database or test fixtures shared across the suite
- Starts a supporting service (mock API, stub server)
- Captures HAR files for network replay
- Cleans up temp files, external state, or expensive shared resources
- Is a fail-fast prerequisite check (if it fails, skip the whole suite)

## Pattern

```ts
// playwright.config.ts
projects: [
	{ name: 'setup', testMatch: '**/setup.ts', teardown: 'teardown' },
	{ name: 'teardown', testMatch: '**/teardown.ts' },
	{
		name: 'chromium',
		use: { storageState: '.auth/user.json' },
		dependencies: ['setup']
	}
];
```

```ts
// tests/setup.ts
import { test as setup } from '@playwright/test';
setup('authenticate', async ({ page }) => {
	// login, save storageState
	await page.context().storageState({ path: '.auth/user.json' });
});
```

## Notes for this repo (Storyblok SSR)

- Storyblok content is fetched server-side; `page.route` cannot intercept it.
- Full network isolation requires HAR recording (`recordHar`) and replay (`routeFromHAR`).
- When HAR isolation is added, record in a `setup` project; replay in the main project via `use.serviceWorkers = 'block'` + `routeFromHAR`.
