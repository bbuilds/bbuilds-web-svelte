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

	it('renders a header-only table as <thead> with no <tbody>', async () => {
		const { container } = await render(RichTextTable, {
			node: table(row(header('Category'), header('Role')))
		});
		expect(container.querySelectorAll('thead > tr > th')).toHaveLength(2);
		expect(container.querySelector('tbody')).toBeNull();
	});

	it('renders nothing for a table with no rows', async () => {
		const { container } = await render(RichTextTable, { node: table() });
		expect(container.querySelector('table')).toBeNull();
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
		const [bold] = container.querySelectorAll('td');
		expect(bold?.querySelector('strong')).toBeNull();
		expect(bold?.classList.contains('font-bold')).toBe(true);
		expect(bold?.textContent?.trim()).toBe('Category');
		expect(container.querySelectorAll('td ul > li')).toHaveLength(2);
		const link = container.querySelector('td a');
		expect(link?.getAttribute('href')).toBe('https://example.com/search');
		expect(link?.textContent).toBe('Search the web');
	});

	describe('cell-scoped rich text', () => {
		const marked = (text: string, marks: RichTextNode['marks']): RichTextNode => ({
			type: 'tableCell',
			attrs: { colspan: 1, rowspan: 1 },
			content: [{ type: 'paragraph', content: [{ type: 'text', text, marks }] }]
		});

		it('renders no <p>, <span> or <strong> inside cells', async () => {
			const { container } = await render(RichTextTable, {
				node: table(
					row(
						marked('styled', [
							{ type: 'bold' },
							{ type: 'underline' },
							{ type: 'textStyle', attrs: { color: '#ff0000' } }
						]),
						cell('plain')
					)
				)
			});
			expect(container.querySelector('table :is(p, span, strong)')).toBeNull();
			expect(container.querySelector('td')?.textContent?.trim()).toBe('styled');
		});

		it('hoists underline and textStyle color onto the cell', async () => {
			const { container } = await render(RichTextTable, {
				node: table(
					row(
						marked('under', [{ type: 'underline' }]),
						marked('red', [{ type: 'textStyle', attrs: { color: '#ff0000' } }]),
						cell('plain')
					)
				)
			});
			const [under, red, plain] = container.querySelectorAll('td');
			expect(under?.classList.contains('underline')).toBe(true);
			expect(red?.style.color).toBe('rgb(255, 0, 0)');
			expect(plain?.classList.contains('underline')).toBe(false);
			expect(plain?.classList.contains('font-bold')).toBe(false);
			expect(plain?.style.color).toBe('');
		});

		it('uses font-bold instead of font-semibold on a bold header', async () => {
			const { container } = await render(RichTextTable, {
				node: table(
					row({ ...marked('Bold', [{ type: 'bold' }]), type: 'tableHeader' }, header('Plain'))
				)
			});
			const [bold, plain] = container.querySelectorAll('th');
			expect(bold?.classList.contains('font-bold')).toBe(true);
			expect(bold?.classList.contains('font-semibold')).toBe(false);
			expect(plain?.classList.contains('font-semibold')).toBe(true);
			expect(plain?.classList.contains('font-bold')).toBe(false);
		});

		it('renders links without bold', async () => {
			const { container } = await render(RichTextTable, {
				node: table(
					row(marked('docs', [{ type: 'link', attrs: { href: '/docs', target: '_blank' } }]))
				)
			});
			const link = container.querySelector('td a');
			expect(link?.getAttribute('href')).toBe('/docs');
			expect(link?.getAttribute('rel')).toBe('noopener noreferrer');
			expect(link?.classList.contains('font-semibold')).toBe(false);
		});

		const run = (text: string, marks: RichTextNode['marks'] = []): RichTextNode => ({
			type: 'text',
			text,
			marks
		});

		const cellOf = (...content: RichTextNode[]): RichTextNode => ({
			type: 'tableCell',
			attrs: { colspan: 1, rowspan: 1 },
			content
		});

		it('keeps a partial mark inline instead of styling the whole cell', async () => {
			const { container } = await render(RichTextTable, {
				node: table(
					row(
						cellOf({
							type: 'paragraph',
							content: [run('Note:', [{ type: 'bold' }]), run(' read-only')]
						})
					)
				)
			});
			const td = container.querySelector('td');
			expect(td?.classList.contains('font-bold')).toBe(false);
			expect(td?.querySelector('strong')?.textContent).toBe('Note:');
		});

		it('hoists a mark every run carries and keeps the other marks inline', async () => {
			const { container } = await render(RichTextTable, {
				node: table(
					row(
						cellOf({
							type: 'paragraph',
							content: [
								run('plain ', [{ type: 'bold' }]),
								run('slanted', [{ type: 'bold' }, { type: 'italic' }])
							]
						})
					)
				)
			});
			const td = container.querySelector('td');
			expect(td?.classList.contains('font-bold')).toBe(true);
			expect(td?.querySelector('strong')).toBeNull();
			expect(td?.querySelector('em')?.textContent).toBe('slanted');
		});

		it('keeps differing textStyle colors inline', async () => {
			const { container } = await render(RichTextTable, {
				node: table(
					row(
						cellOf({
							type: 'paragraph',
							content: [
								run('red', [{ type: 'textStyle', attrs: { color: '#ff0000' } }]),
								run('blue', [{ type: 'textStyle', attrs: { color: '#0000ff' } }])
							]
						})
					)
				)
			});
			const td = container.querySelector('td');
			expect(td?.style.color).toBe('');
			const spans = td?.querySelectorAll('span');
			expect(spans).toHaveLength(2);
			expect(spans?.[0]?.style.color).toBe('rgb(255, 0, 0)');
		});

		it('takes the cell color from a later textStyle when the first has none', async () => {
			const { container } = await render(RichTextTable, {
				node: table(
					row(
						marked('red', [
							{ type: 'textStyle', attrs: {} },
							{ type: 'textStyle', attrs: { color: '#ff0000' } }
						])
					)
				)
			});
			const td = container.querySelector('td');
			expect(td?.style.color).toBe('rgb(255, 0, 0)');
			expect(td?.querySelector('span')).toBeNull();
		});

		it('keeps the text of headings and code blocks, rendered inline', async () => {
			const { container } = await render(RichTextTable, {
				node: table(
					row(
						cellOf(
							{ type: 'paragraph', content: [textNode('intro')] },
							{ type: 'heading', attrs: { level: 3 }, content: [textNode('Heading')] },
							{ type: 'code_block', content: [textNode('npm i')] }
						)
					)
				)
			});
			const td = container.querySelector('td');
			expect(td?.querySelector('h1, h2, h3, h4, pre, p')).toBeNull();
			expect(td?.querySelectorAll('br')).toHaveLength(2);
			expect(td?.textContent).toContain('Heading');
			expect(td?.textContent).toContain('npm i');
		});

		it('separates consecutive paragraphs with a single <br>', async () => {
			const { container } = await render(RichTextTable, {
				node: table(
					row({
						type: 'tableCell',
						attrs: { colspan: 1, rowspan: 1 },
						content: [
							{ type: 'paragraph', content: [textNode('first')] },
							{ type: 'paragraph', content: [textNode('second')] }
						]
					})
				)
			});
			const td = container.querySelector('td');
			expect(td?.querySelectorAll('br')).toHaveLength(1);
			expect(td?.textContent).toContain('first');
			expect(td?.textContent).toContain('second');
		});
	});
});
