import type { RichTextNode } from '$lib/types/post';

interface RichtextDoc {
	type?: string;
	content?: RichtextDoc[];
	marks?: RichtextDoc[];
	attrs?: Record<string, unknown>;
	text?: string;
}

export const collectText = (node: RichTextNode, out: string[]): void => {
	if (node.text) out.push(node.text);
	if (node.content) for (const child of node.content) collectText(child, out);
};

export type Run = { text: string; bold: boolean; href?: string };
export type ListItem = { runs: Run[] };

export const parseListItems = (doc: RichtextDoc | undefined): ListItem[] => {
	const list = doc?.content?.find((n) => n.type === 'bullet_list');
	if (!list?.content) return [];
	return list.content
		.filter((li) => li.type === 'list_item')
		.map((li): ListItem => {
			const paragraph = li.content?.find((n) => n.type === 'paragraph');
			const runs: Run[] = [];
			for (const node of paragraph?.content ?? []) {
				if (node.type !== 'text' || !node.text) continue;
				const marks = node.marks ?? [];
				const bold = marks.some((m) => m.type === 'bold');
				const href = marks.find((m) => m.type === 'link')?.attrs?.href as string | undefined;
				runs.push({ text: node.text, bold, href });
			}
			return { runs };
		})
		.filter((it) => it.runs.length > 0);
};
