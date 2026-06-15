# webServer Rules

## Configuration (playwright.config.ts)

```ts
webServer: {
  command: 'npm run build && wrangler dev --port 4173 --ip 127.0.0.1',
  url: 'http://localhost:4173',
  reuseExistingServer: !process.env.CI,
  timeout: 120_000
}
```

## Rules

- `webServer` owns **startup and readiness polling only** — never embed seed/migration commands in `command`.
- Always set `use.baseURL` explicitly — do not rely on `webServer.port` inference.
- `reuseExistingServer: !process.env.CI` — reuse in local dev, always start fresh in CI.
- Use a **production-ish** start command (`wrangler dev`, not `vite dev`) — this repo deploys to Cloudflare Workers.
- `timeout: 120_000` — build + wrangler startup can take time; 120s is sufficient.

## Debugging startup failures

```bash
DEBUG=pw:webserver npx playwright test
```

If wrangler fails to bind to 4173, check:

1. No other process on that port: `lsof -i :4173`
2. Build succeeded: `npm run build` manually
3. wrangler version is current: `wrangler --version`
