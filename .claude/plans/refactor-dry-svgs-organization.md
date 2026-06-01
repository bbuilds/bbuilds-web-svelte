# Refactor: DRY cleanup, SVG extraction & folder organization

## Context

The codebase is in good shape ahead of launch (`feature/prep-for-launch`), but a few rough edges have accumulated:

- **Duplicated SVGs** — the brand logo, the close (X) icon, and the sprout illustration are each copy-pasted byte-for-byte across two components, and the "pulsing status dot" markup is duplicated with only a color change. There is no home for shared SVGs, so icons live inline in ~24 files.
- **Loose top-level `components/` folder** — 13 components sit at the root of `src/lib/components/` mixed in with feature subfolders (`home/`, `posts/`, `services/`, …), making it hard to tell layout chrome from reusable primitives from feature sections.
- **Leftover SvelteKit template files** — `src/lib/vitest-examples/` and the `demo/` routes are starter cruft that nothing references.

Goal: eliminate the duplication, give SVGs a single home under `src/lib/components/svgs`, and regroup the loose root components — without churning the already-well-organized feature folders. This is pure refactor: **no behavior or visual changes** (a couple of decorative SVG swaps are visually verified).

Scope decided with the user:

- **Folder reorg:** Moderate — group root components into `layout/`, `ui/`, `contact/`; leave feature folders as-is.
- **SVG layout:** `svgs/icons/` + `svgs/illustrations/`; leave the large per-service diagrams in `services/illustrations/`.
- **DRY set:** High-confidence only — `Logo`, `Sprout`, `CloseIcon`, `StatusIndicator`, plus reusing the existing `ScribbleUnderline`.
- **Cleanup:** Remove `vitest-examples/` and `demo/` routes (verified unreferenced).

## Conventions to follow (already in the repo)

- **Extracted-SVG component pattern:** [ScribbleUnderline.svelte](src/lib/components/ScribbleUnderline.svelte) — `interface Props` with `variant`/`color`, `$props()`, sensible defaults. New SVG components mirror this.
- **Dispatcher pattern:** [PillarIcon.svelte](src/lib/components/services/PillarIcon.svelte) (not needed here, but the reference for slug→component routing).
- **Color tokens:** Use the design tokens in [design.css](src/lib/styles/design.css) — `var(--ink)` (#1a1a1a), `var(--green)` (#7ba87b), `var(--pale-fire)`, etc. — instead of hardcoded hex.
- **Imports are absolute** (`$lib/components/...`), so moving a file = updating its import string everywhere; no fragile relative paths.
- **Memory rules:** `rem` for all sizes, never `px` (Tailwind scale classes like `h-2`, `w-6` are already rem). Prefer `const x: T = …` / typed `interface Props` over `as` casts.
- **Per CLAUDE.md:** run the **Svelte MCP `svelte-autofixer`** on every new/edited `.svelte` file until clean; colocate `*.svelte.spec.ts` tests beside components.

---

## Phase A — Remove template cruft (isolated, do first)

- Delete `src/lib/vitest-examples/` (`greet.ts`, `Welcome.svelte`) — confirmed: zero imports.
- Delete `src/routes/demo/` and `src/routes/demo/playwright/` — confirmed: only self-referential, no app links, and there are currently **no e2e tests** depending on it.

No import updates needed.

---

## Phase B — Create `svgs/` and extract + dedupe SVGs

New structure:

```
src/lib/components/svgs/
  icons/          # small, currentColor-driven, reusable
  illustrations/  # larger decorative graphics
```

### B1. Dedupe wins (extract once, replace both sites)

| New component                      | Replaces (identical inline SVG)                                                                                                                            | Notes                                                                                                                                                                                                                                                    |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `svgs/icons/Logo.svelte`           | [Header.svelte:20](src/lib/components/Header.svelte#L20), [Footer.svelte:126](src/lib/components/Footer.svelte#L126)                                       | Accept a `class` prop (default `fill-current`). Header passes `h-5.5 w-auto fill-current`, Footer `h-5 w-auto fill-current`. Leave each `<a>` + wordmark (`{SITE_NAME}.`) in place — only the `<svg>` moves.                                             |
| `svgs/icons/CloseIcon.svelte`      | [ContactModal.svelte:184](src/lib/components/ContactModal.svelte#L184), [SuccessBanner.svelte:104](src/lib/components/SuccessBanner.svelte#L104)           | Bake in viewBox/stroke/`currentColor`; accept `class` (default `h-4 w-4`). The two `<button>` wrappers differ (light vs dark) and **stay as-is** — only the icon is shared.                                                                              |
| `svgs/illustrations/Sprout.svelte` | [Contact.svelte:24](src/lib/components/Contact.svelte#L24) (`{#snippet sprout()}`), [SuccessBanner.svelte:43](src/lib/components/SuccessBanner.svelte#L43) | Accept `class` for sizing (Contact uses `width:6.875rem`, SuccessBanner `w-6`). Swap hardcoded `#1a1a1a`/`#7ba87b` → `var(--ink)`/`var(--green)` (identical values, no visual change). Contact replaces its local snippet with `<Sprout class="..." />`. |

### B2. Move the existing SVG components into `svgs/illustrations/`

- Move [ScribbleUnderline.svelte](src/lib/components/ScribbleUnderline.svelte) (+ its `.svelte.spec.ts`) → `svgs/illustrations/`. Update 3 importers: `SectionHeader.svelte`, `services/ServiceHero.svelte`, `home/Quote.svelte`.
- Move `components/error/FallingLeaves.svelte` → `svgs/illustrations/`. Update its importer (`routes/+error.svelte`).

### B3. Extract remaining single-use icons into `svgs/icons/` (organization, not dedup)

These appear once each but belong in the icon library for consistency:

- `SearchIcon.svelte` ← [routes/blog/+page.svelte:55](src/routes/blog/+page.svelte#L55)
- `LinkIcon.svelte` ← [PostCard.svelte:57](src/lib/components/PostCard.svelte#L57) (chain/link)
- `QuoteMark.svelte` ← [home/Quote.svelte:21](src/lib/components/home/Quote.svelte#L21)
- Share icons ← [posts/ShareButtons.svelte](src/lib/components/posts/ShareButtons.svelte): `TwitterIcon.svelte`, `LinkedInIcon.svelte`, `CopyIcon.svelte`
- BottomNav icons (lowest priority, single-use) ← [BottomNav.svelte](src/lib/components/BottomNav.svelte): `ToolsIcon`, `ProcessIcon`, `BlogIcon`, `MailIcon`

Each: bake in viewBox + stroke/fill (`currentColor` where the original inherited color), accept a `class` prop, `aria-hidden="true"`.

### B4. Reuse `ScribbleUnderline` for inline scribbles (careful — verify visually)

- **High confidence:** [services/OtherServices.svelte](src/lib/components/services/OtherServices.svelte) inline scribble uses the same `viewBox="0 0 200 22"` as the component's `thick` variant → replace with `<ScribbleUnderline variant="thick" />`.
- **Verify before swapping:** [home/Hero.svelte:92](src/lib/components/home/Hero.svelte#L92) (`viewBox 0 0 400 22`) and [routes/+error.svelte:61](src/routes/+error.svelte#L61) (`viewBox 0 0 360 18`) use different viewBoxes/path data. With `preserveAspectRatio="none"` + the `.scribble` CSS sizing they _should_ render equivalently, but the squiggle shape differs slightly. Swap only if the rendered result matches; otherwise leave inline. Do not block the refactor on these two.

---

## Phase C — Extract the duplicated status dot (DRY, non-SVG)

Create `svgs/`-sibling UI primitive `ui/StatusIndicator.svelte` (the pulsing dot):

- Replaces [Header.svelte:50](src/lib/components/Header.svelte#L50) (green) and [ContactModal.svelte:161](src/lib/components/ContactModal.svelte#L161) (pale-fire).
- **Pitfall:** Tailwind cannot see dynamically-built classes like `bg-{color}`. Drive the color with an inline CSS variable instead: prop `color: string = 'var(--green)'`, applied via `style="background-color: {color}"` to both the `animate-ping` span and the solid dot. Bake in `h-2 w-2`. Callers: Header `<StatusIndicator />`; ContactModal `<StatusIndicator color="var(--pale-fire)" />`.

---

## Phase D — Regroup the loose root components

Move the 13 root-level `.svelte` files (each **with its colocated `.svelte.spec.ts`**) into:

```
components/
  layout/    Header, Footer, BottomNav, SEO
  ui/        Button, FormField, SectionHeader, SuccessBanner, Particles, StatusIndicator
  contact/   Contact, ContactModal
  posts/     + PostCard   (moved in; it's a post-preview card used by blog + home)
  svgs/      (from Phase B)
```

After this the `components/` root holds only folders. Update every absolute import string accordingly, e.g.:

- `$lib/components/Button.svelte` → `$lib/components/ui/Button.svelte` (**8 sites** — the largest set)
- `$lib/components/SectionHeader.svelte` → `$lib/components/ui/SectionHeader.svelte` (3 sites)
- `$lib/components/Header.svelte` / `Footer` / `BottomNav` / `SEO` → `.../layout/...` (1 site each, all in `routes/+layout.svelte`)
- `$lib/components/Contact.svelte` → `.../contact/Contact.svelte` (2 sites: `+layout.svelte`, `services/[slug]/+page.svelte`)
- `$lib/components/PostCard.svelte` → `.../posts/PostCard.svelte` (2 sites)

Also update import paths _inside_ moved files (e.g. `ContactModal` imports `Button`/`FormField`; `SectionHeader` imports `Button`/`ScribbleUnderline`) and inside any moved `*.svelte.spec.ts`.

> Deliberately **not** using barrel/`index.ts` files — absolute `$lib` imports are already clean, and barrels add maintenance and can hurt Svelte tree-shaking.

---

## Suggested order of operations

1. **Phase A** (delete cruft) — isolated, verify `npm run check` still green.
2. **Phase B** (svgs/ + dedupe + moves) — create components, replace inline usages, run autofixer on each new `.svelte`, `npm run check` after the batch.
3. **Phase C** (StatusIndicator).
4. **Phase D** (folder reorg + import rewrites) last, since it touches the most import strings.
5. Full verification pass (below).

Do the moves with `git mv` where possible to preserve history.

---

## Files created (summary)

- `svgs/icons/`: `Logo`, `CloseIcon`, `SearchIcon`, `LinkIcon`, `QuoteMark`, `TwitterIcon`, `LinkedInIcon`, `CopyIcon` (+ optional `ToolsIcon`, `ProcessIcon`, `BlogIcon`, `MailIcon`)
- `svgs/illustrations/`: `Sprout` (new), `ScribbleUnderline` (moved), `FallingLeaves` (moved)
- `ui/StatusIndicator.svelte` (new)

## Verification

1. `npm run check` — svelte-check / type-check passes (catches any missed import path after moves).
2. `npm run lint` — prettier + eslint clean.
3. `npm run test:unit -- --run` — unit + component specs pass (several moved components have specs: `Contact`, `ContactModal`, `FormField`, `SectionHeader`, `SEO`, `SuccessBanner`, `ScribbleUnderline`).
4. `npm run build` — production build succeeds.
5. **Visual smoke test** (`npm run dev`) on the deduped/swapped SVGs:
   - Logo renders in header **and** footer at correct sizes.
   - Close (X) buttons in the contact modal and success banner look unchanged.
   - Sprouts animate in the contact section; sprout badge shows in the success banner.
   - Status dot pulses green in the header, pale-fire in the contact modal.
   - Scribble underlines on Hero / OtherServices / error page look unchanged (Phase B4).
6. `git diff --stat` sanity check that only intended files moved/changed.

## Deferred / intentionally out of scope

- `Badge`/`Pill` consolidation and a `CloseButton` wrapper (the "also consolidate pills/buttons" option — more variant design, more files).
- Renaming `src/lib/services/` (data module, `SERVICES_INDEX`) to disambiguate from `components/services/`.
- Moving the large per-service illustrations / `BlueprintDiagram` / `BlogHeroArt` under `svgs/` (they're feature-coupled; staying put).
- `state/` → `stores/` rename (current `state/` + `.svelte.ts` runes naming is fine).
