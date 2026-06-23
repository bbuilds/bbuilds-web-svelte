# Waiting Rules

## Never use

| Anti-pattern                                   | Reason                                                                                                                                                                                                         |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `page.waitForTimeout(ms)`                      | Banned by `no-wait-for-timeout` — always hides a real assertion gap                                                                                                                                            |
| `page.waitForLoadState('networkidle')`         | Banned by `no-networkidle` — arbitrary, brittle                                                                                                                                                                |
| `await locator.isVisible()` in an `if`         | Boolean probe is not auto-retrying — use `expect(locator).toBeVisible()`                                                                                                                                       |
| `page.waitForSelector`                         | Replace with `expect(page.locator(…)).toBeVisible()`                                                                                                                                                           |
| `expect(await locator.isVisible()).toBe(true)` | Resolves the boolean once, no retry — use `await expect(locator).toBeVisible()`. **Already enforced** by `playwright/prefer-web-first-assertions` ([eslint.config.js:125](../../../../eslint.config.js#L125)). |

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

**Set up request/response watchers before the action** — match on URL **and** method with a predicate, not a bare string (a bare string also matches the wrong verb):

```ts
const responsePromise = page.waitForResponse(
	(res) => res.url().endsWith('/api/posts') && res.request().method() === 'POST'
);
await page.getByRole('button', { name: 'Load more' }).click();
await responsePromise;
```

If the UI already exposes the end state (a new row, a count, a toast), prefer a locator assertion over a network wait — assert what the user sees, not the transport.

**Actionability check without acting (`trial: true`):**

```ts
await page.getByRole('button').click({ trial: true }); // confirms clickable, doesn't click
```

**Explicit polling for non-locator state** — `poll()` when one value settles; `toPass()` when a whole block of assertions must rerun together:

```ts
await expect.poll(() => fetchStatus()).toBe('done'); // re-evaluates one value until it matches
await expect(async () => {
	// reruns the entire block until it passes
	const order = await api.getOrder(id);
	expect(order.status).toBe('shipped');
	expect(order.tracking).toBeTruthy();
}).toPass({ timeout: 5000 });
```

> `toPass()` with **no args defaults to a 0 ms timeout** — it runs the block once and never retries. Always pass an explicit `{ timeout }`. The no-arg form is banned by `no-restricted-syntax` ([eslint.config.js:127](../../../../eslint.config.js#L127)).

**Clock control for time-driven UI** — pin the clock with `setFixedTime`, or install it and advance time to trigger timers (toast auto-dismiss, polling intervals):

```ts
// Pin "now" so date-dependent UI renders deterministically:
await page.clock.setFixedTime(new Date('2026-01-01'));

// Install, then fast-forward to fire timers without real waiting:
await page.clock.install();
await page.getByRole('button', { name: 'Save' }).click();
await expect(page.getByRole('status')).toHaveText('Saved');
await page.clock.fastForward('03'); // advance 3 seconds → toast auto-dismisses
await expect(page.getByRole('status')).toBeHidden();
```

## Diagnosing flakiness

Flakiness means the assertion does not match the real end state. Find what the UI actually does when the action completes and assert that — don't add a wait.
