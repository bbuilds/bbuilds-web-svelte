import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import RichTextTable from './RichTextTable.svelte';
import type { RichTextNode } from '$lib/types/post';

const textNode = (text: string): RichTextNode => ({ type: 'text', text });

const cell = (
	text: string,
	attrs: Record<string, unknown> = {},
	type: 'tableCell' | 'tableHeader' = 'tableCell'
): RichTextNode => ({
	type,
	attrs: { colspan: 1, rowspan: 1, colwidth: null, backgroundColor: null, ...attrs },
	content: [{ type: 'paragraph', content: [textNode(text)] }]
});

const header = (text: string, attrs: Record<string, unknown> = {}): RichTextNode =>
	cell(text, attrs, 'tableHeader');

const row = (...cells: RichTextNode[]): RichTextNode => ({ type: 'tableRow', content: cells });

const table = (...rows: RichTextNode[]): RichTextNode => ({ type: 'table', content: rows });

describe('RichTextTable', () => {
	it('renders plain tableCell rows in <tbody> with no <thead>', async () => {
		const { container } = await render(RichTextTable, {
			node: table(row(cell('a'), cell('b')), row(cell('c'), cell('d')))
		});
		expect(container.querySelector('thead')).toBeNull();
		expect(container.querySelectorAll('table > tbody > tr')).toHaveLength(2);
		expect(container.querySelectorAll('tbody td')).toHaveLength(4);
		expect(container.querySelector('th')).toBeNull();
	});

	it('promotes leading all-tableHeader rows into <thead> as th[scope=col]', async () => {
		const { container } = await render(RichTextTable, {
			node: table(row(header('Category'), header('Role')), row(cell('Filesystem'), cell('Read')))
		});
		const ths = container.querySelectorAll('thead > tr > th');
		expect(ths).toHaveLength(2);
		ths.forEach((th) => expect(th.getAttribute('scope')).toBe('col'));
		expect(ths[0]?.textContent).toBe('Category');
		expect(container.querySelectorAll('tbody > tr')).toHaveLength(1);
		expect(container.querySelector('tbody td')?.textContent).toBe('Filesystem');
	});

	it('renders a tableHeader inside a body row as th[scope=row]', async () => {
		const { container } = await render(RichTextTable, {
			node: table(row(header('Label'), cell('value')))
		});
		expect(container.querySelector('thead')).toBeNull();
		const th = container.querySelector('tbody th');
		expect(th?.getAttribute('scope')).toBe('row');
		expect(container.querySelector('tbody td')?.getAttribute('scope')).toBeNull();
	});

	it('does not promote a row that mixes tableHeader and tableCell', async () => {
		const { container } = await render(RichTextTable, {
			node: table(row(header('h'), cell('c')), row(cell('x'), cell('y')))
		});
		expect(container.querySelector('thead')).toBeNull();
		expect(container.querySelectorAll('tbody > tr')).toHaveLength(2);
	});

	it('emits colspan/rowspan only when greater than 1', async () => {
		const { container } = await render(RichTextTable, {
			node: table(row(cell('wide', { colspan: 2, rowspan: 3 }), cell('plain')))
		});
		const [wide, plain] = container.querySelectorAll('td');
		expect(wide?.getAttribute('colspan')).toBe('2');
		expect(wide?.getAttribute('rowspan')).toBe('3');
		expect(plain?.hasAttribute('colspan')).toBe(false);
		expect(plain?.hasAttribute('rowspan')).toBe(false);
	});

	it('applies backgroundColor as an inline background, omitting it when null', async () => {
		const { container } = await render(RichTextTable, {
			node: table(row(cell('tinted', { backgroundColor: 'rgb(255, 205, 103)' }), cell('plain')))
		});
		const [tinted, plain] = container.querySelectorAll('td');
		expect(tinted?.style.backgroundColor).toBe('rgb(255, 205, 103)');
		expect(plain?.style.backgroundColor).toBe('');
	});

	it('ignores colwidth', async () => {
		const { container } = await render(RichTextTable, {
			node: table(row(cell('sized', { colwidth: [191] })))
		});
		const td = container.querySelector('td');
		expect(td?.hasAttribute('width')).toBe(false);
		expect(td?.style.width).toBe('');
	});

	it('renders nested rich text (bold marks, lists, links) inside cells', async () => {
		const { container } = await render(RichTextTable, {
			node: table(
				row(
					{
						type: 'tableCell',
						attrs: { colspan: 1, rowspan: 1 },
						content: [
							{
								type: 'paragraph',
								content: [{ type: 'text', text: 'Category', marks: [{ type: 'bold' }] }]
							}
						]
					},
					{
						type: 'tableCell',
						attrs: { colspan: 1, rowspan: 1 },
						content: [
							{
								type: 'bullet_list',
								content: [
									{
										type: 'list_item',
										content: [
											{
												type: 'paragraph',
												content: [
													{
														type: 'text',
														text: 'Search the web',
														marks: [
															{
																type: 'link',
																attrs: { href: 'https://example.com/search', target: '_blank' }
															}
														]
													}
												]
											}
										]
									},
									{
										type: 'list_item',
										content: [{ type: 'paragraph', content: [textNode('date and time')] }]
									}
								]
							}
						]
					}
				)
			)
		});
		expect(container.querySelector('td strong')?.textContent).toBe('Category');
		expect(container.querySelectorAll('td ul > li')).toHaveLength(2);
		const link = container.querySelector('td a');
		expect(link?.getAttribute('href')).toBe('https://example.com/search');
		expect(link?.textContent).toBe('Search the web');
	});
});
