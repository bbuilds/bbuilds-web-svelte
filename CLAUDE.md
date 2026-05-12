# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Configuration

- **Language**: TypeScript
- **Package Manager**: npm
- **Add-ons**: vitest, playwright, tailwindcss, mcp

## Commands

```bash
npm run dev          # start dev server
npm run build        # build for Cloudflare Workers
npm run preview      # build + run locally via wrangler dev (port 4173)
npm run deploy       # build + wrangler deploy to Cloudflare
npm run check        # svelte-kit sync + svelte-check (type checking)
npm run cf-typegen   # regenerate src/worker-configuration.d.ts from wrangler bindings

# Lint & Format
npm run lint         # prettier check + eslint
npm run format       # prettier write

# Tests
npm run test              # unit + e2e (full suite)
npm run test:unit         # vitest watch mode
npm run test:unit -- --run               # vitest single run
npm run test:unit -- --run src/lib/foo   # run a single test file
npm run test:e2e          # playwright e2e (builds first)
```

## Architecture

### Deployment Target

The app targets **Cloudflare Workers** via `@sveltejs/adapter-cloudflare`. The Cloudflare runtime context (`env`, `cf`, `ctx`) is typed in `src/app.d.ts` under `App.Platform` and available in server-side SvelteKit load functions and API routes as `event.platform`.

When adding Cloudflare bindings (KV, D1, R2, etc.), define them in `wrangler.jsonc` and run `npm run cf-typegen` to regenerate `src/worker-configuration.d.ts`.

### Svelte 5 Runes Mode

Runes mode is **forced project-wide** in `svelte.config.js`. All components must use the Svelte 5 runes API (`$props()`, `$state()`, `$derived()`, `$effect()`, etc.) — the legacy Options API is not available in this project.

### Test Split (Two Vitest Projects)

`vite.config.ts` defines two separate test projects that run with different environments:

| Project  | File pattern                                                | Environment                                     |
| -------- | ----------------------------------------------------------- | ----------------------------------------------- |
| `client` | `src/**/*.svelte.{test,spec}.{js,ts}`                       | Chromium (headless) via `vitest-browser-svelte` |
| `server` | `src/**/*.{test,spec}.{js,ts}` (excluding `.svelte.` files) | Node                                            |

Use `*.svelte.spec.ts` for component tests that need DOM rendering (`render` from `vitest-browser-svelte`). Use `*.spec.ts` for pure logic/utility tests.

E2E tests (`*.e2e.ts`) are separate — they run under Playwright and the config builds the app first before running against port 4173.

---

## Svelte MCP Tools

You have access to the Svelte MCP server with comprehensive Svelte 5 and SvelteKit documentation.

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.
