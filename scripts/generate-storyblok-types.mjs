import { execSync } from 'node:child_process';
import fs from 'node:fs';

const spaceId = process.env.STORYBLOK_SPACE_ID;
const token = process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN;

if (!spaceId) {
	console.error('Error: STORYBLOK_SPACE_ID is not set in the environment.');
	process.exit(1);
}
if (!token) {
	console.error('Error: STORYBLOK_PERSONAL_ACCESS_TOKEN is not set in the environment.');
	process.exit(1);
}

const run = (cmd) => execSync(cmd, { stdio: 'inherit' });

run(`storyblok login --token ${token}`);

console.log(`Pulling components from space ${spaceId}…`);
run(`storyblok components pull --space ${spaceId}`);

console.log('Generating types…');
run(`storyblok types generate --space ${spaceId}`);

// Merge base utility types + space-specific component interfaces into one file.
// The CLI splits them across two files with a cross-file import; we inline everything.
let base = fs.readFileSync('.storyblok/types/storyblok.d.ts', 'utf8');
const componentPath = `.storyblok/types/${spaceId}/storyblok.d.ts.d.ts`;
let components = fs.existsSync(componentPath) ? fs.readFileSync(componentPath, 'utf8') : '';

// Convert trailing `export type { ... }` block to inline exports on each declaration
base = base
	.replace(/\nexport type \{[\s\S]*?\};?\s*$/, '')
	.replace(/^interface /gm, 'export interface ')
	.replace(/^type /gm, 'export type ');

// Drop the generated header and cross-file import from the component file
components = components.replace(/^(\/\/.*\n)*import type .+;\n/, '').trimStart();

const merged = base.trimEnd() + (components ? '\n\n' + components : '\n');

fs.mkdirSync('src/lib/types', { recursive: true });
fs.writeFileSync('src/lib/types/storyblok.d.ts', merged);

console.log('Types written to src/lib/types/storyblok.d.ts');
