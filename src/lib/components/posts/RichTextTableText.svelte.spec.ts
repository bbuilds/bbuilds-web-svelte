import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import RichTextTableText from './RichTextTableText.svelte';
import type { RichTextNode } from '$lib/types/post';

const textNode = (text: string, marks: RichTextNode['marks'] = []): RichTextNode => ({
	type: 'text',
	text,
	marks
});

describe('RichTextTableText', () => {
	it('renders plain text when no marks', async () => {
		const { container } = await render(RichTextTableText, { node: textNode('hello') });
		expect(container.textContent).toBe('hello');
		expect(container.querySelector('strong, em, s, code, a, span')).toBeNull();
	});

	// Marks shared by the whole cell are stripped by RichTextTable before reaching this component,
	// so the ones that remain are partial and render inline.
	it('wraps bold mark in <strong>', async () => {
		const { container } = await render(RichTextTableText, {
			node: textNode('hi', [{ type: 'bold' }])
		});
		expect(container.querySelector('strong')?.textContent).toBe('hi');
	});

	it('wraps underline mark in an underlined <span>', async () => {
		const { container } = await render(RichTextTableText, {
			node: textNode('hi', [{ type: 'underline' }])
		});
		expect(container.querySelector('span')?.classList.contains('underline')).toBe(true);
	});

	it('applies textStyle color on a <span>', async () => {
		const { container } = await render(RichTextTableText, {
			node: textNode('hi', [{ type: 'textStyle', attrs: { color: '#ff0000' } }])
		});
		expect(container.querySelector('span')?.style.color).toBe('rgb(255, 0, 0)');
	});

	it('wraps italic mark in <em>', async () => {
		const { container } = await render(RichTextTableText, {
			node: textNode('hi', [{ type: 'italic' }])
		});
		expect(container.querySelector('em')?.textContent).toBe('hi');
	});

	it('wraps strike mark in <s>', async () => {
		const { container } = await render(RichTextTableText, {
			node: textNode('hi', [{ type: 'strike' }])
		});
		expect(container.querySelector('s')).not.toBeNull();
	});

	it('wraps code mark in <code>', async () => {
		const { container } = await render(RichTextTableText, {
			node: textNode('hi', [{ type: 'code' }])
		});
		expect(container.querySelector('code')).not.toBeNull();
	});

	it('applies marks innermost-first', async () => {
		const { container } = await render(RichTextTableText, {
			node: textNode('hi', [{ type: 'italic' }, { type: 'bold' }])
		});
		expect(container.querySelector('strong > em')?.textContent).toBe('hi');
	});

	it('wraps link mark in an unbolded <a>', async () => {
		const { container } = await render(RichTextTableText, {
			node: textNode('click', [{ type: 'link', attrs: { href: 'https://example.com' } }])
		});
		const a = container.querySelector('a');
		expect(a?.getAttribute('href')).toBe('https://example.com');
		expect(a?.classList.contains('font-semibold')).toBe(false);
		expect(a?.getAttribute('rel')).toBeNull();
	});

	it('adds rel="noopener noreferrer" for _blank links', async () => {
		const { container } = await render(RichTextTableText, {
			node: textNode('click', [
				{ type: 'link', attrs: { href: 'https://example.com', target: '_blank' } }
			])
		});
		const a = container.querySelector('a');
		expect(a?.getAttribute('rel')).toBe('noopener noreferrer');
		expect(a?.getAttribute('target')).toBe('_blank');
	});
});
