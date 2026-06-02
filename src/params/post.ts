import type { ParamMatcher } from '@sveltejs/kit';

// Blog post slugs are plain words (e.g. "my-first-post") and never contain a
// dot. Rejecting dotted paths stops this catch-all route from shadowing static
// server endpoints like /sitemap.xml on the client router, where `+server.ts`
// routes aren't in the route manifest. See src/routes/sitemap.xml/+server.ts.
export const match: ParamMatcher = (param) => !param.includes('.');
