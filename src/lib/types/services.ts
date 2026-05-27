export interface DiagramNode {
	id: string;
	x: number;
	y: number;
	label: string;
	tag?: string;
	w?: number;
	hot?: boolean;
	warm?: boolean;
}

export interface DiagramEdge {
	from: string;
	to: string;
	hot?: boolean;
}

export interface DiagramLoop {
	paths: string[];
	label?: string;
	labelX?: number;
	labelY?: number;
}

export interface Diagram {
	title: string;
	cmd?: string;
	nodes: DiagramNode[];
	edges: DiagramEdge[];
	loop?: DiagramLoop;
}

export interface ServiceStub {
	slug: string;
	n: string;
	title: string;
	sub: string;
}
