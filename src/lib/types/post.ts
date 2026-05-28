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
