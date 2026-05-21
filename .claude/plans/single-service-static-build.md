# Static Service Template — `/services/[slug]`

## Context

The brand site has a "services" section on the home page driven by Storyblok, but no dedicated per-service page exists yet. The design doc at [llm_docs/brandenbuilds-claude-design/project/architecture.html](llm_docs/brandenbuilds-claude-design/project/architecture.html) (with React reference impl in [service-sections.jsx](llm_docs/brandenbuilds-claude-design/project/service-sections.jsx)) specifies a five-service template — Discovery & Architecture, Product Engineering, Applied Intelligence, Identity & Experience, Continuity & Growth — with a tech-heavy hero, alternating pillar deep-dives, an "other services" navigator, and a CTA.

Goal: build a SvelteKit route at `/services/[slug]` powered by **local TypeScript data** (not Storyblok), fully populate the first service (`architecture`), and leave the other four slugs returning 404 until their content is authored. The home page's existing Storyblok-driven `Services.svelte` stays untouched for now.

## Approach

Local TS service registry → typed `+page.ts` loader → page composed from new section components → reuse existing `Button`, `ScribbleUnderline`, `Contact` for the bottom CTA.

## Files to create

### Data layer

- **`src/lib/services/types.ts`** — Types for the static template:

  ```ts
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

  export interface Service {
  	slug: string; // 'architecture'
  	n: string; // '01'
  	title: string; // 'Discovery & Architecture' — '&' splits into two lines
  	sub: string; // 'The Foundation'
  	kicker: string; // hand-font tagline
  	lead: string; // hero lead (may contain <strong>...</strong>)
  	ctaLabel: string;
  	diagram: Diagram;
  	pillarsHead: { meta: string; title: string; lead: string };
  	pillars: Pillar[];
  }
  ```

- **`src/lib/services/architecture.ts`** — Fully populated service object, copied verbatim from [architecture.html:540-592](llm_docs/brandenbuilds-claude-design/project/architecture.html#L540-L592) (TITLE, KICKER, HERO_LEAD, PILLARS, DIAGRAM) plus pillars-section header text from [architecture.html:608-612](llm_docs/brandenbuilds-claude-design/project/architecture.html#L608-L612).

- **`src/lib/services/index.ts`** — Registry:
  ```ts
  import { architecture } from './architecture';
  export const SERVICES_INDEX = [
  	{
  		slug: 'architecture',
  		n: '01',
  		title: 'Discovery & Architecture',
  		sub: 'The Foundation'
  	},
  	{
  		slug: 'engineering',
  		n: '02',
  		title: 'Product Engineering',
  		sub: 'The Build'
  	},
  	{
  		slug: 'intelligence',
  		n: '03',
  		title: 'Applied Intelligence',
  		sub: 'The Edge'
  	},
  	{
  		slug: 'identity',
  		n: '04',
  		title: 'Identity & Experience',
  		sub: 'The Interface'
  	},
  	{
  		slug: 'continuity',
  		n: '05',
  		title: 'Continuity & Growth',
  		sub: 'The Lifecycle'
  	}
  ] as const;
  const SERVICES: Record<string, Service> = { architecture };
  export const getService = (slug: string) => SERVICES[slug];
  ```

### Route

- **`src/routes/services/[slug]/+page.ts`** — Mirrors [src/routes/[slug]/+page.ts](src/routes/[slug]/+page.ts) pattern:

  ```ts
  import { error } from '@sveltejs/kit';
  import { getService } from '$lib/services';
  import type { PageLoad } from './$types';
  export const load: PageLoad = ({ params }) => {
  	const service = getService(params.slug);
  	if (!service) error(404, 'Service not found');
  	return { service };
  };
  ```

- **`src/routes/services/[slug]/+page.svelte`** — Composes the page:
  ```
  <svelte:head> title + meta description from service.lead
  <ServiceHero {service} />
  <Pillars head={service.pillarsHead} items={service.pillars} />
  <OtherServices currentSlug={service.slug} />
  <Contact />   (existing component)
  ```

### Section components (under `src/lib/components/services/`)

- **`ServiceHero.svelte`** — Renders [architecture.html:184-237](llm_docs/brandenbuilds-claude-design/project/architecture.html#L184-L237):
  - Breadcrumb (`/ home › / services › / {title}`).
  - `<h1>` split on `&` → line 1 word + yellow Caveat ampersand, line 2 wrapped in `ScribbleUnderline` (thick variant).
  - Kicker (`.svc-hero-kicker`, hand font, yellow `↳` prefix).
  - Lead — `{@html service.lead}` so the `<strong>` highlight works (lead is trusted local content).
  - CTA via existing `Button` with `href="#contact"`.
  - Right column: `<BlueprintDiagram {diagram} />`.
  - Subtle grid-bg overlay via `.svc-hero-gridbg`.

- **`BlueprintDiagram.svelte`** — Direct port of [service-sections.jsx:12-115](llm_docs/brandenbuilds-claude-design/project/service-sections.jsx#L12-L115): chrome bar, SVG with grid pattern, edges (`{#each diagram.edges}`), nodes (`{#each diagram.nodes}`), pulse on hot node, terminal footer.

- **`PillarIcon.svelte`** — `{#if kind === 'ai'} ... {/if}` switch over the 9 kinds. **For this pass, only `ai`, `systems`, `research`, `innovation` need bodies** (the four architecture pillars at [service-sections.jsx:185-423](llm_docs/brandenbuilds-claude-design/project/service-sections.jsx#L185-L423)). Others can be empty branches added later.

- **`Pillars.svelte`** — Section wrapper from [architecture.html:347-419](llm_docs/brandenbuilds-claude-design/project/architecture.html#L347-L419) + per-item `<article class="pillar pillar--flip?">` from [service-sections.jsx:710-724](llm_docs/brandenbuilds-claude-design/project/service-sections.jsx#L710-L724) (odd index → flip).

- **`OtherServices.svelte`** — Uses `SERVICES_INDEX` minus current; computes prev/next with modular arithmetic from [service-sections.jsx:733-735](llm_docs/brandenbuilds-claude-design/project/service-sections.jsx#L733-L735). Links use `href={`/services/${s.slug}`}`. Each link sets `aria-disabled` and adds a `.is-stub` class when the slug isn't yet in the `SERVICES` map, so the user sees the layout but cannot click into a missing page.

### Styles

- Per-page CSS lives in component `<style>` blocks. Tokens (`--ink`, `--paper`, `--yellow`, `--hand`, etc.) already exist via [src/lib/styles/design.css](src/lib/styles/design.css) — no changes needed.
- **Sizing rule**: every measurement must be `rem`, not `px` ([CLAUDE.md](CLAUDE.md)). The design HTML already uses rem throughout, but the React file uses px in SVG `viewBox`/`width` attributes — those are SVG user units and stay as raw numbers; only CSS units must be rem.

## Reused existing code

- [src/lib/components/Button.svelte](src/lib/components/Button.svelte) — hero CTA.
- [src/lib/components/ScribbleUnderline.svelte](src/lib/components/ScribbleUnderline.svelte) — for the line-2 word in `<h1>` (`thick` variant matches the yellow scribble in [service-sections.jsx:149-151](llm_docs/brandenbuilds-claude-design/project/service-sections.jsx#L149-L151)).
- [src/lib/components/Contact.svelte](src/lib/components/Contact.svelte) — bottom CTA section, anchored via `id="contact"` for the hero CTA link.
- [src/routes/+layout.svelte](src/routes/+layout.svelte) — already provides `Header`, `Footer`, `BottomNav`, paper background. No layout work needed.

## Verification

1. `npm run dev`, visit `http://localhost:5173/services/architecture` — confirm:
   - Hero: breadcrumb, two-line title with yellow `&` and scribble under "Architecture", kicker, lead with yellow-highlighted bold "narrative", CTA button.
   - Blueprint diagram renders 6 nodes / 7 edges, "BLUEPRINT" node pulses, hot edges animate.
   - 4 pillars alternate; each shows tag pill, custom SVG icon, h3, copy.
   - "Other Services" lists 4 sibling services with 02–05 numbering; prev/next reads `05 · Continuity & Growth` / `02 · Product Engineering` (architecture is index 1 → prev wraps to 5).
   - Stub services (engineering/intelligence/identity/continuity) are visibly muted/disabled in the list.
   - Contact section renders at the bottom; hero CTA jumps to it.
2. Visit `/services/engineering` → 404 page.
3. `npm run check` — passes (no type errors from new files).
4. `npm run lint` — passes.
5. Run the Svelte MCP `svelte-autofixer` on each new `.svelte` file until clean ([CLAUDE.md](CLAUDE.md) mandate).
6. Browser sanity on a mobile viewport (≤ 48rem) — hero grid stacks, pillars stack, breadcrumbs wrap.
