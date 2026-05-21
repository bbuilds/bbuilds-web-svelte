import type { Service, ServiceStub } from './types';
import { architecture } from './architecture';

export type { Service, ServiceStub };

export const SERVICES_INDEX: ServiceStub[] = [
	{ slug: 'architecture', n: '01', title: 'Discovery & Architecture', sub: 'The Foundation' },
	{ slug: 'engineering', n: '02', title: 'Product Engineering', sub: 'The Build' },
	{ slug: 'intelligence', n: '03', title: 'Applied Intelligence', sub: 'The Edge' },
	{ slug: 'identity', n: '04', title: 'Identity & Experience', sub: 'The Interface' },
	{ slug: 'continuity', n: '05', title: 'Continuity & Growth', sub: 'The Lifecycle' }
];

const SERVICES: Record<string, Service> = { architecture };

export const getService = (slug: string): Service | undefined => SERVICES[slug];

export const isLiveService = (slug: string): boolean => slug in SERVICES;
