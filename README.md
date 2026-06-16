# Branden Builds — Agency Site

Freelance website for [brandenbuilds.com](https://brandenbuilds.com), built with SvelteKit 5 (Runes mode), Storyblok CMS, and deployed to Cloudflare Workers. A dive into agentic coding using Claude Code.

## Stack

| Layer      | Technology                                          |
| ---------- | --------------------------------------------------- |
| Framework  | SvelteKit 2 + Svelte 5 (Runes, no Options API)      |
| Styling    | Tailwind CSS v4                                     |
| CMS        | Storyblok (Delivery API)                            |
| Deployment | Cloudflare Workers (`@sveltejs/adapter-cloudflare`) |
| Unit tests | Vitest + vitest-browser-svelte (Chromium)           |
| E2E tests  | Playwright                                          |

## Local Setup

**Prerequisites:** Node.js v18+, npm

1. Install dependencies:
   ```sh
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in:
   ```
   VITE_STORYBLOK_DELIVERY_API_TOKEN=...
   VITE_STORYBLOK_REGION=eu          # or 'us'
   VITE_SITE_URL=http://localhost:5173
   ```
3. Start the dev server:
   ```sh
   npm run dev
   ```

## Commands

```bash
npm run dev           # start development server (port 5173)
npm run build         # build for Cloudflare Workers
npm run preview       # build + run locally via wrangler dev (port 4173)
npm run deploy        # build + wrangler deploy to Cloudflare

# Type checking & linting
npm run check         # svelte-check + tsc (must exit 0)
npm run lint          # prettier check + eslint --max-warnings 0
npm run format        # prettier write

# Tests
npm run test          # unit + e2e (full suite)
npm run test:unit     # vitest watch mode
npm run test:unit -- --run                   # single run
npm run test:unit -- --run src/lib/foo       # single file
npm run test:e2e      # playwright (builds first)
npm run test:e2e:ui   # playwright interactive UI

# Cloudflare
npm run cf-typegen    # regenerate src/worker-configuration.d.ts from wrangler bindings
npm run types:storyblok  # regenerate src/lib/types/storyblok.d.ts
```

## Testing

Two Vitest projects run in separate environments:

| Project  | File pattern                                | Environment         |
| -------- | ------------------------------------------- | ------------------- |
| `client` | `src/**/*.svelte.{test,spec}.{js,ts}`       | Chromium (headless) |
| `server` | `src/**/*.{test,spec}.{js,ts}` (non-svelte) | Node                |

E2E specs live in `tests/*.e2e.ts` and are run by Playwright against a production build on port 4173.

## Environment Variables

| Variable                            | Required | Description                                                  |
| ----------------------------------- | -------- | ------------------------------------------------------------ |
| `VITE_STORYBLOK_DELIVERY_API_TOKEN` | Yes      | Storyblok Content Delivery API key                           |
| `VITE_STORYBLOK_REGION`             | No       | `eu` (default) or `us`                                       |
| `VITE_SITE_URL`                     | No       | Canonical site URL (defaults to `https://brandenbuilds.com`) |

Add Cloudflare bindings (KV, D1, R2, etc.) to `wrangler.jsonc` and run `npm run cf-typegen`.
