import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, SITE_LOGO, SOCIAL_LINKS } from '$lib/config/site';
import type { ServiceLink } from './services';

export function organizationLd(services: ServiceLink[] = []) {
	return {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: SITE_NAME,
		url: SITE_URL,
		description: SITE_DESCRIPTION,
		logo: SITE_LOGO,
		founder: {
			'@type': 'Person',
			name: SITE_NAME
		},
		knowsAbout: [
			'Digital Strategy',
			'Product Engineering',
			'Systems Architecture',
			'Applied Intelligence',
			'Storytelling',
			'Mobile Development',
			'Web Development',
			'Content Strategy',
			'Application Development',
			'Software Development',
			'Brand Strategy',
			'User Interfaces',
			'UX Design'
		],
		sameAs: SOCIAL_LINKS,
		hasOfferCatalog: {
			'@type': 'OfferCatalog',
			name: 'Services',
			itemListElement: services.map((service) => ({
				'@type': 'Offer',
				itemOffered: {
					'@type': 'Service',
					name: service.name,
					url: `${SITE_URL}/${service.slug}`
				}
			}))
		},
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': SITE_URL
		}
	};
}

export function webSiteLd() {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: SITE_NAME,
		url: SITE_URL
	};
}

interface BreadcrumbItem {
	name: string;
	url: string;
}

export function breadcrumbLd(items: BreadcrumbItem[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: item.name,
			item: item.url
		}))
	};
}
