import adapter from '@sveltejs/adapter-cloudflare';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	kit: {
		adapter: adapter(),
		csp: {
			mode: 'auto',
			directives: {
				'default-src': ['self'],
				'script-src': ['self', 'https://www.googletagmanager.com'],
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
