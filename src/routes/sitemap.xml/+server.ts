import { apiPlugin, storyblokInit, useStoryblokApi } from '@storyblok/svelte';
import type { StoryblokMultilinkLink } from '$lib/types/storyblok';
import { SITE_URL } from '$lib/config/site';

type SitemapLink = StoryblokMultilinkLink & { published_at?: string };

function escapeXml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

// Maps a Storyblok story slug to the path the SvelteKit app actually serves it
// at. Only `home-page` and `services/*` are routable Storyblok content; every
// other story (globals, etc.) has no route and must be left out of the sitemap.
function pathForSlug(slug: string): string | null {
	if (slug === 'home-page') return '/';
	if (slug.startsWith('services/')) return `/${slug}`;
	return null;
}

export async function GET() {
	storyblokInit({
		accessToken: import.meta.env.VITE_STORYBLOK_DELIVERY_API_TOKEN,
		apiOptions: {
			region: (import.meta.env.VITE_STORYBLOK_REGION ?? 'eu') as 'eu' | 'us' | 'cn' | 'ca' | 'ap'
		},
		use: [apiPlugin]
	});

	const api = useStoryblokApi();
	const today = new Date().toISOString().split('T')[0];

	const entries = new Map<string, string>();
	entries.set(SITE_URL + '/', today);

	try {
		const params = { version: 'published' as const, include_dates: 1 };
		const links: SitemapLink[] = await api.getAll('cdn/links', params);

		for (const link of links) {
			if (link.is_folder || !link.published) continue;
			const path = pathForSlug(link.slug);
			if (!path) continue;
			entries.set(SITE_URL + path, link.published_at?.split('T')[0] ?? today);
		}
	} catch {
		// links endpoint unavailable — fall back to the home URL seeded above
	}

	const urls = [...entries.entries()].sort(([a], [b]) => a.localeCompare(b));

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
	.map(
		([loc, lastmod]) => `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, max-age=3600, s-maxage=3600'
		}
	});
}
