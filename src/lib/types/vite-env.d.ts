/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_STORYBLOK_DELIVERY_API_TOKEN: string;
	readonly VITE_STORYBLOK_REGION: string | undefined;
	readonly VITE_SITE_URL: string | undefined;
	readonly VITE_FORMSPREE_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
