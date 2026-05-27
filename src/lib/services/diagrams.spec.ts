import { describe, expect, it } from 'vitest';
import { getDiagram } from './diagrams';
import { SERVICES_INDEX } from './index';

describe('getDiagram', () => {
	it('returns the architecture diagram by slug', () => {
		const diagram = getDiagram('architecture');
		expect(diagram.title).toBe('discovery.map');
		expect(diagram.nodes.length).toBeGreaterThan(0);
		expect(diagram.edges.length).toBeGreaterThan(0);
	});

	it('has a matching diagram for every entry in SERVICES_INDEX', () => {
		for (const { slug } of SERVICES_INDEX) {
			const diagram = getDiagram(slug);
			expect(diagram.title, `missing diagram for ${slug}`).not.toBe('blueprint.map');
			expect(diagram.nodes.length, `${slug} has no nodes`).toBeGreaterThan(0);
		}
	});

	it('falls back to the placeholder diagram for unknown slugs', () => {
		const diagram = getDiagram('not-a-real-slug');
		expect(diagram.title).toBe('blueprint.map');
	});
});
