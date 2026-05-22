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

export interface ServiceStub {
	slug: string;
	n: string;
	title: string;
	sub: string;
}
