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
	},
	engineering: {
		title: 'engineering.stack',
		cmd: 'npm run deploy --stack=full --env=production',
		nodes: [
			{ id: 'frontend', x: 60, y: 110, label: 'FRONTEND', tag: 'react · next.js', w: 80 },
			{ id: 'mobile', x: 60, y: 230, label: 'MOBILE', tag: 'rn · swift · kotlin', w: 80 },
			{ id: 'api', x: 165, y: 170, label: 'API LAYER', tag: 'gateway', w: 80 },
			{ id: 'backend', x: 270, y: 80, label: 'BACKEND', tag: 'node.js · php', w: 80 },
			{ id: 'cms', x: 270, y: 170, label: 'CMS', tag: 'headless', w: 80 },
			{ id: 'commerce', x: 270, y: 260, label: 'COMMERCE', tag: 'stripe · pos', w: 80 },
			{ id: 'harden', x: 365, y: 170, label: 'CI / CD', tag: 'harden · test', w: 80 },
			{ id: 'deploy', x: 460, y: 170, label: 'PRODUCTION', tag: 'v1.0', w: 80, hot: true }
		],
		edges: [
			{ from: 'frontend', to: 'api' },
			{ from: 'mobile', to: 'api' },
			{ from: 'api', to: 'backend' },
			{ from: 'api', to: 'cms' },
			{ from: 'api', to: 'commerce' },
			{ from: 'backend', to: 'harden' },
			{ from: 'cms', to: 'harden' },
			{ from: 'commerce', to: 'harden' },
			{ from: 'harden', to: 'deploy', hot: true }
		]
	},
	intelligence: {
		title: 'intelligence.graph',
		cmd: 'agent run --grounded --observable --autonomous',
		nodes: [
			{ id: 'prompt', x: 70, y: 75, label: 'PROMPT', tag: 'user input' },
			{ id: 'data', x: 70, y: 185, label: 'DATA', tag: 'sources · corpus' },
			{ id: 'rag', x: 250, y: 75, label: 'RAG', tag: 'retrieval', w: 110 },
			{ id: 'ml', x: 250, y: 185, label: 'ML MODELS', tag: 'classify · predict', w: 110 },
			{ id: 'llm', x: 250, y: 290, label: 'LLM CORE', tag: 'grounded', w: 120, hot: true },
			{ id: 'agent', x: 430, y: 130, label: 'AGENT', tag: 'reason · act' },
			{ id: 'tools', x: 430, y: 230, label: 'TOOLS', tag: 'apis · db' }
		],
		edges: [
			{ from: 'prompt', to: 'rag', hot: true },
			{ from: 'data', to: 'ml' },
			{ from: 'data', to: 'rag' },
			{ from: 'rag', to: 'llm', hot: true },
			{ from: 'ml', to: 'llm' },
			{ from: 'llm', to: 'agent', hot: true },
			{ from: 'agent', to: 'tools' },
			{ from: 'tools', to: 'agent' }
		]
	}
};

export const getDiagram = (slug: string): Diagram => DIAGRAMS[slug] ?? PLACEHOLDER_DIAGRAM;
