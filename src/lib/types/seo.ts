export type ResolvedSEO = {
	title: string;
	ogTitle: string;
	ogType: string;
	description?: string;
	canonical: string;
	ogUrl: string;
	ogImage?: { url: string; width?: number; height?: number; alt?: string };
	noIndex: boolean;
	noFollow: boolean;
	jsonLd: object[];
};
