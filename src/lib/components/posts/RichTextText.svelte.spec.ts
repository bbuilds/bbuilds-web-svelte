import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import RichTextText from './RichTextText.svelte';
import type { RichTextNode } from '$lib/types/post';

const textNode = (text: string, marks: RichTextNode['marks'] = []): RichTextNode => ({
	type: 'text',
	text,
	marks
});

describe('RichTextText', () => {
	it('renders plain text when no marks', () => {
		const { container } = render(RichTextText, { node: textNode('hello') });
		expect(container.textContent).toBe('hello');
		expect(container.querySelector('strong, em, s, code, a, span')).toBeNull();
	});

	it('wraps bold mark in <strong>', () => {
		const { container } = render(RichTextText, { node: textNode('hi', [{ type: 'bold' }]) });
		expect(container.querySelector('strong')).not.toBeNull();
		expect(container.querySelector('strong')?.textContent).toBe('hi');
	});

	it('wraps italic mark in <em>', () => {
		const { container } = render(RichTextText, { node: textNode('hi', [{ type: 'italic' }]) });
		expect(container.querySelector('em')).not.toBeNull();
	});

	it('wraps underline mark in <span>', () => {
		const { container } = render(RichTextText, { node: textNode('hi', [{ type: 'underline' }]) });
		const span = container.querySelector('span');
		expect(span).not.toBeNull();
		expect(span?.className).toContain('underline');
	});

	it('wraps strike mark in <s>', () => {
		const { container } = render(RichTextText, { node: textNode('hi', [{ type: 'strike' }]) });
		expect(container.querySelector('s')).not.toBeNull();
	});

	it('wraps code mark in <code>', () => {
		const { container } = render(RichTextText, { node: textNode('hi', [{ type: 'code' }]) });
		expect(container.querySelector('code')).not.toBeNull();
	});

	it('wraps link mark in <a> with correct href', () => {
		const { container } = render(RichTextText, {
			node: textNode('click', [{ type: 'link', attrs: { href: 'https://example.com' } }])
		});
		const a = container.querySelector('a');
		expect(a?.getAttribute('href')).toBe('https://example.com');
	});

	it('adds rel="noopener noreferrer" for _blank links', () => {
		const { container } = render(RichTextText, {
			node: textNode('click', [
				{ type: 'link', attrs: { href: 'https://example.com', target: '_blank' } }
			])
		});
		const a = container.querySelector('a');
		expect(a?.getAttribute('rel')).toBe('noopener noreferrer');
		expect(a?.getAttribute('target')).toBe('_blank');
	});

	it('omits rel when link target is not _blank', () => {
		const { container } = render(RichTextText, {
			node: textNode('click', [{ type: 'link', attrs: { href: '/page', target: null } }])
		});
		expect(container.querySelector('a')?.getAttribute('rel')).toBeNull();
	});

	it('applies textStyle color via inline style', () => {
		const { container } = render(RichTextText, {
			node: textNode('hi', [{ type: 'textStyle', attrs: { color: '#ff0000' } }])
		});
		const span = container.querySelector('span');
		expect(span?.style.color).toBe('rgb(255, 0, 0)');
	});

	it('nests marks — bold wrapping italic renders <strong><em>', () => {
		const { container } = render(RichTextText, {
			node: textNode('hi', [{ type: 'italic' }, { type: 'bold' }])
		});
		// bold is outermost (last mark), italic is inner
		expect(container.querySelector('strong > em')).not.toBeNull();
	});
});
