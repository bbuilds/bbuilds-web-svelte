import { execSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const spaceId = process.env.STORYBLOK_SPACE_ID;
const token = process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN;
const region = process.env.STORYBLOK_REGION ?? 'eu';

if (!spaceId) {
	console.error('Error: STORYBLOK_SPACE_ID is not set in the environment.');
	process.exit(1);
}
if (!token) {
	console.error('Error: STORYBLOK_PERSONAL_ACCESS_TOKEN is not set in the environment.');
	process.exit(1);
}

const typesDir = 'src/lib/types';
const outputFile = path.join(typesDir, 'storyblok.d.ts');
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'storyblok-'));

const env = { ...process.env, STORYBLOK_PERSONAL_ACCESS_TOKEN: token };
const run = (cmd) => execSync(cmd, { stdio: 'inherit', env });

try {
	run(`storyblok login --token ${token} --region ${region}`);

	console.log(`Pulling components from space ${spaceId}…`);
	run(`storyblok --path ${tmpDir} components pull --space ${spaceId}`);

	console.log('Generating types…');
	run(
		`storyblok --path ${tmpDir} types generate --space ${spaceId} --filename storyblok.d.ts --strict --type-prefix Storyblok`
	);

	fs.mkdirSync(typesDir, { recursive: true });
	fs.copyFileSync(path.join(tmpDir, 'types', 'storyblok.d.ts'), outputFile);

	console.log(`Types written to ${outputFile}`);
} finally {
	fs.rmSync(tmpDir, { recursive: true, force: true });
}
