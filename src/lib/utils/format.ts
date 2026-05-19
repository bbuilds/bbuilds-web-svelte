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
