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

## Readable traces

Name reusable locators so traces read like English:

```ts
const nav = page.getByRole('navigation').describe('primary nav');
const submitBtn = page.getByRole('button', { name: 'Submit' }).describe('submit button');
```
