# Plan: Add CSP & Security Headers

## Context

The app ([hooks.server.ts](src/hooks.server.ts)) defines `handleError` but no `handle` hook, so
responses ship with **no security headers** — no CSP, `X-Content-Type-Options`,
`Referrer-Policy`, `Permissions-Policy`, or frame protection. This is a high-value, low-effort
hardening for launch.

We'll split the work the way SvelteKit intends:

- **CSP** goes in `svelte.config.js` (`kit.csp`). SvelteKit then automatically adds a per-request
  nonce/hash to its **own** inline hydration scripts, so we can keep `script-src` strict without
  `'unsafe-inline'`. Verified in `node_modules/@sveltejs/kit/src/runtime/server/page/csp.js`:
  SvelteKit skips adding hashes when a directive already contains `'unsafe-inline'` — so our
  `style-src` (which keeps `'unsafe-inline'`) is left alone while `script-src` gets hashed.
- **All other headers** go in a new `handle` hook in `hooks.server.ts` (applies to every
  SvelteKit-rendered HTML/API response).

Decisions confirmed with user: **strict `script-src`** (refactor GA to drop its inline script) and
**enforce immediately** (not report-only).

## External resources mapped (drives the allowlist)

| Resource                                                                                               | Host                                                                                                   | Directive                              |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ | -------------------------------------- |
| Google Fonts CSS                                                                                       | `https://fonts.googleapis.com`                                                                         | `style-src`                            |
| Google Fonts files                                                                                     | `https://fonts.gstatic.com`                                                                            | `font-src`                             |
| GA / gtag.js                                                                                           | `https://www.googletagmanager.com`                                                                     | `script-src`, `img-src`, `connect-src` |
| GA collect/beacons                                                                                     | `https://www.google-analytics.com`, `https://*.google-analytics.com`, `https://*.analytics.google.com` | `connect-src`, `img-src`               |
| Storyblok CDN API (client-side `+layout.ts` load)                                                      | `https://api.storyblok.com` (adjust if `VITE_STORYBLOK_REGION` ≠ `eu`, e.g. `api-us.storyblok.com`)    | `connect-src`                          |
| Storyblok images                                                                                       | `https://a.storyblok.com`                                                                              | `img-src`                              |
| Formspree (contact form `fetch`, [ContactModal.svelte:93](src/lib/components/ContactModal.svelte#L93)) | `https://formspree.io`                                                                                 | `connect-src`                          |

JSON-LD blocks in [SEO.svelte](src/lib/components/SEO.svelte) are `type="application/ld+json"`
(non-executable data) and are **not** subject to `script-src` — no change needed.

## Step 1 — Refactor GA to remove the inline script

File: [src/lib/components/Analytics.svelte](src/lib/components/Analytics.svelte)

Currently emits an inline `{@html}` `<script>` for gtag init — this would be blocked by a strict
`script-src`. Keep the external `<script async src=…googletagmanager…>` (allowed by host), but move
the init into client-side component JS so there's no inline `<script>` element:

```svelte
<script lang="ts">
	let { gaId }: { gaId?: string } = $props();

	$effect(() => {
		if (!gaId) return;
		window.dataLayer = window.dataLayer || [];
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		function gtag(...args: any[]) {
			window.dataLayer.push(args);
		}
		gtag('js', new Date());
		gtag('config', gaId);
	});
</script>

<svelte:head>
	{#if gaId}
		<script async src="https://www.googletagmanager.com/gtag/js?id={gaId}"></script>
	{/if}
</svelte:head>
```

- `dataLayer` is typed via a `declare global { interface Window { dataLayer: unknown[]; } }` block
  (add to the component or `src/app.d.ts`) to satisfy `npm run check`.
- Note GA's canonical snippet uses `gtag(){dataLayer.push(arguments)}`; the rest-args form above is
  the lint/TS-friendly equivalent. Run the Svelte autofixer / MCP check on the final component.
- Follow project rule: no `as` assertions (prefer annotations/guards) per
  [feedback_annotations_over_assertions]; no `px` (n/a here).

## Step 2 — Add CSP to `svelte.config.js`

File: [svelte.config.js](svelte.config.js) — add `csp` under `kit`:

```js
kit: {
	adapter: adapter(),
	csp: {
		mode: 'auto', // hashes for prerendered, nonces for SSR (this app is dynamic SSR)
		directives: {
			'default-src': ['self'],
			'script-src': ['self', 'https://www.googletagmanager.com'],
			'style-src': ['self', 'unsafe-inline', 'https://fonts.googleapis.com'],
			'font-src': ['self', 'https://fonts.gstatic.com'],
			'img-src': [
				'self',
				'data:',
				'https://a.storyblok.com',
				'https://www.googletagmanager.com',
				'https://www.google-analytics.com'
			],
			'connect-src': [
				'self',
				'https://api.storyblok.com',
				'https://www.googletagmanager.com',
				'https://www.google-analytics.com',
				'https://*.google-analytics.com',
				'https://*.analytics.google.com',
				'https://formspree.io'
			],
			'manifest-src': ['self'],
			'base-uri': ['self'],
			'form-action': ['self', 'https://formspree.io'],
			'frame-ancestors': ['none'],
			'object-src': ['none']
		}
	}
}
```

- `style-src` keeps `'unsafe-inline'` deliberately: there are inline `style=""` attributes
  (e.g. `display:contents` in [app.html](src/app.html#L23), Contact.svelte, FallingLeaves.svelte)
  that SvelteKit cannot hash. Style-injection risk is low; this is the standard trade-off.
- `script-src` has **no** `'unsafe-inline'`, so SvelteKit auto-adds nonces/hashes to its own
  hydration scripts (the actual XSS protection).
- **Gotcha:** never use attribute spreads (`{...}`) on media elements (`<img>`, `<video>`, etc.) —
  Svelte injects inline `onload`/`onerror` handlers (`this.__e=event`) that this strict `script-src`
  blocks (nonces/hashes can't cover event-handler attributes). Use explicit conditional attributes,
  e.g. `fetchpriority={eager ? 'high' : undefined}` (fixed in [PostCard.svelte](src/lib/components/PostCard.svelte)).

## Step 3 — Add a `handle` hook for the remaining headers

File: [src/hooks.server.ts](src/hooks.server.ts) — keep existing `handleError`, add:

```ts
import type { Handle, HandleServerError } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('X-Frame-Options', 'DENY'); // legacy backup to CSP frame-ancestors
	response.headers.set(
		'Permissions-Policy',
		'camera=(), microphone=(), geolocation=(), browsing-topics=()'
	);
	response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
	return response;
};
```

- HSTS is safe given the site is HTTPS-only on Cloudflare; drop/relax `preload` if you're not ready
  to commit to the preload list.
- Optional add-on (not included by default): `Cross-Origin-Opener-Policy: same-origin` — harmless
  for the share-button `window.open` popups, but left out to keep the first pass conservative.

## Scope note

The `handle` hook and `kit.csp` cover SvelteKit-rendered responses (HTML documents + API routes),
which is where CSP matters. Static assets served directly by the Cloudflare `ASSETS` binding bypass
the worker and won't get these headers. CSP is only meaningful on HTML, so this is fine; if you later
want `nosniff`/`Referrer-Policy` on every asset too, add a Cloudflare Transform Rule / response-header
rule at the edge.

## Verification

1. `npm run check` and `npm run lint` — clean (types for `dataLayer`, no lint errors).
2. Svelte MCP `svelte-autofixer` on `Analytics.svelte` until no issues.
3. `npm run preview` (builds + wrangler dev on :4173). In the browser:
   - DevTools **Console**: no CSP violation errors on home, a blog post, and a services page.
   - **Network**: `googletagmanager.com/gtag/js` loads and a GA `collect`/beacon fires; Google Fonts
     load; Storyblok content + `a.storyblok.com` images render.
   - Submit the contact form → Formspree `fetch` succeeds (no `connect-src` violation).
4. `curl -sI http://localhost:4173/` — confirm `Content-Security-Policy`, `X-Content-Type-Options`,
   `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`, `Strict-Transport-Security` headers
   are present, and the CSP contains a `nonce-…` in `script-src`.
5. If any host was missed, the console violation names the blocked URL → add its host to the matching
   directive and re-verify.
