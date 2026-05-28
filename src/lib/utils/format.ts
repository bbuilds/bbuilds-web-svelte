import type { RichTextDoc, RichTextNode } from '$lib/types/post';

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

export const kickerTag = (category: (number | string)[] | undefined, tagList: string[]): string => {
	const cats = (category ?? []).filter((c): c is string => typeof c === 'string');
	if (cats.length > 0) return cats[0];
	if (tagList.length > 0) return tagList[0];
	return 'Writing';
};

export interface TocHeading {
	id: string;
	text: string;
}

export const slugify = (s: string): string =>
	s
		.toLowerCase()
		.trim()
		.replace(/&/g, 'and')
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-');

export const headingSlugs = (nodes: RichTextNode[]): (string | null)[] => {
	const counts = new Map<string, number>();
	return nodes.map((node) => {
		if (node.type !== 'heading' || (node.attrs?.level as number) !== 2) return null;
		const parts: string[] = [];
		collectText(node, parts);
		const base = slugify(parts.join(' '));
		const count = counts.get(base) ?? 0;
		counts.set(base, count + 1);
		return count === 0 ? base : `${base}-${count}`;
	});
};

export const extractHeadings = (nodes: RichTextNode[] | undefined): TocHeading[] => {
	if (!nodes) return [];
	const slugs = headingSlugs(nodes);
	return nodes.flatMap((node, i) => {
		const id = slugs[i];
		if (!id) return [];
		const parts: string[] = [];
		collectText(node, parts);
		return [{ id, text: parts.join(' ') }];
	});
};

export type TitleSegment = { text: string; underline: boolean; hand: boolean };

const TAG = /<(un|ha)>([\s\S]*?)<\/\1>/g;

export const parseTitleSegments = (title: string | null | undefined): TitleSegment[] => {
	if (!title) return [];
	const segments: TitleSegment[] = [];
	let lastIndex = 0;
	let match: RegExpExecArray | null;
	TAG.lastIndex = 0;
	while ((match = TAG.exec(title)) !== null) {
		if (match.index > lastIndex) {
			segments.push({ text: title.slice(lastIndex, match.index), underline: false, hand: false });
		}
		segments.push({ text: match[2], underline: match[1] === 'un', hand: match[1] === 'ha' });
		lastIndex = match.index + match[0].length;
	}
	if (lastIndex < title.length) {
		segments.push({ text: title.slice(lastIndex), underline: false, hand: false });
	}
	return segments;
};
