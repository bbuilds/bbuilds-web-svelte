import { describe, it, expect } from 'vitest';
import { parseHighlights } from './parseHighlights';

describe('parseHighlights', () => {
	it('returns a single plain segment when there are no tags', () => {
		expect(parseHighlights('hello world')).toEqual([{ text: 'hello world', highlight: false }]);
	});

	it('returns an empty array for an empty string', () => {
		expect(parseHighlights('')).toEqual([]);
	});

	it('parses a single <hl> tag in the middle', () => {
		expect(parseHighlights('we engineer the <hl>narrative</hl>, ensuring')).toEqual([
			{ text: 'we engineer the ', highlight: false },
			{ text: 'narrative', highlight: true },
			{ text: ', ensuring', highlight: false }
		]);
	});

	it('parses a <hl> tag at the start', () => {
		expect(parseHighlights('<hl>Discovery</hl> is where we begin')).toEqual([
			{ text: 'Discovery', highlight: true },
			{ text: ' is where we begin', highlight: false }
		]);
	});

	it('parses a <hl> tag at the end', () => {
		expect(parseHighlights('built on <hl>truth</hl>')).toEqual([
			{ text: 'built on ', highlight: false },
			{ text: 'truth', highlight: true }
		]);
	});

	it('parses multiple <hl> tags', () => {
		expect(parseHighlights('find the <hl>why</hl> behind the <hl>what</hl>')).toEqual([
			{ text: 'find the ', highlight: false },
			{ text: 'why', highlight: true },
			{ text: ' behind the ', highlight: false },
			{ text: 'what', highlight: true }
		]);
	});

	it('handles a string that is entirely a <hl> tag', () => {
		expect(parseHighlights('<hl>narrative</hl>')).toEqual([{ text: 'narrative', highlight: true }]);
	});

	it('handles adjacent <hl> tags with no text between them', () => {
		expect(parseHighlights('<hl>one</hl><hl>two</hl>')).toEqual([
			{ text: 'one', highlight: true },
			{ text: 'two', highlight: true }
		]);
	});
});
