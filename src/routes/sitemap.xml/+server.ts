export const prerender = true;
import type { StoryblokMultilinkLink } from '$lib/types/storyblok';
import { SITE_URL } from '$lib/config/site';
import { initStoryblok } from '$lib/storyblok/client';
import { getAllLinks } from '$lib/storyblok/stories';

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
	if (slug.startsWith('posts/')) return `/${slug.slice('posts/'.length)}`;
	return null;
}

export async function GET() {
	const api = initStoryblok();
	const today = new Date().toISOString().slice(0, 10);

	const entries = new Map<string, string>();
	entries.set(SITE_URL + '/', today);
	entries.set(SITE_URL + '/blog', today);

	try {
		const params = { version: 'published' as const, include_dates: 1 as const };
		const links = await getAllLinks<SitemapLink>(api, params);

		for (const link of links) {
			if (link.is_folder || !link.published) continue;
			const path = pathForSlug(link.slug);
			if (!path) continue;
			entries.set(SITE_URL + path, link.published_at?.slice(0, 10) ?? today);
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
