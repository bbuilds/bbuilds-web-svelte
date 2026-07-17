import type { RichTextDoc, RichTextNode } from '$lib/types/post';
import { collectText } from '$lib/utils/richtext';
export { collectText } from '$lib/utils/richtext';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const formatDate = (iso: string): string => {
	const d = new Date(iso);
	return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
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
	const firstCat = cats[0];
	if (firstCat !== undefined) return firstCat;
	const firstTag = tagList[0];
	if (firstTag !== undefined) return firstTag;
	return 'Writing';
};

export interface TocHeading {
	id: string;
	text: string;
	level: 2 | 3;
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
		const level = node.attrs?.level as number;
		if (node.type !== 'heading' || (level !== 2 && level !== 3)) return null;
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
		const level = (node.attrs?.level as number) === 3 ? 3 : 2;
		return [{ id, text: parts.join(' '), level }];
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
		segments.push({ text: match[2] ?? '', underline: match[1] === 'un', hand: match[1] === 'ha' });
		lastIndex = match.index + match[0].length;
	}
	if (lastIndex < title.length) {
		segments.push({ text: title.slice(lastIndex), underline: false, hand: false });
	}
	return segments;
};
