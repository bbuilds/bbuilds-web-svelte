# Static Footer with Rotating Words

## Context

The SvelteKit app currently has no footer — `src/routes/+layout.svelte` only renders `<Header />`, page children, and `<BottomNav />`. The design calls for a centered single-column footer (logo / built-with line / meta line) with a per-character "rotating words" animation ported from the Astro site's `Footer.astro`.

Two deltas from the design source:

- Omit the "Seattle / remote" location from the meta line.
- Replace with a link to `/sitemap.xml` + the copyright. The sitemap endpoint itself is out of scope — the footer just links to where it will live.

## Layout & Content

```
[ BrandenBuilds. logo ]
built with <slot1>, <slot2> and <slot3>
/sitemap.xml · © 2026
```

**Rotation slots:**

- Slot 1: `Svelte`, `tears`, `joy`
- Slot 2: `Cloudflare`, `coffee`, `vibes`
- Slot 3: `Claude`, `craft`, `skill`

The built-with line uses `JetBrains Mono` (`font-mono`) so character widths are predictable for the `${word.length}ch` width transition. The logo and meta line follow the design's existing tokens already used elsewhere.

## Rotating-Words Mechanics (ported from Astro source)

Constants identical to source:

- `CYCLE_MS = 3200` — time between word swaps within a slot
- `DURATION_MS = 320` — per-character slide duration
- `STAGGER_BUDGET_MS = 180` — total stagger budget per word, capped at 35ms/char
- `EASING = cubic-bezier(0.65, 0, 0.35, 1)`
- Slot start offsets: `i * 600ms` (so slots don't swap in unison)

Per slot, on each cycle:

1. Animate every existing char `translateY(-110%)` with staggered delays (out).
2. After `max(DURATION_MS * 0.45, 120)ms`, set slot `width: ${nextWord.length}ch` (delayed so the right edge doesn't clip in-flight).
3. Append new chars starting at `translateY(110%)`, animate to `translateY(0)` with the same stagger.
4. Remove old chars after `outTotal + 60ms`.

## Reduced Motion

The codebase pattern is CSS `@media (prefers-reduced-motion: reduce)` (see `PostCard.svelte:60-65`, `Quote.svelte:83-87`). The footer animation is JS-driven, so handle it in script:

- Read `window.matchMedia('(prefers-reduced-motion: reduce)').matches` at effect start and bail before scheduling any timers.
- Add a change listener so toggling preference at runtime takes effect on next mount.
- Also add a CSS rule that disables `.bw-slot` width transition as belt-and-suspenders.

## SSR / Hydration

Each slot statically renders its first word on the server (index 0 for each slot). `$effect` only runs in the browser, so timers never start on SSR. Initial paint matches the post-hydration state — no flash.

## Cleanup

Both the `setTimeout` IDs from the slot offsets and the `setInterval` IDs they create must be tracked and cleared in the `$effect` teardown, plus removing the media-query listener.

## Critical Files

| Action                      | File                                                                                                                    |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Create**                  | `src/lib/components/Footer.svelte` — the component                                                                      |
| **Edit**                    | `src/routes/+layout.svelte` — import Footer and render it after `{@render children()}` and before `<BottomNav />`       |
| **Reference**               | `src/lib/components/Header.svelte` — reuse the logo SVG + `BrandenBuilds.` markup verbatim (with teal `.` accent)       |
| **Reference**               | `src/lib/styles/design.css` — tokens: `paper`, `paper-line`, `charcoal`, `muted`, `ink`, `teal`, `font-mono`            |
| **Reference (do not edit)** | Astro source for the animation: `https://github.com/bbuilds/byoungz-resume-astro/blob/main/src/components/Footer.astro` |

## Style Notes

- Use `rem` for all sizes (per CLAUDE.md). Convert the Astro source's `1.6em` line-height/height to `em` (relative units are fine; the rule is no `px`).
- Mobile bottom-padding must clear the fixed BottomNav (~4.5rem) plus `env(safe-area-inset-bottom)`, matching the Astro source's `padding-bottom: calc(1.5rem + 4.5rem + env(safe-area-inset-bottom))`.
- Top border via `border-paper-line` to separate the footer from page content.
- Run `svelte-autofixer` on the new component until no issues remain before considering it done.

## Steps

- [ ] Read `src/lib/components/Header.svelte` to capture logo markup and tokens.
- [ ] Read `src/lib/styles/design.css` to catalog relevant CSS custom properties.
- [ ] Fetch Astro `Footer.astro` source for the animation implementation reference.
- [ ] Create `src/lib/components/Footer.svelte`:
  - Static structure: logo, built-with line with 3 slots (SSR-renders first word), meta line.
  - `$effect` wiring: read reduced-motion preference, start per-slot intervals with staggered offsets, wire cleanup.
  - Per-character animation: out-phase with stagger → width transition → in-phase with stagger → DOM cleanup.
  - CSS: `font-mono` for built-with line, `rem`/`em` units only, mobile padding clears BottomNav, top border.
- [ ] Run `svelte-autofixer` on the component; fix all reported issues; repeat until clean.
- [ ] Edit `src/routes/+layout.svelte` to import and render `<Footer />` between `{@render children()}` and `<BottomNav />`.
- [ ] Run `npm run check` — type-check must pass.
- [ ] Run `npm run lint` — must pass.

## Verification Checklist

- [ ] `npm run check` passes.
- [ ] `npm run lint` passes.
- [ ] Footer appears below page content, above BottomNav.
- [ ] First word of each slot is visible on initial paint (SSR).
- [ ] After ~3.2s, slot 1's word swaps with per-character slide; slots 2 and 3 follow staggered.
- [ ] Slot width transitions smoothly when word length changes (e.g., `Svelte` → `tears` → `joy`).
- [ ] `/sitemap.xml` link is present and points to `/sitemap.xml`. Year is current (2026).
- [ ] DevTools → Rendering → emulate `prefers-reduced-motion: reduce`, hard reload: no rotation occurs, first word of each slot remains static, no console errors.
- [ ] Resize to mobile width (< 48rem): footer content stays centered and is not occluded by BottomNav.
