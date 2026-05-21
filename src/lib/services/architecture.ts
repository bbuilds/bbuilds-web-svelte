import type { Service } from './types';

export const architecture: Service = {
	slug: 'architecture',
	n: '01',
	title: 'Discovery & Architecture',
	sub: 'The Foundation',
	kicker: 'every great build starts with a story',
	lead: [
		{
			text: `Every great build starts with a captivating story and the structural analysis of the "Why." Discovery is where we strip away assumptions to find your brand's objective truth. We don't just engineer the code; we engineer the `
		},
		{ text: 'narrative', bold: true },
		{
			text: ', ensuring your foundation is a perfect alignment of high-level vision and production-grade reality.'
		}
	],
	ctaLabel: 'architect the story',
	diagram: {
		title: 'discovery.map',
		cmd: 'brand-audit --depth=full --output=blueprint',
		nodes: [
			{ id: 'brand', x: 80, y: 60, label: 'BRAND', tag: 'input' },
			{ id: 'audit', x: 260, y: 60, label: 'AUDIT', tag: 'phase 01' },
			{ id: 'research', x: 80, y: 170, label: 'RESEARCH', tag: 'qual + quant' },
			{ id: 'map', x: 260, y: 170, label: 'SYSTEMS MAP' },
			{ id: 'bp', x: 440, y: 110, label: 'BLUEPRINT', tag: 'output', w: 130, hot: true },
			{ id: 'ship', x: 260, y: 290, label: 'HARDENED BUILD', tag: 'v1.0', w: 140 }
		],
		edges: [
			{ from: 'brand', to: 'audit' },
			{ from: 'brand', to: 'research' },
			{ from: 'audit', to: 'map' },
			{ from: 'research', to: 'map' },
			{ from: 'audit', to: 'bp', hot: true },
			{ from: 'map', to: 'bp', hot: true },
			{ from: 'bp', to: 'ship' }
		]
	},
	pillarsHead: {
		meta: '// the pillars',
		title: 'Four ways we engineer the why.',
		lead: 'The Foundation work breaks down into four interlocking disciplines. Each one is its own deep-dive — together they form the structural blueprint your brand can scale on.'
	},
	pillars: [
		{
			icon: 'ai',
			tag: 'pillar.ai-strategy',
			heading: 'AI Strategy & Roadmap Discovery',
			copy: `Intelligence should amplify your story, not distract from it. We audit your workflows and brand touchpoints to identify where AI can create genuine leverage. We map out a technical path that ensures intelligent systems are integrated as a structural utility — automating the friction so your team can focus on the vision.`
		},
		{
			icon: 'systems',
			tag: 'pillar.systems',
			heading: 'Systems Architecture & Audits',
			copy: `Structural integrity is the skeleton that supports your brand's ambition. Whether we are untangling a legacy codebase or designing a greenfield system, we map your infrastructure with clinical honesty. We audit for bottlenecks and security gaps, building a hardened architecture that ensures your story never breaks under the weight of its own success.`
		},
		{
			icon: 'research',
			tag: 'pillar.research',
			heading: 'Mixed-Methods Research',
			copy: `To find the "Why," we look at the data and the humans behind the screen. We merge quantitative analytics with qualitative research — interviews, workshops, and field studies — to reveal the high-fidelity insights that others miss. We find the emotional and logical "why" to ensure every engineering decision is rooted in a deep understanding of your audience.`
		},
		{
			icon: 'innovation',
			tag: 'pillar.innovation',
			heading: 'Product Innovation',
			copy: `You've found your niche; we help you carve it. Our innovation process blends business acumen with technical foresight to bring new ideas to market — and breathe new life into old ones. We bridge the gap between a "vibe-coded" prototype and a resilient digital asset, engineering products with the structural durability and brand soul to win in the digital era.`
		}
	]
};
