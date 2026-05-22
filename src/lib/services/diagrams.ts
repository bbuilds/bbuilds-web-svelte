import type { Diagram } from './types';

const PLACEHOLDER_DIAGRAM: Diagram = {
	title: 'blueprint.map',
	cmd: './blueprint-engine.sh --status=pending',
	nodes: [
		{ id: 'in', x: 130, y: 180, label: 'INPUTS' },
		{ id: 'proc', x: 260, y: 180, label: 'PROCESSING', w: 130, hot: true },
		{ id: 'out', x: 390, y: 180, label: 'OUTPUT' }
	],
	edges: [
		{ from: 'in', to: 'proc', hot: true },
		{ from: 'proc', to: 'out', hot: true }
	]
};

export const DIAGRAMS: Record<string, Diagram> = {
	architecture: {
		title: 'discovery.map',
		cmd: './discovery-engine.sh --inputs=brand,market,ux,analytics,tech --output=blueprint.md',
		nodes: [
			{ id: 'brand', x: 260, y: 60, label: 'BRAND' },
			{ id: 'market', x: 407, y: 146, label: 'MARKET RESEARCH', w: 150 },
			{ id: 'ux', x: 351, y: 286, label: 'UX' },
			{ id: 'analytics', x: 169, y: 286, label: 'ANALYTICS' },
			{ id: 'tech', x: 113, y: 146, label: 'TECH AUDIT', w: 120 },
			{ id: 'bp', x: 260, y: 185, label: 'BLUEPRINT', w: 130, hot: true }
		],
		edges: [
			{ from: 'brand', to: 'market' },
			{ from: 'market', to: 'ux' },
			{ from: 'ux', to: 'analytics' },
			{ from: 'analytics', to: 'tech' },
			{ from: 'tech', to: 'brand' },
			{ from: 'brand', to: 'bp', hot: true },
			{ from: 'market', to: 'bp', hot: true },
			{ from: 'ux', to: 'bp', hot: true },
			{ from: 'analytics', to: 'bp', hot: true },
			{ from: 'tech', to: 'bp', hot: true }
		]
	}
};

export const getDiagram = (slug: string): Diagram => DIAGRAMS[slug] ?? PLACEHOLDER_DIAGRAM;
