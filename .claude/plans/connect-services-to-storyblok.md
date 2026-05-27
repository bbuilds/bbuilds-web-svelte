# Connect Services to Storyblok

## Context

The `/services/[slug]` route currently renders from hardcoded local data ([src/lib/services/architecture.ts](src/lib/services/architecture.ts), driven by [src/lib/services/index.ts](src/lib/services/index.ts)). Storyblok now has a `Services Template` content type ([src/lib/types/storyblok.d.ts:252-262](src/lib/types/storyblok.d.ts#L252-L262)) with hero, pillars, and copy fields, and at least one story published at `services/architecture`. We need to swap the service page over to fetch from Storyblok while keeping two things in code: the `BlueprintDiagram` data (hero illustration) and the per-service pillar illustrations.

Each pillar comes back from Storyblok with a `pillar_id` string. The current `PillarIcon.svelte` has 4 fully-drawn SVGs (ai / systems / research / innovation) that belong specifically to the Architecture service. Other services will eventually have their own 4 illustrations — for now they render an empty black div.

## Approach

### 1. Data layer

**[src/lib/services/diagrams.ts](src/lib/services/diagrams.ts)** (new)

- `export const DIAGRAMS: Record<string, Diagram>` keyed by service slug.
- Move the existing `architecture` diagram (currently inline in [src/lib/services/architecture.ts:19-42](src/lib/services/architecture.ts#L19-L42)) here verbatim.
- Add a `PLACEHOLDER_DIAGRAM: Diagram` for services that don't have one yet (minimal nodes/edges so `BlueprintDiagram` still renders without errors).
- Export `getDiagram(slug: string): Diagram` that returns `DIAGRAMS[slug] ?? PLACEHOLDER_DIAGRAM`.

**[src/lib/services/index.ts](src/lib/services/index.ts)** (modify)

- Keep `SERVICES_INDEX` exactly as-is (slug / n / sub / title — pure nav metadata used by `OtherServices`).
- Replace the SERVICES record + `getService` (no longer needed) with a `LIVE_SLUGS = new Set<string>(['architecture'])`. Add slugs as Storyblok stories ship.
- Keep `isLiveService(slug)` semantics — used by [OtherServices.svelte:45,51,82,85,98,103](src/lib/components/services/OtherServices.svelte#L45) to disable nav links.

**[src/lib/services/types.ts](src/lib/services/types.ts)** (modify)

- Remove `Service`, `Pillar`, `LeadSegment` (now driven by Storyblok types).
- Keep `Diagram`, `DiagramNode`, `DiagramEdge` (used by `BlueprintDiagram`).
- Keep `ServiceStub` (used by `SERVICES_INDEX`).
- Remove `PillarIconKind` — `pillar_id` is a free-form string in Storyblok.

**[src/lib/services/architecture.ts](src/lib/services/architecture.ts)** — delete (data now in Storyblok + diagrams.ts).

### 2. Route

**[src/routes/services/[slug]/+page.ts](src/routes/services/[slug]/+page.ts)** (rewrite)

- Pattern mirrors [src/routes/+page.ts](src/routes/+page.ts): pull `storyblokAPI` + `version` from `parent()`.
- `storyblokAPI.get('cdn/stories/services/' + params.slug, { version })`.
- Type story as `ISbStoryData<StoryblokServicesTemplate>`. Throw `error(404)` if missing.

**[src/routes/services/[slug]/+page.svelte](src/routes/services/[slug]/+page.svelte)** (modify)

- Destructure `story.content` (StoryblokServicesTemplate).
- Pass `content.hero[0]` + `params.slug` to `ServiceHero`.
- Pass full `content` + `params.slug` to `Pillars`.
- `OtherServices` continues to use `currentSlug={params.slug}`.
- Update `<svelte:head>` title/description to use `story.name` and the hero copy.

### 3. Components

**[src/lib/components/services/ServiceHero.svelte](src/lib/components/services/ServiceHero.svelte)** (refactor)

- Props: `{ slug: string; hero: StoryblokHero | undefined }`.
- Map fields:
  - `hero.title` → main heading (keep existing " & " split + scribble rendering)
  - `hero.tagline` → kicker
  - `hero.copy` → lead paragraph (plain text; drops the bold-segment array)
  - `hero.CTA[0]` → button, resolved via `resolveMultilink` from [src/lib/utils/links.ts](src/lib/utils/links.ts) (same pattern as [src/lib/components/home/Hero.svelte:94](src/lib/components/home/Hero.svelte#L94))
- Breadcrumb uses `hero.title.toLowerCase()`.
- `BlueprintDiagram` receives `getDiagram(slug)` from the new diagrams module.

**[src/lib/components/services/Pillars.svelte](src/lib/components/services/Pillars.svelte)** (refactor)

- Props: `{ slug: string; content: StoryblokServicesTemplate }`.
- Header fields: `content.pillars_eyebrow` → meta (prefix with `// ` if not already), `content.pillars_title` → title, `content.pillars_copy` → lead.
- Iterate `content.pillars ?? []` (StoryblokServiceOfferCard[]):
  - `pillar.title` → heading
  - `pillar.copy` → copy paragraph
  - Tag chip: derive from `pillar.pillar_id` (e.g. `pillar.{pillar_id}`) since Storyblok schema has no separate tag field
  - Render `<PillarIcon {slug} pillarId={pillar.pillar_id} />`

**[src/lib/components/services/PillarIcon.svelte](src/lib/components/services/PillarIcon.svelte)** (rewrite as dispatcher)

- Props: `{ slug: string; pillarId: string | undefined }`.
- Switch on `slug` and render the matching illustration component, passing `pillarId` through.
- Default branch renders the black-div placeholder inline (covers unknown slugs).

**[src/lib/components/services/illustrations/](src/lib/components/services/illustrations/)** (new directory)

- `Architecture.svelte` — accepts `{ pillarId: string | undefined }`, contains the four SVGs currently in [PillarIcon.svelte:11-177](src/lib/components/services/PillarIcon.svelte#L11) (ai/systems/research/innovation), keyed by pillarId. Unknown id → black div fallback.
- `Engineering.svelte`, `Intelligence.svelte`, `Identity.svelte`, `Continuity.svelte` — each accepts the same props but renders a black `<div class="aspect-[6/5] w-full bg-ink">` placeholder regardless of pillarId.

**[src/lib/components/services/BlueprintDiagram.svelte](src/lib/components/services/BlueprintDiagram.svelte)** — no changes (still takes a `Diagram` prop).

**[src/lib/components/services/OtherServices.svelte](src/lib/components/services/OtherServices.svelte)** — no changes (still uses local `SERVICES_INDEX` + `isLiveService`).

## Files Touched

Created:

- [src/lib/services/diagrams.ts](src/lib/services/diagrams.ts)
- [src/lib/components/services/illustrations/Architecture.svelte](src/lib/components/services/illustrations/Architecture.svelte)
- [src/lib/components/services/illustrations/Engineering.svelte](src/lib/components/services/illustrations/Engineering.svelte)
- [src/lib/components/services/illustrations/Intelligence.svelte](src/lib/components/services/illustrations/Intelligence.svelte)
- [src/lib/components/services/illustrations/Identity.svelte](src/lib/components/services/illustrations/Identity.svelte)
- [src/lib/components/services/illustrations/Continuity.svelte](src/lib/components/services/illustrations/Continuity.svelte)

Modified:

- [src/lib/services/types.ts](src/lib/services/types.ts)
- [src/lib/services/index.ts](src/lib/services/index.ts)
- [src/routes/services/[slug]/+page.ts](src/routes/services/[slug]/+page.ts)
- [src/routes/services/[slug]/+page.svelte](src/routes/services/[slug]/+page.svelte)
- [src/lib/components/services/ServiceHero.svelte](src/lib/components/services/ServiceHero.svelte)
- [src/lib/components/services/Pillars.svelte](src/lib/components/services/Pillars.svelte)
- [src/lib/components/services/PillarIcon.svelte](src/lib/components/services/PillarIcon.svelte)

Deleted:

- [src/lib/services/architecture.ts](src/lib/services/architecture.ts)

## Reused Utilities

- `resolveMultilink` — [src/lib/utils/links.ts:14](src/lib/utils/links.ts#L14) for the hero CTA
- Layout-provided `storyblokAPI` + `version` — [src/routes/+layout.ts:15-16](src/routes/+layout.ts#L15-L16) via `parent()`
- Pattern from [src/routes/+page.ts](src/routes/+page.ts) for the load function shape
- `Button` — [src/lib/components/Button.svelte](src/lib/components/Button.svelte) for the CTA

## Verification

1. `npm run check` — confirm no type errors after the Storyblok wiring + type removals.
2. `npm run dev` — visit `/services/architecture`:
   - Hero renders title with " & " styling, tagline, copy, CTA wired to the Storyblok link.
   - BlueprintDiagram shows the architecture diagram (from `DIAGRAMS.architecture`).
   - Pillars section shows 4 cards from Storyblok content with the existing ai/systems/research/innovation SVGs matched by `pillar_id`.
   - OtherServices nav shows the 4 other slugs disabled.
3. Visit `/services/engineering` (or any non-live slug) — should 404 since no Storyblok story exists. If a placeholder story is published, hero/pillars render text from Storyblok and pillar illustrations show black divs.
4. Confirm `LIVE_SLUGS` only contains `architecture` so the other nav entries stay disabled.
