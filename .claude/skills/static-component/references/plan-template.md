# Plan template

Write the plan to `.claude/plans/<component-name>.md` using the section skeleton
below. It matches the existing plans in `.claude/plans/` — open one (e.g.
`quote-section.md`) for tone and depth before writing. Keep links as relative
markdown links with `file:line` anchors so they're clickable from the plan's
location (`.claude/plans/`), e.g. `[Quote.svelte](../../src/lib/components/home/Quote.svelte)`
and `[sections.jsx:453-531](../../llm_docs/brandenbuilds-claude-design/project/sections.jsx#L453-L531)`.

The plan is a checkpoint for a human — be specific enough that approving it means
approving the actual scope, content, and structure. After writing it, stop and ask
for approval before implementing.

```markdown
# <Component Name> — Implementation Plan

## Context

Why this component exists, where it sits on the page, what role it plays. Note any
deliberate deviation from the design (e.g. design has a carousel; we render one
static quote).

## Approach

The key decisions in prose: static (no CMS), no <whatever we're dropping>, component
owns its styles, which existing pieces we lean on.

## Source references

- Design HTML (structure + CSS): [file.html:NN-MM](../../llm_docs/brandenbuilds-claude-design/project/file.html#LNN-LMM)
- Visual render (if used): [path](../../llm_docs/brandenbuilds-claude-design/project/...)

## Files to modify / create

- **new**: [src/lib/components/<Name>.svelte](../../src/lib/components/<Name>.svelte)
- **new**: [src/lib/components/<Name>.svelte.spec.ts](../../src/lib/components/<Name>.svelte.spec.ts)
- **edit**: [<route>](../../src/routes/...) — import + render in position

## Content (decided)

The exact final copy: headings, body, attribution, link hrefs, labels. This is what
gets hard-coded, so it must be settled here.

## Token / spacing mapping

The non-obvious design-value → project-token translations (hex → token, px → rem)
and any color that has no token (flag it).

## Component structure

A short Svelte sketch of the markup with the semantic elements and key classes —
enough to show structure and the accessibility shape (headings, figure/blockquote,
aria-hidden, focus styles). Note the scoped styles the component will own.

## Reused utilities (not re-implemented)

List the existing components / SVGs / CSS utilities / helpers this builds on, with
links.

## Tests

The specific cases the spec will assert (eyebrow text, heading, copy substring,
link target/rel, structural checks).

## What's NOT in scope

Explicitly: no data fetching or load logic; no Storyblok schema changes (a blok reuses
the already-generated type); no <design features we're intentionally dropping>; no
design.css edits.

## Verification

The check / lint / test commands, plus the manual visual + responsive + a11y checks
to run.
```
