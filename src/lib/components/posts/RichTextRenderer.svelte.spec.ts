import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import RichTextRenderer from './RichTextRenderer.svelte';
import type { RichTextDoc, RichTextNode } from '$lib/types/post';

const textNode = (text: string): RichTextNode => ({ type: 'text', text });

const doc = (...nodes: RichTextNode[]): RichTextDoc => ({ type: 'doc', content: nodes });

describe('RichTextRenderer', () => {
	describe('paragraph', () => {
		it('renders a <p> element', () => {
			const { container } = render(RichTextRenderer, {
				nodes: [{ type: 'paragraph', content: [textNode('hello')] }]
			});
			expect(container.querySelector('p')).not.toBeNull();
			expect(container.querySelector('p')?.textContent).toBe('hello');
		});
	});

	describe('heading', () => {
		it('renders <h2> when level is 2', () => {
			const { container } = render(RichTextRenderer, {
				nodes: [{ type: 'heading', attrs: { level: 2 }, content: [textNode('Title')] }]
			});
			expect(container.querySelector('h2')).not.toBeNull();
			expect(container.querySelector('h2')?.textContent).toBe('Title');
		});

		it('renders <h2> as default when level is not 3', () => {
			const { container } = render(RichTextRenderer, {
				nodes: [{ type: 'heading', attrs: { level: 4 }, content: [textNode('Title')] }]
			});
			expect(container.querySelector('h2')).not.toBeNull();
		});

		it('renders <h3> when level is 3', () => {
			const { container } = render(RichTextRenderer, {
				nodes: [{ type: 'heading', attrs: { level: 3 }, content: [textNode('Sub')] }]
			});
			expect(container.querySelector('h3')).not.toBeNull();
			expect(container.querySelector('h2')).toBeNull();
		});
	});

	describe('bullet_list', () => {
		it('renders <ul> with <li> items', () => {
			const { container } = render(RichTextRenderer, {
				nodes: [
					{
						type: 'bullet_list',
						content: [
							{ type: 'list_item', content: [textNode('one')] },
							{ type: 'list_item', content: [textNode('two')] }
						]
					}
				]
			});
			expect(container.querySelector('ul')).not.toBeNull();
			expect(container.querySelectorAll('li')).toHaveLength(2);
		});

		it('unwraps paragraph inside list_item', () => {
			const { container } = render(RichTextRenderer, {
				nodes: [
					{
						type: 'bullet_list',
						content: [
							{
								type: 'list_item',
								content: [{ type: 'paragraph', content: [textNode('unwrapped')] }]
							}
						]
					}
				]
			});
			expect(container.querySelector('li')?.textContent).toBe('unwrapped');
			expect(container.querySelector('li > p')).toBeNull();
		});
	});

	describe('ordered_list', () => {
		it('renders <ol> with <li> items', () => {
			const { container } = render(RichTextRenderer, {
				nodes: [
					{
						type: 'ordered_list',
						content: [
							{ type: 'list_item', content: [textNode('first')] },
							{ type: 'list_item', content: [textNode('second')] }
						]
					}
				]
			});
			expect(container.querySelector('ol')).not.toBeNull();
			expect(container.querySelectorAll('li')).toHaveLength(2);
		});
	});

	describe('code_block', () => {
		it('renders <pre><code> with text content', () => {
			const { container } = render(RichTextRenderer, {
				nodes: [
					{
						type: 'code_block',
						content: [textNode('const x = 1;')]
					}
				]
			});
			const code = container.querySelector('pre > code');
			expect(code).not.toBeNull();
			expect(code?.textContent).toBe('const x = 1;');
		});

		it('sets data-language attribute on <pre>', () => {
			const { container } = render(RichTextRenderer, {
				nodes: [
					{
						type: 'code_block',
						attrs: { language: 'typescript' },
						content: [textNode('let x: number')]
					}
				]
			});
			expect(container.querySelector('pre')?.getAttribute('data-language')).toBe('typescript');
		});
	});

	describe('blockquote', () => {
		it('renders <blockquote>', () => {
			const { container } = render(RichTextRenderer, {
				nodes: [{ type: 'blockquote', content: [textNode('a quote')] }]
			});
			expect(container.querySelector('blockquote')).not.toBeNull();
		});
	});

	describe('image', () => {
		it('renders <img> with src and alt', () => {
			const { container } = render(RichTextRenderer, {
				nodes: [{ type: 'image', attrs: { src: '/img.png', alt: 'a photo' } }]
			});
			const img = container.querySelector('img');
			expect(img?.getAttribute('src')).toBe('/img.png');
			expect(img?.getAttribute('alt')).toBe('a photo');
		});

		it('renders <figcaption> when caption is present', () => {
			const { container } = render(RichTextRenderer, {
				nodes: [{ type: 'image', attrs: { src: '/img.png', alt: '', caption: 'My caption' } }]
			});
			const caption = container.querySelector('figcaption');
			expect(caption).not.toBeNull();
			expect(caption?.textContent).toBe('My caption');
		});

		it('omits <figcaption> when caption is absent', () => {
			const { container } = render(RichTextRenderer, {
				nodes: [{ type: 'image', attrs: { src: '/img.png', alt: '' } }]
			});
			expect(container.querySelector('figcaption')).toBeNull();
		});
	});

	describe('horizontal_rule', () => {
		it('renders <hr>', () => {
			const { container } = render(RichTextRenderer, {
				nodes: [{ type: 'horizontal_rule' }]
			});
			expect(container.querySelector('hr')).not.toBeNull();
		});
	});

	describe('hard_break', () => {
		it('renders <br>', () => {
			const { container } = render(RichTextRenderer, {
				nodes: [{ type: 'hard_break' }]
			});
			expect(container.querySelector('br')).not.toBeNull();
		});
	});

	describe('doc prop', () => {
		it('accepts a doc object and renders its content', () => {
			const { container } = render(RichTextRenderer, {
				doc: doc({ type: 'paragraph', content: [textNode('from doc')] })
			});
			expect(container.querySelector('p')?.textContent).toBe('from doc');
		});
	});

	describe('unknown node type', () => {
		it('renders no visible elements for unrecognised node types', () => {
			const { container } = render(RichTextRenderer, {
				nodes: [{ type: 'custom_widget' }]
			});
			expect(container.children).toHaveLength(0);
		});
	});
});
