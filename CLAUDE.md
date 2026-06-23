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

## Code Style

### CSS / Sizing

- **Use `rem` for all size measurements — never `px`.** This applies to Tailwind arbitrary values (e.g. `text-[0.8125rem]`, `h-[1.375rem]`), custom CSS properties, and inline styles. Standard Tailwind scale utilities (`px-4`, `py-2`, `text-sm`, `h-5`, etc.) are rem-based already and are fine as-is.
- Conversion reference: divide px value by 16 (e.g. 13px → 0.8125rem, 22px → 1.375rem).

### Svelte attributes under strict CSP

- **Never use attribute spreads (`{...}`) on media/embedded elements** (`<img>`, `<video>`, `<audio>`, `<source>`, `<iframe>`). Svelte switches spread elements to dynamic attribute handling and injects inline `onload`/`onerror` capture handlers (`this.__e=event`). The project's strict `script-src` (no `'unsafe-inline'`, see `kit.csp` in [svelte.config.js](svelte.config.js)) blocks inline event handlers — and nonces/hashes can't cover them — so the element breaks at runtime.
- Use explicit conditional attributes instead: `fetchpriority={eager ? 'high' : undefined}`, **not** `{...eager ? { fetchpriority: 'high' } : {}}`. An attribute set to `undefined` is omitted from the output.

---

## Testing

### Taxonomy

| Layer            | File pattern                     | Runner     |
| ---------------- | -------------------------------- | ---------- |
| Unit / component | `src/**/*.{spec,svelte.spec}.ts` | Vitest     |
| E2E              | `tests/*.e2e.ts`                 | Playwright |

Use `*.svelte.spec.ts` for components that need DOM rendering. Use `*.spec.ts` for pure logic. E2E specs live in `tests/` and are never picked up by Vitest (Vitest only scans `src/**`).

### E2E rules (see `.claude/skills/playwright-cli/` for the full reference)

- **TDD loop:** write the failing spec first, commit it, then implement.
- **Locator order:** `getByRole` → `getByLabel` → `getByPlaceholder` → `getByText` → `getByTestId` → never `locator(css)`.
- **Waiting:** never `waitForTimeout` or `networkidle`; use auto-retrying `expect(locator)` assertions.
- **CLI over MCP:** use `npx playwright …` only; do not add the `playwright-test` MCP server.
- **E2E runs in CI, not in git hooks.**
- **SSR caveat:** Storyblok `load` calls are server-side; `page.route` cannot intercept them. Assert structure and navigation, not CMS copy.
- **Never edit an assertion to match broken UI** — fix the app or mark with `test.fixme()` + a bug note.

### Agents

- `playwright-test-planner` — explores routes, writes `tests/plans/<feature>.md`.
- `playwright-test-generator` — authors `tests/<scenario>.e2e.ts` from a plan item, iterates to green.
- `playwright-test-healer` — runs `--last-failed`, reads the trace, repairs locators/timing.

---

## Static checks

`npm run lint` and `npm run check` must exit zero before any change is "done."

- **`npm run lint`** — Prettier check + ESLint with `--max-warnings 0`. Warnings are errors.
- **`npm run check`** — `svelte-check` with strict TypeScript. Same as `npm run typecheck`.
- **No escape hatches:** no `eslint-disable`, no rule downgrades, no `@ts-expect-error`, no `any`. Fix the code.

### Turning recurring corrections into lint rules

When you find yourself making the same correction more than once, mechanize it so the linter
catches it instead of a reviewer:

- **Prefer a dedicated plugin rule when one exists.** For Playwright, reach for
  `eslint-plugin-playwright` first (e.g. `playwright/prefer-web-first-assertions` already bans
  `expect(await locator.isVisible()).toBe(true)`).
- **Otherwise add a `no-restricted-syntax` entry** in the relevant block of
  [eslint.config.js](eslint.config.js). The e2e block already bans `locator.all()` (no auto-waiting)
  and `toPass()` with no args (0 ms default timeout).
- **Write the `message` as a fix-prompt** — state what to do _instead_, not just "don't". The agent
  reads the message, so it should be enough to act on.
- **No `eslint-disable` to route around it.** If a banned pattern is genuinely needed, that's a
  conversation about the rule, not a local escape hatch.
- `console.log` in tests is already banned by the global `no-console` rule
  ([eslint.config.js:49](eslint.config.js#L49)) — no e2e-specific seed needed.

---

## Git and verification

- **Never use `--no-verify`, `HUSKY=0`, `LEFTHOOK=0`**, or any other hook-skipping flag or env var. The only sanctioned `HUSKY: 0` is in CI to skip hook _installation_ — never to skip verification.
- **Never weaken hook, CI, or ruleset configuration** to make a failing change pass. Fix the code, or stop and explain the blocker.
- Changes to hook config, workflow files, or agent/skill files require the same review standard as application code.

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
