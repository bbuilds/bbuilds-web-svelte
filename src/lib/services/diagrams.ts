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
	storytelling: {
		title: 'branding.graph',
		cmd: 'brand-build --strategy --identity --system --ship',
		nodes: [
			{ id: 'values', x: 70, y: 75, label: 'VALUES', tag: 'mission · vision' },
			{ id: 'market', x: 70, y: 185, label: 'MARKET', tag: 'audit · audience' },
			{ id: 'strategy', x: 250, y: 75, label: 'STRATEGY', tag: 'positioning', w: 120, hot: true },
			{ id: 'identity', x: 250, y: 185, label: 'IDENTITY', tag: 'type · motion · marks', w: 130 },
			{ id: 'system', x: 250, y: 290, label: 'SYSTEM', tag: 'tokens · components', w: 130 },
			{ id: 'story', x: 430, y: 130, label: 'STORY', tag: 'voice · narrative' },
			{ id: 'product', x: 430, y: 240, label: 'PRODUCT', tag: 'ux · ia · ship' }
		],
		edges: [
			{ from: 'values', to: 'strategy', hot: true },
			{ from: 'market', to: 'strategy' },
			{ from: 'market', to: 'identity' },
			{ from: 'strategy', to: 'identity', hot: true },
			{ from: 'strategy', to: 'system' },
			{ from: 'identity', to: 'story', hot: true },
			{ from: 'identity', to: 'system' },
			{ from: 'system', to: 'product' },
			{ from: 'story', to: 'product' }
		]
	},
	promotion: {
		title: 'continuity.graph',
		cmd: './bbuilds-promotion.sh --watch --geo --seo --vitals --a11y --env=production',
		nodes: [
			{ id: 'live', x: 70, y: 180, label: 'LIVE PRODUCT', tag: 'post-launch · in-market', w: 130 },
			{ id: 'geo', x: 260, y: 110, label: 'GEO', tag: 'authority / geo', w: 120 },
			{ id: 'seo', x: 260, y: 180, label: 'SEMANTIC SEO', tag: 'legibility / json-ld', w: 140 },
			{
				id: 'vitals',
				x: 260,
				y: 250,
				label: 'CORE VITALS & A11Y',
				tag: 'standards / wcag-lcp',
				w: 170
			},
			{
				id: 'llm',
				x: 440,
				y: 180,
				label: 'LLM CITED',
				tag: 'definitive source',
				w: 130,
				hot: true
			}
		],
		edges: [
			{ from: 'live', to: 'geo' },
			{ from: 'live', to: 'seo' },
			{ from: 'live', to: 'vitals' },
			{ from: 'geo', to: 'llm' },
			{ from: 'seo', to: 'llm' },
			{ from: 'vitals', to: 'llm' }
		],
		loop: {
			paths: ['M 505 196 C 620 360, -150 360, 5 180'],
			label: 'calibration_loop()',
			labelX: 240,
			labelY: 318
		}
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
