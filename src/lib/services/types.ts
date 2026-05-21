export type PillarIconKind =
	| 'ai'
	| 'systems'
	| 'research'
	| 'innovation'
	| 'frontend'
	| 'mobile'
	| 'backend'
	| 'cms'
	| 'ecommerce';

export interface Pillar {
	icon: PillarIconKind;
	tag: string;
	heading: string;
	copy: string;
}

export interface DiagramNode {
	id: string;
	x: number;
	y: number;
	label: string;
	tag?: string;
	w?: number;
	hot?: boolean;
}

export interface DiagramEdge {
	from: string;
	to: string;
	hot?: boolean;
}

export interface Diagram {
	title: string;
	cmd?: string;
	nodes: DiagramNode[];
	edges: DiagramEdge[];
}

export interface LeadSegment {
	text: string;
	bold?: boolean;
}

export interface Service {
	slug: string;
	n: string;
	title: string;
	sub: string;
	kicker: string;
	lead: LeadSegment[];
	ctaLabel: string;
	diagram: Diagram;
	pillarsHead: { meta: string; title: string; lead: string };
	pillars: Pillar[];
}

export interface ServiceStub {
	slug: string;
	n: string;
	title: string;
	sub: string;
}
