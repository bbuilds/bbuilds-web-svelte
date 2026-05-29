import prettier from 'eslint-config-prettier';
import path from 'node:path';
import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import ts from 'typescript-eslint';
import svelteConfig from './svelte.config.js';

const gitignorePath = path.resolve(import.meta.dirname, '.gitignore');

export default defineConfig(
	includeIgnoreFile(gitignorePath),
	{ ignores: ['src/lib/types/storyblok.d.ts'] },
	js.configs.recommended,
	ts.configs.recommended,
	svelte.configs.recommended,
	prettier,
	svelte.configs.prettier,
	{
		languageOptions: { globals: { ...globals.browser, ...globals.node } },
		rules: {
			// typescript-eslint strongly recommend that you do not use the no-undef lint rule on TypeScript projects.
			// see: https://typescript-eslint.io/troubleshooting/faqs/eslint/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
			'no-undef': 'off',
			// Prefer type annotations (`const x: T = ...`) over type assertions (`... as T`).
			'@typescript-eslint/consistent-type-assertions': [
				'error',
				{
					assertionStyle: 'as',
					objectLiteralTypeAssertions: 'never'
				}
			]
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig
			}
		}
	},
	{
		// Override or add rule settings here, such as:
		// 'svelte/button-has-type': 'error'
		rules: {
			// Typed routes are not enabled in this project (svelte.config.js has no typedRoutes: true)
			'svelte/no-navigation-without-resolve': 'off'
		}
	},
	{
		files: ['**/*.{test,spec}.{js,ts}'],
		rules: {
			// Test mocks legitimately use object-literal assertions for partial fixtures
			// (e.g. `{...} as unknown as Api`, `{ event: { url } } as ErrorArgs`), which cannot
			// be expressed as annotations. Relax the rule here instead of scattering disables.
			'@typescript-eslint/consistent-type-assertions': [
				'error',
				{ assertionStyle: 'as', objectLiteralTypeAssertions: 'allow' }
			]
		}
	}
);
