export type RichTextMark =
	| { type: 'bold' }
	| { type: 'italic' }
	| { type: 'underline' }
	| { type: 'strike' }
	| { type: 'code' }
	| { type: 'textStyle'; attrs?: { color?: string } }
	| {
			type: 'link';
			attrs: {
				href: string;
				target?: string | null;
				linktype?: 'url' | 'story' | 'email' | 'asset';
				anchor?: string | null;
				uuid?: string | null;
			};
	  };

export interface RichTextNode {
	type: string;
	content?: RichTextNode[];
	marks?: RichTextMark[];
	text?: string;
	attrs?: Record<string, unknown>;
}

export interface RichTextDoc {
	type: 'doc';
	content: RichTextNode[];
}

export interface StoryblokAsset {
	filename: string;
	alt?: string;
	title?: string;
}

export interface Post {
	slug: string;
	name: string;
	first_published_at: string;
	tag_list: string[];
	content: {
		summary: string;
		featured_image: StoryblokAsset;
		Category: string[];
		content: RichTextDoc;
	};
}
