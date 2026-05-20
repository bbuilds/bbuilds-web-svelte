import { describe, expect, it } from 'vitest';
import type { Post, RichTextDoc } from '$lib/types/post';
import { formatDate, kickerTag, readTime, wordCount } from './format';

const doc = (...texts: string[]): RichTextDoc => ({
	type: 'doc',
	content: texts.map((text) => ({ type: 'paragraph', content: [{ type: 'text', text }] }))
});

const post = (overrides: { Category?: string[]; tag_list?: string[] } = {}): Post => ({
	slug: 'test-post',
	name: 'Test Post',
	first_published_at: '2024-01-01T00:00:00Z',
	tag_list: overrides.tag_list ?? [],
	content: {
		summary: '',
		featured_image: { filename: '' },
		Category: overrides.Category ?? [],
		content: doc('placeholder')
	}
});

describe('formatDate', () => {
	it('formats a mid-year date correctly', () => {
		expect(formatDate('2024-06-15T00:00:00Z')).toBe('Jun 15, 2024');
	});

	it('formats January 1st correctly', () => {
		expect(formatDate('2024-01-01T00:00:00Z')).toBe('Jan 1, 2024');
	});

	it('formats December 31st correctly', () => {
		expect(formatDate('2023-12-31T00:00:00Z')).toBe('Dec 31, 2023');
	});

	it('uses UTC date, not local time', () => {
		// Midnight UTC is still the same UTC date regardless of local timezone
		expect(formatDate('2024-03-10T00:00:00Z')).toBe('Mar 10, 2024');
	});
});

describe('wordCount', () => {
	it('counts words across a single text node', () => {
		expect(wordCount(doc('hello world'))).toBe(2);
	});

	it('counts words across multiple paragraph nodes', () => {
		expect(wordCount(doc('one two', 'three four five'))).toBe(5);
	});

	it('handles extra whitespace between words', () => {
		expect(wordCount(doc('word   extra   spaces'))).toBe(3);
	});

	it('returns 0 for an empty doc', () => {
		expect(wordCount({ type: 'doc', content: [] })).toBe(0);
	});

	it('counts words in deeply nested nodes', () => {
		const nested: RichTextDoc = {
			type: 'doc',
			content: [
				{
					type: 'blockquote',
					content: [
						{
							type: 'paragraph',
							content: [{ type: 'text', text: 'deep nested words here' }]
						}
					]
				}
			]
		};
		expect(wordCount(nested)).toBe(4);
	});
});

describe('readTime', () => {
	it('returns at least 1 min read for very short content', () => {
		expect(readTime(doc('short'))).toBe('1 min read');
	});

	it('rounds to the nearest minute for ~200 words', () => {
		const text = 'word '.repeat(200).trim();
		expect(readTime(doc(text))).toBe('1 min read');
	});

	it('returns correct minutes for longer content', () => {
		const text = 'word '.repeat(400).trim();
		expect(readTime(doc(text))).toBe('2 min read');
	});

	it('rounds up when over half-way to next minute', () => {
		const text = 'word '.repeat(300).trim(); // 300 / 200 = 1.5 → rounds to 2
		expect(readTime(doc(text))).toBe('2 min read');
	});
});

describe('kickerTag', () => {
	it('returns the first Category when present', () => {
		expect(kickerTag(post({ Category: ['Design', 'Dev'], tag_list: ['Other'] }))).toBe('Design');
	});

	it('falls back to the first tag when Category is empty', () => {
		expect(kickerTag(post({ Category: [], tag_list: ['Engineering'] }))).toBe('Engineering');
	});

	it('returns "Writing" when both Category and tag_list are empty', () => {
		expect(kickerTag(post())).toBe('Writing');
	});
});
