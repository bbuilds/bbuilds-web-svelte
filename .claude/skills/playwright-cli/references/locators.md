# Locator Order

Always prefer locators in this order — stop at the first one that works:

1. **`getByRole(role, { name })`** — first, always. Mirrors how assistive technology sees the page.
2. **`getByLabel`** — for form inputs with a visible label.
3. **`getByPlaceholder`** — for inputs missing a label (and add the label to fix the accessibility gap).
4. **`getByText`** — for non-interactive text content.
5. **`getByTestId`** — only when 1–4 all fail; justify the choice in the commit message.
6. **`locator(css)`** — never. Banned by `eslint-plugin-playwright/no-raw-locators`.

## Scoping and filtering

Chain locators to scope results:

```ts
page.getByRole('list', { name: 'Blog posts' }).getByRole('listitem').first();
```

Filter without fragile nth-indexing:

```ts
locator.filter({ has: page.getByRole('img') });
locator.filter({ hasText: 'Published' });
locator.and(page.getByRole('button'));
locator.or(page.getByRole('link')).first();
```

Use `nth()` only after `filter()` exhausts options — note it in the commit message.

## When a role query fails

When a `getByRole`/`getByLabel` query matches nothing, Playwright prints the **accessibility tree** it
did see (every role + accessible name) in the failure output. Read it and repair the locator from what's
actually there — a renamed button, a changed heading level, a `name` that's now empty. If the role or
accessible name you need is genuinely missing, the fix is in the **component**: add the accessible name
(label, `aria-label`, alt text). Do **not** fall back to `getByTestId` or `locator(css)` to route around
a missing name — that hides the accessibility gap the query just surfaced.

A `getByRole` suite pressures the app toward accessible markup, but it is **not** an accessibility gate.
Don't claim a11y coverage from a green e2e run.

## `locator.all()` has no auto-waiting

`locator.all()` resolves immediately against whatever is in the DOM at call time — no retry — so it races
the render. To count matches, use the retrying `await expect(locator).toHaveCount(n)`; to operate on the
elements, follow with `locator.evaluateAll(...)`. The bare `.all()` call is banned by `no-restricted-syntax`
([eslint.config.js:127](../../../../eslint.config.js#L127)).

## Readable traces

Name reusable locators so traces read like English:

```ts
const nav = page.getByRole('navigation').describe('primary nav');
const submitBtn = page.getByRole('button', { name: 'Submit' }).describe('submit button');
```
