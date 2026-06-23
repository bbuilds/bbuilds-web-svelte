import { test as base, expect } from '@playwright/test';

/**
 * Diagnostics fixture: forwards browser-side signal the binary trace hides.
 *
 * Overrides the `page` fixture to collect console errors/warnings, uncaught
 * `pageerror`s, and failed / 4xx–5xx network responses. On failure only, each
 * collection is written as a text attachment (`console`, `network`) on the
 * test result — so the dossier hook and the agent see a forwarded `TypeError`
 * or a 4xx/5xx without unzipping the trace.
 *
 * Forwarding is via `testInfo.attach()` only — never `console.*` — so it stays
 * compatible with the repo-wide `no-console` lint rule.
 *
 * Note: specs that exercise an expected 4xx (e.g. `error.e2e.ts` hitting a 404
 * route) will log that response here, but it is attached on failure only —
 * noise-on-red, never on green.
 */
export const test = base.extend({
	page: async ({ page }, use, testInfo) => {
		const consoleMessages: string[] = [];
		const networkIssues: string[] = [];

		page.on('console', (msg) => {
			const type = msg.type();
			if (type === 'error' || type === 'warning') {
				consoleMessages.push(`[${type}] ${msg.text()}`);
			}
		});
		page.on('pageerror', (err) => {
			consoleMessages.push(`[pageerror] ${err.message}`);
		});
		page.on('requestfailed', (req) => {
			const reason = req.failure()?.errorText ?? 'unknown';
			networkIssues.push(`[requestfailed] ${req.method()} ${req.url()} — ${reason}`);
		});
		page.on('response', (res) => {
			if (res.status() >= 400) {
				networkIssues.push(`[${res.status()}] ${res.request().method()} ${res.url()}`);
			}
		});

		await use(page);

		if (testInfo.status !== testInfo.expectedStatus) {
			if (consoleMessages.length > 0) {
				await testInfo.attach('console', {
					body: consoleMessages.join('\n'),
					contentType: 'text/plain'
				});
			}
			if (networkIssues.length > 0) {
				await testInfo.attach('network', {
					body: networkIssues.join('\n'),
					contentType: 'text/plain'
				});
			}
		}
	}
});

export { expect };
