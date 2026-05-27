import { apiPlugin, storyblokInit, useStoryblokApi } from '@storyblok/svelte';
import { SITE_URL } from '$lib/config/site';

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

	const urls: Array<{ loc: string; lastmod: string; changefreq: string; priority: string }> = [];

	try {
		const res = await api.get('cdn/stories/home-page', { version: 'published' });
		const story = res.data?.story;
		if (story && !story.content?.seo?.[0]?.no_index) {
			urls.push({
				loc: SITE_URL + '/',
				lastmod: story.published_at?.split('T')[0] ?? today,
				changefreq: 'weekly',
				priority: '1.0'
			});
		}
	} catch {
		// home page not available — skip
	}

	try {
		const res = await api.get('cdn/stories', {
			version: 'published',
			starts_with: 'services/',
			is_startpage: false
		});
		for (const story of res.data?.stories ?? []) {
			if (!story.content?.seo?.[0]?.no_index) {
				urls.push({
					loc: `${SITE_URL}/${story.full_slug}`,
					lastmod: story.published_at?.split('T')[0] ?? today,
					changefreq: 'monthly',
					priority: '0.8'
				});
			}
		}
	} catch {
		// services not available — skip
	}

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
	.map(
		(u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
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
