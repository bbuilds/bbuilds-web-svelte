# Hero Refactor — Falling Leaves + Smaller Sun

## Context

The current hero ([src/lib/components/Hero.svelte](src/lib/components/Hero.svelte)) uses static snake-plant SVGs anchored at the bottom-right of the section, plus a large 9.25rem sun sticker. A new design lives at [llm_docs/brandenbuilds-claude-design/project/index.html](llm_docs/brandenbuilds-claude-design/project/index.html) that replaces the static plants with a system of leaves that fall from the top of the hero, sway, and tumble as they drop. We want to adopt that animation system, drop the snake plants entirely, and shrink the sun to match the new design.

Per user direction: **leaves should NOT pile up at the bottom** — they fall through the hero and disappear off-screen. The pre-seeded pile and `landLeaf`/`piled-leaf` logic from the reference are intentionally omitted.

## Changes

All changes are scoped to [src/lib/components/Hero.svelte](src/lib/components/Hero.svelte). No new files.

### 1. Remove snake plants

- Delete the `SNAKE_ROWS` constant ([Hero.svelte:33-62](src/lib/components/Hero.svelte#L33-L62)).
- Delete the always-visible snake plant block ([Hero.svelte:77-97](src/lib/components/Hero.svelte#L77-L97)).
- Delete the `{#each}` of repeating snake plants ([Hero.svelte:108-130](src/lib/components/Hero.svelte#L108-L130)).
- Delete the related CSS: `.plant-snake-*`, `.plant-sway-*`, `@keyframes growIn`, `@keyframes fadeIn`, `@keyframes sway` ([Hero.svelte:234-313](src/lib/components/Hero.svelte#L234-L313)).

### 2. Shrink the sun

- Change `.sticker` width/height from `9.25rem` to `5.5rem` (mobile).
- Add a `@media (min-width: 48rem)` rule bumping `.sticker` to `6.5rem`.
- Keep the existing radial gradient, `@property --sun-x/--sun-y`, `gradientDrift`, and `glowPulse` animations as-is — they already match the new design.
- Optionally adjust the wrapper top offset on desktop to `4.5rem` and `right: 7%` to match the reference (minor; keep current values if they look fine).

### 3. Add the falling-leaf system

**Script additions** (within existing `<script lang="ts">`):

- Add a `Leaf` data type: `{ id, x, size, fill, initialRot, fallDur, swayDur, swayAmp, tumbleDur, tumbleDir }`.
- Add a `LEAF_COLORS` const: `['#7ba87b','#6f9c6e','#8fb88c','#9bc198','#5e8a5a','#c9b674','#a89a4e']`.
- Add a `makeFallingLeaf(id)` helper matching [sections.jsx:172-185](llm_docs/brandenbuilds-claude-design/project/sections.jsx#L172-L185) (x: 2–98%, size: 26–66px, fallDur: 7–13s, swayDur: 2.4–4.6s, swayAmp: 18–56px, tumbleDur: 5–13s).
- State: `let leaves = $state<Leaf[]>([])`, `let heroEl: HTMLElement`, `let fallDistance = $state(700)`.
- In `onMount`:
  - Set up `ResizeObserver` on `heroEl` that updates `fallDistance = heroEl.offsetHeight + 80`.
  - `setInterval` every 1400ms: push a new leaf via `makeFallingLeaf`, and after `leaf.fallDur * 1000` ms remove it from the array (track timeout IDs in a `Set` for cleanup).
  - Return a cleanup that clears the interval, all tracked timeouts, and disconnects the observer.
- Existing word-rotation `setInterval` stays.

**Markup additions** (inside `<section>`, before the sun sticker):

```svelte
<div class="hero-leaves-layer" style="--hero-fall-distance: {fallDistance}px" aria-hidden="true">
	{#each leaves as l (l.id)}
		<div class="falling-leaf" style="left: {l.x}%; --fall-dur: {l.fallDur}s">
			<div class="leaf-sway" style="--sway-dur: {l.swayDur}s; --sway-amp: {l.swayAmp}rem">
				<div
					class="leaf-tumble"
					style="--tumble-dur: {l.tumbleDur}s; animation-direction: {l.tumbleDir}"
				>
					<svg viewBox="0 0 100 140" width={l.size} style="transform: rotate({l.initialRot}deg)">
						<path
							d="M50 6 C 78 22, 90 70, 60 128 C 52 132, 44 132, 38 128 C 12 90, 18 36, 50 6 Z"
							fill={l.fill}
							stroke="#1a1a1a"
							stroke-width="1.4"
							stroke-linejoin="round"
						/>
						<path
							d="M50 14 C 50 60, 50 100, 50 128"
							stroke="#1a1a1a"
							stroke-width="0.9"
							fill="none"
							opacity="0.55"
						/>
						<path
							d="M50 38 Q66 50, 72 70"
							stroke="#1a1a1a"
							stroke-width="0.6"
							fill="none"
							opacity="0.4"
						/>
						<path
							d="M50 38 Q34 50, 28 70"
							stroke="#1a1a1a"
							stroke-width="0.6"
							fill="none"
							opacity="0.4"
						/>
						<path
							d="M50 70 Q68 82, 70 100"
							stroke="#1a1a1a"
							stroke-width="0.6"
							fill="none"
							opacity="0.4"
						/>
						<path
							d="M50 70 Q32 82, 30 100"
							stroke="#1a1a1a"
							stroke-width="0.6"
							fill="none"
							opacity="0.4"
						/>
					</svg>
				</div>
			</div>
		</div>
	{/each}
</div>
```

- The `<section>` gains `bind:this={heroEl}`.
- The `.container` inside the section gets `position: relative; z-index: 2` so text stays above the leaf layer.

**CSS additions** (inside `<style>`):

```css
.hero-leaves-layer {
	position: absolute;
	inset: 0;
	pointer-events: none;
	overflow: hidden;
	opacity: 0.55;
	z-index: 0;
}
.falling-leaf {
	position: absolute;
	top: -4rem;
	will-change: transform;
	animation: leafFall var(--fall-dur, 9s) linear forwards;
}
@keyframes leafFall {
	0% {
		transform: translateY(0);
	}
	100% {
		transform: translateY(var(--hero-fall-distance, 110vh));
	}
}
.leaf-sway {
	will-change: transform;
	animation: leafSway var(--sway-dur, 3s) ease-in-out infinite;
}
@keyframes leafSway {
	0%,
	100% {
		transform: translateX(calc(var(--sway-amp, 1.875rem) * -1));
	}
	50% {
		transform: translateX(var(--sway-amp, 1.875rem));
	}
}
.leaf-tumble {
	will-change: transform;
	animation: leafTumble var(--tumble-dur, 7s) linear infinite;
}
@keyframes leafTumble {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}
```

### 4. Rem compliance

Per [CLAUDE.md](CLAUDE.md), all custom sizes use rem. The leaf size (`width={l.size}`) is the only raw px value — it's an SVG attribute (intrinsic pixel dimension), not a CSS size, so it's acceptable. Sway amplitude is converted from the reference's px range (18–56px) to rem (`1.125–3.5rem`) by dividing by 16 when generating leaves. The `--hero-fall-distance` stays in px because it's derived from `offsetHeight`, which is intrinsically pixel-based.

## Critical Files

- [src/lib/components/Hero.svelte](src/lib/components/Hero.svelte) — only file modified.
- [llm_docs/brandenbuilds-claude-design/project/index.html](llm_docs/brandenbuilds-claude-design/project/index.html) — reference for CSS keyframes (lines 153-230).
- [llm_docs/brandenbuilds-claude-design/project/sections.jsx](llm_docs/brandenbuilds-claude-design/project/sections.jsx) — reference for spawn logic (lines 170-260) and leaf SVG markup (plants.jsx lines 3-21).

## Verification

1. `npm run check` — type check passes.
2. `npm run lint` — formatting clean.
3. `npm run dev` — load the home page in the browser:
   - Snake plants gone; sun visibly smaller; leaves spawn from the top and fall through the hero.
   - Leaves disappear when they exit the bottom (no pile accumulating).
   - Resize the window: fall distance should re-measure (no leaves stopping mid-air after resize).
   - Hero text and CTA remain interactive (leaves layer is `pointer-events: none`).
4. Use the Svelte MCP `svelte-autofixer` on the final component before sign-off.
