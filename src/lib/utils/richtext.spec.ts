import { describe, expect, it } from 'vitest';
import type { RichTextNode } from '$lib/types/post';
import { collectText, parseListItems } from './richtext';

function textNode(
	text: string,
	marks: { type: string; attrs?: Record<string, unknown> }[] = []
): RichTextNode {
	return { type: 'text', text, marks } as RichTextNode;
}

function paragraph(...nodes: RichTextNode[]): RichTextNode {
	return { type: 'paragraph', content: nodes };
}

function listItem(...paragraphs: RichTextNode[]): object {
	return { type: 'list_item', content: paragraphs };
}

function bulletList(...items: object[]): object {
	return { type: 'bullet_list', content: items };
}

function doc(...children: object[]): object {
	return { type: 'doc', content: children };
}

describe('collectText', () => {
	it('collects text from a single text node', () => {
		const out: string[] = [];
		collectText(textNode('hello'), out);
		expect(out).toEqual(['hello']);
	});

	it('collects text recursively from nested nodes', () => {
		const node: RichTextNode = {
			type: 'paragraph',
			content: [textNode('one'), textNode('two')]
		};
		const out: string[] = [];
		collectText(node, out);
		expect(out).toEqual(['one', 'two']);
	});

	it('handles nodes with no text and no content', () => {
		const out: string[] = [];
		collectText({ type: 'hardBreak' }, out);
		expect(out).toEqual([]);
	});
});

describe('parseListItems', () => {
	it('returns empty array for undefined input', () => {
		expect(parseListItems(undefined)).toEqual([]);
	});

	it('returns empty array when no bullet_list node exists', () => {
		expect(parseListItems(doc(paragraph(textNode('plain'))))).toEqual([]);
	});

	it('parses plain text runs', () => {
		const items = parseListItems(doc(bulletList(listItem(paragraph(textNode('hello world'))))));
		expect(items).toEqual([{ runs: [{ text: 'hello world', bold: false, href: undefined }] }]);
	});

	it('parses bold marks', () => {
		const items = parseListItems(
			doc(bulletList(listItem(paragraph(textNode('Bold.', [{ type: 'bold' }])))))
		);
		expect(items[0].runs[0].bold).toBe(true);
	});

	it('parses link marks', () => {
		const items = parseListItems(
			doc(
				bulletList(
					listItem(
						paragraph(textNode('click', [{ type: 'link', attrs: { href: 'https://example.com' } }]))
					)
				)
			)
		);
		expect(items[0].runs[0].href).toBe('https://example.com');
	});

	it('parses mixed bold + plain runs in one item', () => {
		const items = parseListItems(
			doc(
				bulletList(
					listItem(paragraph(textNode('Label.', [{ type: 'bold' }]), textNode(' description text')))
				)
			)
		);
		expect(items[0].runs).toEqual([
			{ text: 'Label.', bold: true, href: undefined },
			{ text: ' description text', bold: false, href: undefined }
		]);
	});

	it('filters out empty list items', () => {
		const items = parseListItems(doc(bulletList(listItem(paragraph()))));
		expect(items).toEqual([]);
	});

	it('handles missing paragraph content gracefully', () => {
		const items = parseListItems(doc(bulletList({ type: 'list_item' })));
		expect(items).toEqual([]);
	});
});
