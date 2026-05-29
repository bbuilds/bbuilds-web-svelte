import { describe, expect, it } from 'vitest';
import type { RichTextDoc } from '$lib/types/post';
import { formatDate, kickerTag, parseTitleSegments, readTime, wordCount } from './format';

const doc = (...texts: string[]): RichTextDoc => ({
	type: 'doc',
	content: texts.map((text) => ({ type: 'paragraph', content: [{ type: 'text', text }] }))
});

const post = (overrides: { Category?: string[]; tag_list?: string[] } = {}) => ({
	category: overrides.Category ?? [],
	tagList: overrides.tag_list ?? []
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
		const { category, tagList } = post({ Category: ['Design', 'Dev'], tag_list: ['Other'] });
		expect(kickerTag(category, tagList)).toBe('Design');
	});

	it('falls back to the first tag when Category is empty', () => {
		const { category, tagList } = post({ Category: [], tag_list: ['Engineering'] });
		expect(kickerTag(category, tagList)).toBe('Engineering');
	});

	it('returns "Writing" when both Category and tag_list are empty', () => {
		const { category, tagList } = post();
		expect(kickerTag(category, tagList)).toBe('Writing');
	});

	it('filters out numeric category entries', () => {
		expect(kickerTag([42, 'Design'], [])).toBe('Design');
	});

	it('returns "Writing" when category is undefined', () => {
		expect(kickerTag(undefined, [])).toBe('Writing');
	});
});

describe('parseTitleSegments', () => {
	it('returns an empty array for empty/nullish input', () => {
		expect(parseTitleSegments('')).toEqual([]);
		expect(parseTitleSegments(null)).toEqual([]);
		expect(parseTitleSegments(undefined)).toEqual([]);
	});

	it('returns a single non-underlined segment when no tags are present', () => {
		expect(parseTitleSegments('Recent posts')).toEqual([
			{ text: 'Recent posts', underline: false, hand: false }
		]);
	});

	it('marks the wrapped word as underlined and preserves surrounding text', () => {
		expect(parseTitleSegments('Recent <un>posts</un>')).toEqual([
			{ text: 'Recent ', underline: false, hand: false },
			{ text: 'posts', underline: true, hand: false }
		]);
	});

	it('handles a tag at the start of the title', () => {
		expect(parseTitleSegments('<un>Latest</un> writing')).toEqual([
			{ text: 'Latest', underline: true, hand: false },
			{ text: ' writing', underline: false, hand: false }
		]);
	});

	it('handles a tag in the middle of the title', () => {
		expect(parseTitleSegments('Field <un>notes</un> from the road')).toEqual([
			{ text: 'Field ', underline: false, hand: false },
			{ text: 'notes', underline: true, hand: false },
			{ text: ' from the road', underline: false, hand: false }
		]);
	});

	it('supports multiple <un> tags in one title', () => {
		expect(parseTitleSegments('<un>Field</un> notes from the <un>road</un>')).toEqual([
			{ text: 'Field', underline: true, hand: false },
			{ text: ' notes from the ', underline: false, hand: false },
			{ text: 'road', underline: true, hand: false }
		]);
	});

	it('supports multi-word tag contents', () => {
		expect(parseTitleSegments('Some <un>two words</un> here')).toEqual([
			{ text: 'Some ', underline: false, hand: false },
			{ text: 'two words', underline: true, hand: false },
			{ text: ' here', underline: false, hand: false }
		]);
	});

	it('marks <ha> segments as hand and not underline', () => {
		expect(parseTitleSegments('Welcome to <ha>focus.</ha>')).toEqual([
			{ text: 'Welcome to ', underline: false, hand: false },
			{ text: 'focus.', underline: false, hand: true }
		]);
	});

	it('supports mixed <un> and <ha> tags', () => {
		expect(parseTitleSegments('Bring your <un>vision</un> into <ha>focus.</ha>')).toEqual([
			{ text: 'Bring your ', underline: false, hand: false },
			{ text: 'vision', underline: true, hand: false },
			{ text: ' into ', underline: false, hand: false },
			{ text: 'focus.', underline: false, hand: true }
		]);
	});

	it('is stateless across repeated calls (regex lastIndex reset)', () => {
		const input = '<un>A</un> b';
		expect(parseTitleSegments(input)).toEqual(parseTitleSegments(input));
	});
});
