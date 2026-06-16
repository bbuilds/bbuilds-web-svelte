---
name: playwright-cli
description: Playwright e2e testing for this repo — locator rules, waiting rules, CLI workflow, and the TDD loop. Load this before writing, running, or healing any e2e spec.
---

# Playwright CLI Skill

## Non-negotiables (enforced by eslint-plugin-playwright)

1. **Locators** — use `getByRole` first, always. See [references/locators.md](references/locators.md) for the full 6-level order. `locator(css)` is banned.
2. **Waiting** — never `waitForTimeout` or `waitForLoadState('networkidle')`. Auto-retrying `expect(locator)` assertions handle timing. See [references/waiting.md](references/waiting.md).
3. **webServer** — owns startup only; never embed seed/migration. Explicit `baseURL`. See [references/web-server.md](references/web-server.md).
4. **Reporting + traces** — HTML + JSON + list reporters; trace/screenshot/video on failure. See [references/reporting-and-traces.md](references/reporting-and-traces.md).
5. **CLI over MCP** — use `npx playwright …` only. Never add the `playwright-test` MCP server.

## TDD loop

1. Write a failing spec (`tests/<scenario>.e2e.ts`) — commit it.
2. Run: `npx playwright test tests/<scenario>.e2e.ts --reporter=line`
3. Implement the feature until green.
4. Never edit an assertion to match broken UI — fix the app.

**SSR caveat:** `page.route` only intercepts client-side requests. Storyblok `load` calls are server-side and not mockable this way; assert structure and navigation, not CMS copy.

## CLI cheatsheet (quick reference)

See [references/cli-cheatsheet.md](references/cli-cheatsheet.md) for full options.

```bash
npx playwright test                          # full suite
npx playwright test tests/home.e2e.ts        # one file
npx playwright test -g "nav is visible"      # one test by name
npx playwright test --last-failed            # rerun failures
npx playwright test --headed --debug         # debug mode
npx playwright show-report                   # open HTML report
npx playwright show-trace <trace.zip>        # trace viewer
```

## Reference files

- [Locator order](references/locators.md)
- [Waiting rules](references/waiting.md)
- [webServer rules](references/web-server.md)
- [Reporting + traces](references/reporting-and-traces.md)
- [Setup/teardown projects](references/setup-teardown.md)
- [CLI cheatsheet](references/cli-cheatsheet.md)
