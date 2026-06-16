# Plan: Playwright e2e + CLI-driven AI test-agent workflow + static guardrails

## Context

You want real automated end-to-end testing in this repo, and build out agentic workflow similar to playwright skills.

**Current state (what I found):**

- Playwright is installed (`@playwright/test` 1.59.1) but **dormant**: [playwright.config.ts](playwright.config.ts)
  is minimal (`testMatch: '**/*.e2e.{ts,js}'`, no `testDir`), and **zero e2e specs exist** — so
  `npm run test:e2e` currently finds no tests.
- **Latent port bug:** the config + CLAUDE.md assume the preview server is on `4173`, but
  `npm run preview` runs `wrangler dev`, which defaults to **8787** (`4173` is Vite's preview
  default). Playwright's `webServer` would never connect. This must be pinned.
- CI already has decent bones ([.github/workflows/ci.yml](.github/workflows/ci.yml)): separate lint /
  typecheck / unit / build / e2e jobs, npm + Playwright-browser caching, `concurrency` cancel,
  `HUSKY: 0`, e2e gated behind push-to-`main` / a `run-e2e` label with report upload.
- **Static guardrails are partial:** [eslint.config.js](eslint.config.js) is flat config with
  `js.recommended` + `ts.configs.recommended` (**non-type-checked**) + svelte + a custom
  "annotations over assertions" rule; `projectService` is wired only for `.svelte` files.
  [tsconfig.json](tsconfig.json) has `strict: true` but none of the lesson's extra flags.
- Husky: pre-commit lint-staged, pre-push `check` + unit. E2e correctly **not** in hooks.
- **This repo ≠ shelf-life:** Storyblok-backed **SSR marketing/blog site on Cloudflare Workers**,
  **no auth, no DB**. So shelf-life's `auth.setup.ts`, `storageState`, drizzle seeding, and
  `tests/helpers/seed.ts` **do not apply**.
- shelf-life agents drive the **Playwright MCP**; its `playwright-cli` skill is an **empty stub**.
  Per your "CLI over MCP" rule, I'll rewrite the agents for the CLI and build the skill from scratch.

**Outcome:** a working flat `tests/` Playwright suite; a CLI-driven planner/generator/healer trio +
a `playwright-cli` skill that **enforces** the locator/waiting/webServer/reporting rules; type-aware
lint + strict-TS guardrails; CI restructured as the last-resort loop; and Git/CI governance rules.

## Decisions (locked in)

- **Location/naming:** flat `tests/*.e2e.ts`, `testDir: 'tests'` + `testMatch: '**/*.e2e.{ts,js}'`
  (your choice). The `.e2e` suffix separates from Vitest's `.spec.ts`; Vitest only scans `src/**`.
  Generated specs **must** use `.e2e.ts` or Playwright won't run them.
- **CLI over MCP:** agents use `npx playwright …` only. Do **not** add the `playwright-test` MCP server.
- **Husky stays; e2e runs in CI only**, not in git hooks.
- **No auth / storageState / DB seeding** — N/A. Initial config ships no setup/teardown project; the
  skill documents those patterns for later (see §3).
- **Reporting + traces on by default:** HTML + JSON + list reporters; `trace`/`screenshot`/`video`
  retained on failure (§1, enforced via §3).
- **Static checks are blocking:** `npm run lint` (warnings = errors) and `npm run check` (strict TS)
  must exit zero before any task is "done." **No escape hatches** — no `eslint-disable`, no rule
  downgrades, no `@ts-expect-error`, no `any`; fix the code (§5, §9). **knip/dead-code detection is
  intentionally excluded** per your instruction.
- **Git & verification policy:** never bypass hooks and never weaken hooks/CI/rulesets to make a
  failing change pass (§5).
- **CI is the loop of last resort:** the same lint/type/unit commands run in local hooks first; CI
  re-runs them plus build + e2e, mirrors production, and is never weakened to pass (§7).
- **Hermetic-first, but starter tests assert structure, not CMS copy** (SSR `load` fetches are
  server-side and not interceptable by `page.route`). Full network isolation is a follow-up.

## Work items

### 1. Upgrade [playwright.config.ts](playwright.config.ts)

- `testDir: 'tests'`; **keep** `testMatch: '**/*.e2e.{ts,js}'`. Scoping + the `.e2e` suffix means
  `src/**` Vitest specs, `tests/data/*.ts` helpers, and `llm_docs/` are never picked up.
- **Reporting + traces:** `reporter` html (`outputFolder: 'playwright-report'`, `open: 'never'`) +
  json + list; `use.trace: 'retain-on-failure'`, `use.screenshot: 'only-on-failure'`,
  `use.video: 'retain-on-failure'`. Open with `npm run test:e2e:report` / `npx playwright show-trace`.
- `use.baseURL: 'http://localhost:4173'` set **explicitly**.
- Single `chromium` project; `fullyParallel: true`; `forbidOnly: !!process.env.CI`;
  `retries: process.env.CI ? 1 : 0`.
- **Fix the port + webServer rules:** `command: 'npm run build && wrangler dev --port 4173 --ip
127.0.0.1'` (production-ish; **no** seed/migration hidden in it), `url: 'http://localhost:4173'`,
  `reuseExistingServer: !process.env.CI`, `timeout: 120_000`. (Debug with `DEBUG=pw:webserver`.)

### 2. `tests/` scaffold + starter smoke spec

```
tests/
├─ home.e2e.ts         # starter smoke spec (committed, passing)
├─ data/ · fixtures/ · helpers/   # each with a .gitkeep
```

- `tests/home.e2e.ts`: assert stable, CMS-independent things — `page.goto('/')`, the primary nav
  landmark in [src/lib/components/Header.svelte](src/lib/components/Header.svelte) visible, an `<h1>`
  visible, navigation to `/blog` and `/services` resolves. Written to the §3 rules. Mirrors the
  shape of shelf-life's `tests/smoke.spec.ts`.

### 3. New skill `.claude/skills/playwright-cli/` — **enforces the Playwright rules**

`SKILL.md` (name + description frontmatter) inlines the top non-negotiables, summarizes the CLI
workflow, and links reference files (detail lives in `references/` to keep SKILL.md scannable):

- **`references/locators.md`** — the 6-level order, every time: 1) `getByRole(role,{name})` first,
  always; 2) `getByLabel`; 3) `getByPlaceholder` (and fix the missing label); 4) `getByText`; 5) `getByTestId` only when 1–4 fail, **justified in the commit message**; 6) `locator(css)` —
  **never**. Plus: scope with chained locators, `filter({ has, hasText })`, `and()`, `or().first()`
  **before** `nth()`; `locator.describe()` on reusable locators so traces read like English.
- **`references/waiting.md`** — never `waitForTimeout` / `waitForLoadState('networkidle')`; auto-
  retrying `expect(locator)` not boolean probes; `fill()` over `pressSequentially()`; set up
  `waitForResponse`/`waitForRequest` **before** the action; `trial: true` for actionability without
  acting; `expect.poll()` / `toPass()` (explicit timeout); `page.clock` for clock-driven UI;
  **flakiness = assertion doesn't match the real end state — find and assert it, don't add a wait.**
- **`references/web-server.md`** — `webServer` owns startup/readiness only (no seed/migration);
  explicit `use.baseURL`; `reuseExistingServer: !process.env.CI`; production-ish start; on unclear
  failure expose stdout + `DEBUG=pw:webserver`.
- **`references/reporting-and-traces.md`** — HTML+JSON+list; trace/screenshot/video on failure; how
  to read (`show-report`, `show-trace`). Mirrors §1.
- **`references/setup-teardown.md`** — when to model prerequisites/cleanup as setup/teardown
  **projects** (auth/`storageState`, role sessions, fail-fast prerequisite checks, HAR/artifact
  capture, temp files, supporting services, non-DB app state, shared external resources, expensive
  one-time setup; teardown mirrors each). Documented for later; nothing here needs it yet.
- **`references/cli-cheatsheet.md`** — `playwright test` (+ `-g`, `file.e2e.ts:line`, `--last-failed`,
  `--repeat-each`, `--workers=1`, `--headed`, `--ui`, `--debug`, `--trace on`), `codegen <url>`,
  `show-report`, `show-trace <zip>`, `install --with-deps chromium`.
- **TDD loop** (SKILL.md): failing spec → commit → run → implement → green. Never edit an assertion
  to match broken UI. **Network-isolation note:** `page.route` only mocks client-side requests.

**Mechanical enforcement:** `eslint-plugin-playwright` (new devDep) `flat/recommended` scoped to
`tests/**/*.e2e.ts` in [eslint.config.js](eslint.config.js) turns offenders into **lint failures**
(`no-wait-for-timeout`, `no-networkidle`, `no-raw-locators`, `no-element-handle`, `no-force-option`,
`no-page-pause`, `prefer-web-first-assertions`, `valid-expect`, …). Rules enforced by tooling, not
just docs. (Coordinated with §9.)

### 4. Rewrite the three agents → `.claude/agents/` (CLI, no MCP)

Port the shelf-life agents, **replacing every `mcp__playwright-test__*` tool** with built-in tools +
Bash. Each keeps `name`/`description` frontmatter, `model: sonnet`, and **must follow the
`playwright-cli` skill + the Git & verification policy (§5)**.

- **`playwright-test-planner.md`** (`Read, Grep, Glob, Bash, Write`): explore via reading
  `src/routes/**` + components (optionally `npx playwright codegen`), write a plan to
  `tests/plans/<feature>.md` (numbered scenarios, stable-locator intent, expected outcome).
- **`playwright-test-generator.md`** (`Read, Grep, Glob, Bash, Write, Edit`): author
  `tests/<scenario>.e2e.ts` from a plan item, then **verify via `npx playwright test
tests/<scenario>.e2e.ts --reporter=line`**, iterating to green. Never masks real bugs.
- **`playwright-test-healer.md`** (`Read, Edit, Write, Grep, Glob, Bash`): `npx playwright test
--last-failed`, inspect via `show-report` / `show-trace`, read the trace, fix locators/timing,
  re-run to green. `test.fixme()` + comment only when the test is right but the app is broken.
  **Open `playwright-report` + trace before proposing a fix.**

(Optional: mirror to `.github/agents/*.agent.md` for Copilot — deferred.)

### 5. CLAUDE.md — add "Testing" + "Static checks" + "Git and verification"

- **Testing taxonomy:** Vitest unit/component under `src/` (`*.spec.ts` node, `*.svelte.spec.ts`
  browser) — already in place; Playwright e2e in `tests/*.e2e.ts`. TDD (failing test first, commit
  it first); **point to the `playwright-cli` skill** as the source of truth for locator/waiting/
  webServer rules; "don't change assertions to match broken UI"; CLI over MCP; e2e runs in CI not
  hooks; SSR network caveat.
- **Static checks (must exit zero before "done"):** `npm run lint` (ESLint, warnings = errors) and
  `npm run check` (svelte-check, strict TS). If lint fails, read the message and fix it — **no
  `eslint-disable`, no downgrading rules**. If types fail, fix the types — **no `any`, no
  `@ts-expect-error`**.
- **Git and verification (verbatim policy):**
  - Never use `--no-verify`, `HUSKY=0`, `LEFTHOOK=0`, or other hook-skipping flags/env vars. (The
    only sanctioned `HUSKY=0` is in CI to skip hook _installation_, never to skip verification.)
  - Never weaken hook, CI, or ruleset configuration to make a failing change pass. Fix the code or
    stop and explain the blocker.
  - Changes to hook config, workflow files, or agent policy files require the same review standard as
    application code.

  The agents (§4) and the skill (§3) reference this policy so it binds automated work too.

### 6. Ignore files

- [.gitignore](.gitignore): add `playwright-report/` + `/blob-report/` (`test-results` already ignored).
- [.prettierignore](.prettierignore): add `playwright-report/` + `test-results/`.

### 7. CI — restructure as the loop of last resort ([.github/workflows/ci.yml](.github/workflows/ci.yml))

Audit vs. the lesson — **already compliant:** npm + Playwright-browser caching, `npm ci`,
`concurrency` cancel-in-progress on PRs, same lint/check/unit commands as local hooks, `HUSKY: 0`,
e2e report artifact on failure. **Changes:**

- **Consolidate lint + typecheck into one `static` job** (lesson: "setup overhead is bigger than the
  benefit of fanning out four short steps"): `npm ci` → `npx svelte-kit sync` → `npm run lint` →
  `npm run check`.
- Keep `unit`, `build`, `e2e` as independent parallel jobs so **all** failures surface in one run;
  use `needs:` only for true deps (`e2e needs: build`). Add the Storyblok token env to the `e2e` job
  (its `webServer` builds), matching `build`.
- **Governance (don't weaken CI):** no `continue-on-error: true` without written justification; never
  reduce check strictness to "fix" a failure — propose any relaxation as a separate change. Keep
  commands identical to local hooks.
- **Caching:** keep current keys (optionally combine `~/.npm` + `~/.cache/ms-playwright` into one
  keyed entry as the lesson shows).
- **Branch protection (repo setting, document it):** require `static`, `unit`, and `build` status
  checks before merge. Note the trade-off: e2e is gated for cost, so it can only be a _required_
  check if you run it on every PR (drop the label gate) — your call.

### 8. package.json — scripts

- Add `--max-warnings 0` to the lint script so **warnings fail** (ESLint side of the guardrail).
- Add `typecheck` alias → `npm run check` (so the course's "run `npm run typecheck`" agent
  instructions work) and Playwright conveniences: `test:e2e:ui`, `test:e2e:report`,
  `test:e2e:codegen`. Husky hooks unchanged.

### 9. Static guardrails — ESLint + TypeScript (Lint & Types lesson, **no knip**)

- **ESLint ([eslint.config.js](eslint.config.js)):**
  - **Enable type-aware linting** — swap `ts.configs.recommended` → `ts.configs.recommendedTypeChecked`
    and add global `languageOptions.parserOptions: { projectService: true, tsconfigRootDir:
import.meta.dirname }`. This unlocks the headline rules `@typescript-eslint/no-floating-promises`
    and `no-misused-promises` ("every unawaited promise is a race condition").
  - Add `no-console` (allow `warn`/`error`); tighten `@typescript-eslint/no-explicit-any: error` and
    `ban-ts-comment` to disallow `@ts-expect-error`/`@ts-ignore`. Keep the existing
    `consistent-type-assertions` rule (+ its test-file relaxation).
  - Lean on `eslint-plugin-playwright` (§3) for test anti-patterns; use `no-restricted-syntax` (the
    lesson's "swiss army knife") only for project-specific bans the plugins miss, with **fix-prompt
    style messages** (name the violation, offer the alternative, link the doc).
  - Escape hatches stay closed: don't add `eslint-disable` or downgrade `error`→`warn`. (Optional
    mechanical backstop: `@eslint-community/eslint-plugin-eslint-comments` to ban disable directives —
    another devDep; include only if you want it.)
- **TypeScript ([tsconfig.json](tsconfig.json)):** keep `strict: true`; add `noUncheckedIndexedAccess`,
  `exactOptionalPropertyTypes`, `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`,
  `noFallthroughCasesInSwitch`. `npm run check` (svelte-check) is the typecheck (the SvelteKit
  equivalent of `tsc --noEmit`).
- **Note:** type-aware lint + the new TS flags **will likely surface existing issues**. Per the
  no-escape-hatch rule we **fix** them (or, only if truly necessary, pin warnings via
  `--max-warnings=<current>` as a temporary, documented step) — we do not suppress.

## Files

| Action | Path                                                                                                                                                                          |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Edit   | [playwright.config.ts](playwright.config.ts), [eslint.config.js](eslint.config.js) (type-aware + playwright plugin + rules), [tsconfig.json](tsconfig.json) (strict flags)    |
| Create | `tests/home.e2e.ts`, `tests/{data,fixtures,helpers}/.gitkeep`, `tests/plans/` (on first plan)                                                                                 |
| Create | `.claude/skills/playwright-cli/SKILL.md` + `references/{locators,waiting,web-server,reporting-and-traces,setup-teardown,cli-cheatsheet}.md`                                   |
| Create | `.claude/agents/playwright-test-{planner,generator,healer}.md`                                                                                                                |
| Edit   | [package.json](package.json) (`--max-warnings 0`, `typecheck` alias, e2e scripts, new devDep), [.github/workflows/ci.yml](.github/workflows/ci.yml) (static job + governance) |
| Edit   | [CLAUDE.md](CLAUDE.md), [.gitignore](.gitignore), [.prettierignore](.prettierignore)                                                                                          |

## Verification

1. `npm run lint` (with `--max-warnings 0`) and `npm run check` — clean. If the new type-aware rules /
   TS flags surface issues, fix them (don't suppress).
2. `npm run test:unit:run` — green; Vitest ignores `tests/`, Playwright ignores `src/`.
3. `npm run test:e2e` — builds, `wrangler dev` on 4173, `tests/home.e2e.ts` passes; report opens via
   `npm run test:e2e:report`; failure leaves a trace for `npx playwright show-trace`.
4. **Guardrail checks (planted, then removed):** a `page.waitForTimeout` / `page.locator('.x')` in a
   spec fails lint; an `@ts-expect-error` / `any` fails lint; a floating promise fails the type-aware
   rule. Each must be rejected by `npm run lint`.
5. `grep -r "mcp__playwright-test" .claude/` returns nothing (agents fully CLI).
6. Loop smoke test: planner on `/blog` → generator on one scenario → break a locator → healer runs
   `--last-failed` + trace and repairs it.
7. CI: a pushed branch runs the `static` / `unit` / `build` jobs (e2e on `main`/label); confirm
   lint+typecheck live together and the e2e job has the Storyblok token.

## Out of scope / follow-ups

- **knip / dead-code detection** — explicitly excluded per your instruction.
- **Network isolation for SSR** (HAR replay or a server-side Storyblok mock) — course HAR labs.
- **Nightly workflow** (re-record HARs, full `npm audit`, cross-browser Chromium/Firefox/WebKit) and
  **secret scanning (gitleaks)** — later course chapters; not built now.
- Auth/storageState + setup/teardown projects, DB seeding, visual regression, a11y gate, perf budgets
  — documented in the skill but not built now.
- `.github/agents/*.agent.md` Copilot variants — only if you use Copilot agents.
