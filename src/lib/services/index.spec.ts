import { describe, expect, it } from 'vitest';
import { SERVICES_INDEX } from './index';

describe('SERVICES_INDEX', () => {
	it('has 5 entries', () => {
		expect(SERVICES_INDEX).toHaveLength(5);
	});

	it('has unique slugs', () => {
		const slugs = SERVICES_INDEX.map((s) => s.slug);
		expect(new Set(slugs).size).toBe(slugs.length);
	});

	it('every entry has non-empty required fields', () => {
		for (const entry of SERVICES_INDEX) {
			expect(entry.slug, 'slug').toBeTruthy();
			expect(entry.n, `n on ${entry.slug}`).toBeTruthy();
			expect(entry.title, `title on ${entry.slug}`).toBeTruthy();
			expect(entry.sub, `sub on ${entry.slug}`).toBeTruthy();
		}
	});
});
