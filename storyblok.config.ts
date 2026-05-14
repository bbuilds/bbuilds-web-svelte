import { defineConfig } from 'storyblok/config';

export default defineConfig({
	region: (process.env.STORYBLOK_REGION ?? 'eu') as 'eu' | 'us' | 'cn' | 'ca' | 'ap',
	space: process.env.STORYBLOK_SPACE_ID,
	log: {
		file: { enabled: false }
	},
	report: { enabled: false },
	modules: {
		types: {
			generate: {
				strict: true,
				typePrefix: 'Storyblok',
				filename: 'storyblok.d.ts'
			}
		}
	}
});
