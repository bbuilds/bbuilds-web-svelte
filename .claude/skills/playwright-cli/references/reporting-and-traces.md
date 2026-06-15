# Reporting and Traces

## Configuration (playwright.config.ts)

```ts
reporter: [
  ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ['json', { outputFile: 'playwright-report/results.json' }],
  ['list']
],
use: {
  trace: 'retain-on-failure',
  screenshot: 'only-on-failure',
  video: 'retain-on-failure'
}
```

## Viewing reports and traces

```bash
# Open the HTML report after a run
npm run test:e2e:report
# or
npx playwright show-report

# Inspect a specific trace zip
npx playwright show-trace test-results/<test-name>/trace.zip
```

## What each artifact captures

| Artifact   | `retain-on-failure` means                                                   |
| ---------- | --------------------------------------------------------------------------- |
| Trace      | DOM snapshots, network, console, actions — step through like a time machine |
| Screenshot | Final page state when the test failed                                       |
| Video      | Full video of the browser session                                           |

## CI artifact upload

The CI workflow uploads `playwright-report/` as an artifact on failure (7-day retention). Download it and run `npx playwright show-report` locally against the extracted folder.

## Reading a trace

1. `npx playwright show-trace <zip>` opens the trace viewer.
2. Left panel: action list. Click an action to jump to its DOM snapshot.
3. Right panel: network, console, source. Check for 404s, JS errors, unexpected responses.
4. Use the DOM snapshot to find the correct locator — copy the selector from the picker.
