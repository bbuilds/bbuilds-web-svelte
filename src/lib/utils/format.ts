import type { Post, RichTextDoc, RichTextNode } from '$lib/types/post';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const formatDate = (iso: string): string => {
	const d = new Date(iso);
	return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
};

const collectText = (node: RichTextNode, out: string[]): void => {
	if (node.text) out.push(node.text);
	if (node.content) for (const child of node.content) collectText(child, out);
};

export const wordCount = (doc: RichTextDoc): number => {
	const parts: string[] = [];
	for (const node of doc.content) collectText(node, parts);
	return parts
		.join(' ')
		.split(/\s+/)
		.filter((w) => w.length > 0).length;
};

export const readTime = (doc: RichTextDoc): string => {
	const minutes = Math.max(1, Math.round(wordCount(doc) / 200));
	return `${minutes} min read`;
};

export const kickerTag = (post: Post): string => {
	if (post.content.Category.length > 0) return post.content.Category[0];
	if (post.tag_list.length > 0) return post.tag_list[0];
	return 'Writing';
};

export type TitleSegment = { text: string; underline: boolean };

const UN_TAG = /<un>([\s\S]*?)<\/un>/g;

export const parseTitleSegments = (title: string | null | undefined): TitleSegment[] => {
	if (!title) return [];
	const segments: TitleSegment[] = [];
	let lastIndex = 0;
	let match: RegExpExecArray | null;
	UN_TAG.lastIndex = 0;
	while ((match = UN_TAG.exec(title)) !== null) {
		if (match.index > lastIndex) {
			segments.push({ text: title.slice(lastIndex, match.index), underline: false });
		}
		segments.push({ text: match[1], underline: true });
		lastIndex = match.index + match[0].length;
	}
	if (lastIndex < title.length) {
		segments.push({ text: title.slice(lastIndex), underline: false });
	}
	return segments;
};
