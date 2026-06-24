import { describe, it, expect } from 'vitest';
import { slugify } from './slugify';

describe('slugify', () => {
	it('lowercases and hyphenates spaces', () => {
		expect(slugify('Full Name')).toBe('full-name');
	});

	it('collapses runs of non-alphanumeric characters to a single hyphen', () => {
		expect(slugify('E-mail   address!!')).toBe('e-mail-address');
	});

	it('strips leading and trailing separators', () => {
		expect(slugify('  --Message-- ')).toBe('message');
	});

	it('leaves an already-slug value unchanged', () => {
		expect(slugify('email')).toBe('email');
	});

	it('returns an empty string when there are no alphanumerics', () => {
		expect(slugify('   ***   ')).toBe('');
	});
});
