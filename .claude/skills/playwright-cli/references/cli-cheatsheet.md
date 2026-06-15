# CLI Cheatsheet

## Running tests

```bash
npx playwright test                               # full suite
npx playwright test tests/home.e2e.ts             # one file
npx playwright test tests/home.e2e.ts:12          # one test by line
npx playwright test -g "nav is visible"           # one test by name pattern
npx playwright test --last-failed                 # rerun only failures
npx playwright test --repeat-each=3               # repeat for flakiness detection
npx playwright test --workers=1                   # serial (debug race conditions)
npx playwright test --headed                      # watch the browser
npx playwright test --ui                          # interactive UI mode
npx playwright test --debug                       # paused debug mode (Playwright Inspector)
npx playwright test --trace on                    # always record traces
npx playwright test --reporter=line               # minimal reporter (used by generator)
```

## Code generation

```bash
npx playwright codegen http://localhost:4173      # record interactions → generate selectors
```

## Reports and traces

```bash
npx playwright show-report                        # open HTML report (default: playwright-report/)
npx playwright show-report playwright-report/     # explicit path
npx playwright show-trace <trace.zip>             # open trace viewer
```

## Installing browsers

```bash
npx playwright install chromium                   # install just Chromium
npx playwright install --with-deps chromium       # install + OS dependencies (CI)
```

## npm scripts (this repo)

```bash
npm run test:e2e           # install browsers + full suite
npm run test:e2e:ci        # full suite (no browser install — CI has pre-cached)
npm run test:e2e:ui        # interactive UI mode
npm run test:e2e:report    # open HTML report
npm run test:e2e:codegen   # codegen against localhost:4173
```
