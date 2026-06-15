# Waiting Rules

## Never use

| Anti-pattern                           | Reason                                                                   |
| -------------------------------------- | ------------------------------------------------------------------------ |
| `page.waitForTimeout(ms)`              | Banned by `no-wait-for-timeout` — always hides a real assertion gap      |
| `page.waitForLoadState('networkidle')` | Banned by `no-networkidle` — arbitrary, brittle                          |
| `await locator.isVisible()` in an `if` | Boolean probe is not auto-retrying — use `expect(locator).toBeVisible()` |
| `page.waitForSelector`                 | Replace with `expect(page.locator(…)).toBeVisible()`                     |

## Always use

**Auto-retrying expect assertions** — these poll until the condition is true or the timeout elapses:

```ts
await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
await expect(page.getByRole('button', { name: 'Submit' })).toBeEnabled();
await expect(page).toHaveURL('/blog');
```

**`fill()` over `pressSequentially()`** — fills instantly, no timing issues:

```ts
await page.getByLabel('Search').fill('svelte');
```

**Set up request/response watchers before the action:**

```ts
const responsePromise = page.waitForResponse('/api/posts');
await page.getByRole('button', { name: 'Load more' }).click();
await responsePromise;
```

**Actionability check without acting (`trial: true`):**

```ts
await page.getByRole('button').click({ trial: true }); // confirms clickable, doesn't click
```

**Explicit polling for non-locator state:**

```ts
await expect.poll(() => fetchStatus()).toBe('done');
await expect(async () => { ... }).toPass({ timeout: 5000 });
```

**Clock control for time-driven UI:**

```ts
await page.clock.setFixedTime(new Date('2026-01-01'));
```

## Diagnosing flakiness

Flakiness means the assertion does not match the real end state. Find what the UI actually does when the action completes and assert that — don't add a wait.
