# Plan: Custom 404 + App-Wide Error Handling

## Context

The app currently has **no error UI and no error hooks**. Data loaders already throw expected
errors (e.g. [`[slug]/+page.ts:21`](src/routes/[slug]/+page.ts#L21) calls `error(404, 'Post not found')`),
but with no `+error.svelte` anywhere, SvelteKit falls back to its unstyled default error page. There
is also no `handleError` hook, so unexpected (500-class) errors are neither logged nor shaped.

We have a finished design at [`llm_docs/brandenbuilds-claude-design/project/404.html`](llm_docs/brandenbuilds-claude-design/project/404.html):
a paper-textured page with a big "404", a sprout growing out of the "0", a hand-scribbled
"didn't compile" headline, action buttons, an animated typed terminal log, and falling-leaf
atmosphere.

**Goal:** a single branded root `+error.svelte` that delivers the full 404 treatment and adapts its
copy for other statuses (500, etc.), plus `handleError` hooks that log unexpected errors to
Cloudflare Workers logs and return a safe, shaped error.

### Key architectural facts

- The root [`+layout.svelte`](src/routes/+layout.svelte) already renders `Header`, `Footer`,
  `BottomNav`, and `Contact`. A root `+error.svelte` renders **inside** this layout, so the error
  page must render **only the central section** — not the nav/footer chrome shown in the design HTML
  (those would duplicate the layout's).
- Design tokens (`--ink`, `--paper`, `--green`, `--yellow`, `.paper-bg`, `.scribble`, `.container`,
  fonts) already exist in [`src/lib/styles/design.css`](src/lib/styles/design.css) — reuse them, do
  not redefine.
- Error pages cannot run a `load`, so SEO/`<title>` must be set from within `+error.svelte`.

## Decisions (confirmed with user)

- **One adaptive page** keyed off `page.status`.
- **Keep animations** (typed terminal + falling leaves), gated behind `prefers-reduced-motion`.
- **handleError logs to CF logs** via `console.error`, returns a safe generic message + error id.

## Files to create / modify

### 1. `src/routes/+error.svelte` (new) — the error page

Reads `import { page } from '$app/state'` for `page.status`, `page.error`, `page.url`.

Renders **only** the `.four04` section from the design (left column + terminal), wrapped so the
layout's existing chrome surrounds it. Two-column responsive grid that collapses on mobile (mirror
the `60rem` breakpoint in the design).

- **Left column:**
  - Eyebrow `meta meta-dot` line — adapt text by status: `Error · route not found` for 404, else
    `Error · something broke`.
  - The big number: render `page.status` (`404`, `500`, …). Keep the sprout SVG growing out of a
    `0` when the status contains one; for statuses without a `0`, place the sprout slot on the last
    digit. Simplest robust approach: render the status string, and show the sprout as a small
    decorative element beside the number rather than coupling it to a specific glyph.
  - Headline: 404 → "This page didn't `compile`." (with `.scribble` underline SVG); other → e.g.
    "Something didn't `compile`." Use a `$derived` map from status → copy.
  - Lead paragraph: status-specific copy (404 = moved/typo; 500 = "something broke on our end").
  - Actions: reuse [`Button.svelte`](src/lib/components/Button.svelte) — `variant="primary"`
    "← back home" → `href="/"`, and `variant="ghost"` "browse the blog" → `href="/blog"`.
    (Note: `Button` appends a `→` arrow span; for the "back home" label, pass label text without a
    leading arrow, or use a neutral label like "home" to avoid a left-arrow + right-arrow clash.)
- **Right column — terminal:** colocated child component (see #2). Pass it `page.url.pathname` and
  `page.status` so the typed log shows the real attempted path.
- **Falling leaves:** colocated child component (see #3).

**SEO / head:** add a `<svelte:head>` with `<title>{status} — … · {SITE_NAME}</title>`
(reuse `SITE_NAME` from [`$lib/config/site`](src/lib/config/site)) and
`<meta name="robots" content="noindex" />`. See #5 for de-duping the layout's `<title>`.

**Sizing rule:** all measurements in `rem` (per project rule) — the design HTML already uses `rem`,
carry that over verbatim into `<style>` blocks / Tailwind arbitrary values.

### 2. `src/lib/components/error/ErrorTerminal.svelte` (new)

Encapsulates the typed terminal log. Props: `path: string`, `status: number`.

- Build the line list (from the design's `lines` array) reactively from `path`/`status`.
- Type the rows out with a Svelte **attachment** (matching the `{@attach}` pattern already used in
  [`Footer.svelte`](src/lib/components/Footer.svelte)) or `onMount`; **guard with
  `window.matchMedia('(prefers-reduced-motion: reduce)')`** — when reduced motion is preferred,
  render all rows immediately with no typing delay.
- Scoped `<style>` ports the `.terminal`, `.terminal-bar`, `.terminal-body`, `.t-*` color classes
  and the blinking caret from the design. Terminal palette is dark (`var(--ink)` bg) — keep as-is.

### 3. `src/lib/components/error/FallingLeaves.svelte` (new)

Ports the falling-leaves atmosphere script.

- Spawn leaves on an interval inside an attachment/`onMount`; **return a cleanup** that clears the
  interval and timeouts (important — error pages can be navigated away from).
- **Bail out entirely under `prefers-reduced-motion: reduce`** and when `document.hidden`.
- `aria-hidden`, `pointer-events:none`, low opacity layer behind content (as in design).

> Colocating #2/#3 under `src/lib/components/error/` keeps `+error.svelte` readable; they're only
> used by the error page but are cleanly separable units.

### 4. `src/hooks.server.ts` (new) + `src/hooks.client.ts` (new) — `handleError`

- `handleError: HandleServerError` / `HandleClientError`:
  - Generate a short `errorId` (e.g. `crypto.randomUUID()`).
  - `console.error(errorId, { message, status, event.url, error })` — surfaces in Cloudflare
    Workers logs (`wrangler tail` / dashboard).
  - Return `{ message: 'Something went wrong on our end.', errorId }` (do **not** leak internals).
- Expected errors thrown via `error()` (like the existing 404) skip `handleError`; only unexpected
  ones are logged — which is exactly what we want.

### 5. `src/app.d.ts` (modify) — shape the error

Add to the `App` namespace:

```ts
interface Error {
	message: string;
	errorId?: string;
}
```

So `+error.svelte` can optionally surface `page.error.errorId` (e.g. small mono line in the terminal
"ref: <id>" for 500s — helpful for support).

### 6. `src/routes/+layout.svelte` (modify) — avoid duplicate `<title>`

The layout renders `<SEO seo={page.data.seo} />`, which emits a `<title>`. On an error page we want
the error component to own the title. Wrap the SEO tag so it's skipped during an error:

```svelte
{#if !page.error}
	<SEO seo={page.data.seo} />
{/if}
```

This leaves `+error.svelte`'s `<svelte:head>` as the single source of `<title>` + robots for error
states, and is a one-line, low-risk change.

## Reuse summary (don't rebuild these)

- [`Button.svelte`](src/lib/components/Button.svelte) — action buttons (`primary` / `ghost`).
- Design tokens + `.paper-bg` / `.scribble` / `.container` from [`design.css`](src/lib/styles/design.css).
- `SITE_NAME` from [`$lib/config/site`](src/lib/config/site).
- The `{@attach}` lifecycle + reduced-motion pattern already proven in
  [`Footer.svelte`](src/lib/components/Footer.svelte).

## Svelte 5 / project conventions

- Runes mode is forced — use `$props`, `$derived`, `$state` only; no Options API.
- Run the **Svelte MCP `svelte-autofixer`** on every new `.svelte` file until clean (per CLAUDE.md),
  and prefer the `svelte-file-editor` agent / `svelte` skill while writing them.
- `rem` everywhere — no `px`.

## Verification

1. `npm run dev`, then visit a non-existent route (e.g. `/this-does-not-exist`) → expect the branded
   404 with the attempted path echoed in the terminal, working home/blog buttons, single correct
   `<title>` (no duplicate), and `robots: noindex` in the document head.
2. Visit a real-but-missing blog post (`/some-missing-slug`) → the existing `error(404, …)` should now
   render the same branded page.
3. Temporarily throw an unexpected error in a `load` (locally) → confirm the page shows the 500-variant
   copy and `console.error` logs the `errorId`; revert the throw.
4. Verify `prefers-reduced-motion: reduce` (DevTools rendering emulation) disables typing + leaves and
   the page is fully readable/static.
5. `npm run check` (types incl. `App.Error`), `npm run lint`, and `npm run build` (Cloudflare adapter)
   all pass. Optionally `npm run preview` and re-check the 404 against the production build.
