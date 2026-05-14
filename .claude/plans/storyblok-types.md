# Automated Storyblok TypeScript Type Generation

## Context

Storyblok was just connected to this SvelteKit project (commits [ed56785, 5296820]) using `@storyblok/svelte` v6.1.5. Components are fetched at runtime via `useStoryblokApi()` in [src/routes/+layout.ts](../../src/routes/+layout.ts) and [src/routes/+page.ts](../../src/routes/+page.ts), but their shapes are currently untyped — every `story.content` access is implicitly `any`.

Goal: install the official `storyblok` CLI and add an npm script that pulls the component schema from the Storyblok Management API and emits strict TypeScript interfaces into [src/lib/types/](../../src/lib/types/), so components and load functions can be type-checked against the real CMS schema.

User has confirmed:

- `STORYBLOK_PERSONAL_ACCESS_TOKEN` is already in `.env` alongside `STORYBLOK_SPACE_ID`
- Type prefix: `Storyblok` (e.g. `StoryblokPage`, `StoryblokHero`)
- Intermediate `components.<space-id>.json` file should be deleted after generation

## Approach

### 1. Add dev dependencies

Install the official Storyblok CLI as a devDependency:

```bash
npm i -D storyblok
```

(Package name on npm is `storyblok`, not `@storyblok/cli` — see https://www.storyblok.com/docs/libraries/storyblok-cli.) No other dependency needed: we'll use Node's built-in `--env-file` flag (Node 20+) to load `.env` instead of pulling in `dotenv-cli`.

### 2. Create the type-generation script

New file: [scripts/generate-storyblok-types.mjs](../../scripts/generate-storyblok-types.mjs)

Why a node script (not a one-line npm command): the CLI is a two-step flow (pull components JSON → generate types from JSON), and we want to clean up the intermediate JSON file afterward. A small script keeps the package.json line readable and handles errors cleanly.

Responsibilities:

1. Read `STORYBLOK_SPACE_ID` and `STORYBLOK_PERSONAL_ACCESS_TOKEN` from `process.env`; exit with a clear error if either is missing.
2. Ensure `src/lib/types/` exists (`fs.mkdirSync(..., { recursive: true })`).
3. Run `storyblok components pull --space <id> --path src/lib/types` via `execSync` with `stdio: 'inherit'` and `env: { ...process.env, STORYBLOK_PERSONAL_ACCESS_TOKEN }`. This writes `src/lib/types/components.<space-id>.json`.
4. Run `storyblok types generate src/lib/types/components.<space-id>.json --strict --type-prefix Storyblok --path src/lib/types/storyblok.d.ts`. `--strict` makes required fields non-optional in the generated interfaces.
5. Delete the intermediate JSON file (`fs.rmSync(...)`).
6. Log a success line with the output path.

### 3. Add the npm script

Edit [package.json](../../package.json) scripts:

```json
"types:storyblok": "node --env-file=.env scripts/generate-storyblok-types.mjs"
```

Naming: `types:storyblok` parallels the existing `cf-typegen` script ([package.json:19](../../package.json#L19)) and leaves room for sibling type-gen scripts later (`types:foo`).

### 4. Update `.gitignore` and add `.env.example`

The user has `.gitignore` already modified. Add (if not already present):

- `src/lib/types/components.*.json` — defensive ignore in case the cleanup step fails mid-run.

Create [.env.example](../../.env.example) documenting the three Storyblok vars without secret values:

```
VITE_STORYBLOK_DELIVERY_API_TOKEN=
STORYBLOK_SPACE_ID=
STORYBLOK_PERSONAL_ACCESS_TOKEN=
```

The existing `.gitignore` already whitelists `.env.example`, so this will be committed.

### 5. Verify the generated types are usable

After running `npm run types:storyblok`, the output file [src/lib/types/storyblok.d.ts](../../src/lib/types/storyblok.d.ts) will contain one interface per Storyblok component (e.g. `StoryblokPage`, `StoryblokHero`, plus shared types like `StoryblokAsset`, `StoryblokRichtext`).

Confirm by typing one existing fetch site — narrow `story.content` in [src/routes/+page.ts](../../src/routes/+page.ts) (or whichever route fetches a story) to a generated interface and run `npm run check`. This step is verification only; if the user wants me to wire generated types into existing load functions, that's a separate follow-up task.

## Critical files

- **New:** [scripts/generate-storyblok-types.mjs](../../scripts/generate-storyblok-types.mjs) — the generation script
- **New:** [.env.example](../../.env.example) — documents required env vars
- **New (generated, committed):** [src/lib/types/storyblok.d.ts](../../src/lib/types/storyblok.d.ts)
- **Modified:** [package.json](../../package.json) — add `storyblok` devDep + `types:storyblok` script
- **Modified:** [.gitignore](../../.gitignore) — ignore intermediate components JSON

## Verification

1. `npm i` — installs the CLI.
2. `npm run types:storyblok` — script should:
   - Print "Pulling components from space …"
   - Print "Generating types…"
   - Delete the intermediate JSON
   - Exit 0 with `src/lib/types/storyblok.d.ts` written
3. `ls src/lib/types/` — expect only `storyblok.d.ts` (no leftover JSON).
4. `npm run check` — the generated `.d.ts` must type-check cleanly with no errors.
5. Open `src/lib/types/storyblok.d.ts` and confirm interfaces are named `StoryblokFoo` and required fields are non-optional.
6. Failure modes to spot-check: rename `STORYBLOK_SPACE_ID` in `.env` temporarily and re-run — the script should exit with a clear "missing env var" error rather than a cryptic CLI failure.
