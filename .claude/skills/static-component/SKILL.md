---
name: static-component
description: >-
  Implements a presentational Svelte 5 component for this project from a Claude
  Design handoff file in llm_docs/brandenbuilds-claude-design/. Reads the design's
  HTML (structure + inline CSS) and visual render, writes a plan in .claude/plans/
  for approval, then builds the component, a vitest-browser-svelte spec, and
  integrates it — wiring a section into its route, or registering a Storyblok blok
  (e.g. a callout) in the post richtext renderer — following the project's tokens,
  rem-only sizing, strict CSP, and accessibility conventions. Use this when
  explicitly invoked to turn a design file into a real, accessible component.
---

# Build a component from a Claude Design handoff

This project's pages are built piece by piece from design prototypes in
`llm_docs/brandenbuilds-claude-design/`. Each prototype is a self-contained HTML
file with an inline `<style>` block (the real CSS values) and the markup. The job
here is to faithfully recreate one of those designs as a Svelte 5 component, matched
to this codebase's conventions, with a test and proper accessibility — and
integrated where it belongs.

"Static" here means **presentational**: the component does no data fetching and owns
no load logic. Its content is either hard-coded (a one-off section like the home
testimonial) or supplied as props — including a Storyblok blok's fields and rich-text
`content` (like the callout that renders inside a blog post). Both are in scope.

You produce a **plan first**, get it approved, then implement. The plan is the
checkpoint where scope, content, and structure get agreed before any code is written
— it mirrors the existing docs in `.claude/plans/`.

## Two integration shapes

Most tasks are one of these. Identify which early — it decides where the component
lives and how it's wired:

- **Section** — a page region (hero, CTA, quote). Content is usually hard-coded. It
  lives in `src/lib/components/` (or a route subfolder like `home/`) and is wired by
  importing and rendering it in the route's `+page.svelte` at the right position.
- **Richtext blok** — a Storyblok component that appears _inside_ a post's rich text
  (e.g. the Callout Block). It takes the blok's fields as props (a type/variant plus a
  rich-text `content` body) and is wired by adding a branch to
  `src/lib/components/posts/RichTextRenderer.svelte` that dispatches to it by
  `component` name, rendering the body back through `RichTextRenderer`. The generated
  type lives in `src/lib/types/storyblok.d.ts`. See `references/conventions.md` §8.

## Inputs to gather

Before starting, make sure you know:

- **The design file** — a path under `llm_docs/brandenbuilds-claude-design/project/`
  (e.g. `blog-post.html`). The standalone `*.html` files hold both structure and CSS
  and are the richest input; prefer one when it exists.
- **Which shape** — section wired into a route, or a richtext blok (see above). If the
  design is a Storyblok component with a generated type, it's almost certainly a blok.
- **Where it goes** — the route + position for a section, or the renderer + `component`
  name for a blok. Ask if it isn't obvious.
- **Content** — for a hard-coded section, is the design's copy final or does the user
  have replacement text? For a blok, what fields/variants does it take (check the
  generated type)?

If any of these is ambiguous, ask now. It's much cheaper to confirm scope than to
rebuild the wrong thing — the design bundle's own README says the same.

## Workflow

### 1. Read the design in full

Read the named HTML file top to bottom — both the `<style>` block and the markup.
Don't skim; the exact colors, spacing, type sizes, and animation timings are all in
there. If the file imports or mounts other files, follow those too so you understand
the whole picture.

Cross-check against the **visual render** when one is available — a matching PNG/JPG
in `project/`, `project/_review/`, `project/uploads/`, or an `og-image-*.png`. Use it
to confirm layout and catch anything the CSS leaves ambiguous. Don't spin up a browser
to generate new screenshots unless the user asks.

Extract and note:

- **Semantic structure** — what each region actually _is_ (`<section>`, `<article>`,
  `<figure>`/`<blockquote>`, `<nav>`, a heading hierarchy; for a callout-style blok,
  the `role="note"` + label + body shape). The prototype uses generic `<div>`s and
  React-style `className`; don't copy that — choose the correct semantic elements
  (this is the foundation of accessibility).
- **Content / variants** — the real copy and links for a section; the field/variant
  mapping for a blok (e.g. `callout_type` → label + icon).
- **Visual specifics** — colors (as written, incl. `oklch`/`color-mix`), spacing,
  fonts, borders, shadows, and any animations or transitions.

### 2. Map the design onto this project's conventions

The prototype's raw CSS is a _specification of intent_, not code to paste. Translate it:

- **Colors → design tokens.** Read `src/lib/styles/design.css` and map each design
  color to the nearest `@theme` token (e.g. `#b8821a` → `text-yellow`/`--color-yellow`).
  Don't introduce raw hex. When the design uses a color that has **no** token (e.g. a
  callout's per-variant `oklch` accent), don't invent a global token — keep it as a
  component-local custom property (a `--c-accent` set per variant in the scoped style),
  and call it out in the plan so the user can promote it to a token if they want.
- **px → rem, everywhere.** Divide every px value by 16 — including hairline values the
  design writes as `1px` / `3px` borders (`0.0625rem` / `0.1875rem`). This applies to
  Tailwind arbitrary values, custom properties, and inline styles. The standard
  Tailwind scale (`px-4`, `text-sm`, `h-11`) is already rem-based and fine.
- **Reuse before rebuilding.** Prefer existing pieces: `Eyebrow`, `SectionHeader`,
  `Button`; SVG subcomponents under `src/lib/components/svgs/`; shared utilities
  `.paper-bg`, `.container`, `.scribble`, `sr-only`; helpers in `src/lib/utils/`. For a
  richtext blok, reuse `RichTextRenderer` to render the body rather than re-parsing
  rich text. List the directories at build time — don't assume.
- **Component owns its styles.** Keep component-specific CSS in its scoped `<style>`
  block using tokens (or component-local vars for non-token accents); don't bloat
  `design.css`.

See `references/conventions.md` for the full token-mapping process, the reuse
inventory, the strict-CSP rule, the richtext-blok integration, and the test patterns.
Read it before implementing.

### 3. Write the plan, then stop for approval

Write a plan to `.claude/plans/<component-name>.md` following the project's existing
plan style. `references/plan-template.md` has the section skeleton; the existing plans
(e.g. `.claude/plans/quote-section.md`) are the reference for tone and depth.

The plan must pin down: the integration shape, the semantic structure, the final
content (or the field/variant mapping for a blok), the token/spacing mapping (noting
any non-token colors), which existing pieces get reused, the files to create/edit, the
exact wiring point, the test cases, and an explicit "what's NOT in scope" list (no data
fetching/load logic; no Storyblok schema changes unless asked).

**Then pause and present the plan to the user for approval before writing any component
code.** This is the whole point of plan-first — let them correct scope or content
cheaply.

### 4. Implement (after approval)

- Create the component under `src/lib/components/` (use the established subfolder for
  its siblings, e.g. `home/` or `posts/`). Svelte 5 runes only, scoped `<style>`.
  Hard-code content as a `const` for a section; take `$props()` for a blok.
- Honor accessibility throughout — see the checklist below.
- Create the spec alongside it as `<Name>.svelte.spec.ts` (browser project,
  `vitest-browser-svelte`). Test behavior and content, not styling — for a blok, render
  each variant and assert its label/role/body.
- Integrate it: import + render in the route for a section; add the dispatch branch in
  `RichTextRenderer.svelte` for a blok.
- Run the Svelte MCP `svelte-autofixer` on the new component and fix anything it
  reports, per the project's CLAUDE.md rule.

### 5. Verify

Run and report results — don't claim done until these pass:

```bash
npm run check                               # svelte-check types
npm run lint                                # prettier + eslint
npm run test:unit -- --run <spec path>      # the new spec
```

Then spot-check: no `px` introduced anywhere (including borders), decorative SVGs are
`aria-hidden`, focusable elements have visible focus styles, and any animation is
guarded by `prefers-reduced-motion`. If a verification step fails, fix it or say so
plainly with the output — don't paper over it.

## Accessibility checklist (every component)

Accessibility is a hard requirement here, not a nice-to-have. Before finishing, confirm:

- **Semantic elements** carry the meaning — `<section>` with an `id` for in-page
  anchors, real heading levels (add an `sr-only` heading if a section has none visible
  but needs a label), `<figure>`/`<blockquote>`/`<figcaption>` for quotes, `<nav>` for
  navigation, `<ul>`/`<li>` for lists, `<button>` vs `<a>` chosen by behavior, an
  appropriate `role` (e.g. `role="note"` for a callout) where no native element fits.
- **Decorative SVGs and glyphs** are `aria-hidden="true"`; meaningful images have real
  `alt` text. A variant label that conveys meaning (e.g. "Heads up") must be real text,
  not color alone.
- **Interactive elements are keyboard-reachable** and show a visible focus state (the
  project uses `focus-visible:outline-*` with the yellow token). New-tab links use
  `target="_blank" rel="noopener noreferrer"`.
- **Motion respects `prefers-reduced-motion: reduce`** — animations are disabled or
  reduced inside that media query.
- **Color is not the only signal**, and text keeps adequate contrast against its
  background token.

## Strict CSP reminder

This project ships a strict `script-src` (no `'unsafe-inline'`). Never use Svelte
attribute spreads (`{...}`) on media/embedded elements (`<img>`, `<video>`, `<audio>`,
`<source>`, `<iframe>`) — Svelte injects inline `onload`/`onerror` handlers that the CSP
blocks at runtime. Use explicit conditional attributes
(`fetchpriority={eager ? 'high' : undefined}`) instead. Details in
`references/conventions.md`.
