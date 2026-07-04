import adapter from '@sveltejs/adapter-cloudflare';

/**
 * @param {unknown} value
 * @returns {value is string[]}
 */
function isStringArray(value) {
	return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	kit: {
		adapter: adapter(),
		typescript: {
			// Augment (don't override) the generated include so the SvelteKit-managed
			// list — ambient.d.ts, non-ambient.d.ts, generated $types — stays intact.
			// Paths are relative to .svelte-kit/tsconfig.json. tests/** and vite.config
			// are already covered by the generated config; only playwright.config needs adding.
			config: (config) => {
				if (isStringArray(config.include)) {
					config.include = [...config.include, '../playwright.config.ts'];
				}
				return config;
			}
		},
		prerender: {
			handleMissingId: 'warn'
		},
		csp: {
			mode: 'auto',
			directives: {
				'default-src': ['self'],
				'script-src': [
					'self',
					'https://www.googletagmanager.com',
					'https://static.cloudflareinsights.com'
				],
				'style-src': ['self', 'unsafe-inline', 'https://fonts.googleapis.com'],
				'font-src': ['self', 'https://fonts.gstatic.com'],
				'img-src': [
					'self',
					'data:',
					'https://a.storyblok.com',
					'https://www.googletagmanager.com',
					'https://www.google-analytics.com'
				],
				'connect-src': [
					'self',
					'https://api.storyblok.com',
					'https://www.googletagmanager.com',
					'https://www.google-analytics.com',
					'https://*.google-analytics.com',
					'https://*.analytics.google.com',
					'https://cloudflareinsights.com',
					'https://formspree.io'
				],
				'manifest-src': ['self'],
				'base-uri': ['self'],
				'form-action': ['self', 'https://formspree.io'],
				'frame-ancestors': ['none'],
				'object-src': ['none']
			}
		}
	}
};

export default config;
