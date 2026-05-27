import { describe, expect, it } from 'vitest';
import { organizationLd, webSiteLd, breadcrumbLd } from './jsonLd';
import { SITE_URL, SITE_NAME } from '$lib/config/site';

describe('organizationLd', () => {
	it('returns correct @context and @type', () => {
		const ld = organizationLd();
		expect(ld['@context']).toBe('https://schema.org');
		expect(ld['@type']).toBe('Organization');
	});

	it('includes SITE_NAME and SITE_URL', () => {
		const ld = organizationLd();
		expect(ld.name).toBe(SITE_NAME);
		expect(ld.url).toBe(SITE_URL);
	});
});

describe('webSiteLd', () => {
	it('returns correct @context and @type', () => {
		const ld = webSiteLd();
		expect(ld['@context']).toBe('https://schema.org');
		expect(ld['@type']).toBe('WebSite');
	});

	it('includes SITE_NAME and SITE_URL', () => {
		const ld = webSiteLd();
		expect(ld.name).toBe(SITE_NAME);
		expect(ld.url).toBe(SITE_URL);
	});
});

describe('breadcrumbLd', () => {
	it('returns correct @context and @type', () => {
		const ld = breadcrumbLd([{ name: 'Home', url: SITE_URL }]);
		expect(ld['@context']).toBe('https://schema.org');
		expect(ld['@type']).toBe('BreadcrumbList');
	});

	it('numbers positions starting at 1', () => {
		const ld = breadcrumbLd([
			{ name: 'Home', url: SITE_URL },
			{ name: 'Services', url: `${SITE_URL}/services` },
			{ name: 'Frontend', url: `${SITE_URL}/services/frontend` }
		]);
		expect(ld.itemListElement[0].position).toBe(1);
		expect(ld.itemListElement[1].position).toBe(2);
		expect(ld.itemListElement[2].position).toBe(3);
	});

	it('maps name and url onto each ListItem', () => {
		const ld = breadcrumbLd([{ name: 'Home', url: 'https://example.com' }]);
		expect(ld.itemListElement[0].name).toBe('Home');
		expect(ld.itemListElement[0].item).toBe('https://example.com');
		expect(ld.itemListElement[0]['@type']).toBe('ListItem');
	});
});
