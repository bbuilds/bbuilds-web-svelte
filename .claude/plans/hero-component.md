# Plan: Hero Component

## Context

The design was built in Claude's artifact canvas (React/JSX in `llm_docs/brandenbuilds-claude-design/project/`). The goal is to port the Hero section to a standalone Svelte 5 component while reusing the design tokens already in `src/lib/styles/design.css`. The `+page.svelte` is currently a stub and the hero is the first real section to build.

---

## Files to Create / Modify

| File                             | Action                                    |
| -------------------------------- | ----------------------------------------- |
| `src/lib/components/Hero.svelte` | **Create** — main hero component          |
| `src/routes/+page.svelte`        | **Edit** — replace stub with `<Hero />`   |
| `src/routes/+layout.svelte`      | **Edit** — add Google Fonts `<link>` tags |

---

## Implementation Details

### 1. Google Fonts (layout)

`src/lib/styles/design.css` declares three font families that are not currently loaded anywhere:

| Variable                 | Font               | Weights needed               |
| ------------------------ | ------------------ | ---------------------------- |
| `--font-sans` / `--sans` | **Geist**          | 300, 400, 500, 600, 700, 800 |
| `--font-mono` / `--mono` | **JetBrains Mono** | 400, 500, 700 (+ italic 400) |
| `--font-hand` / `--hand` | **Caveat**         | 500, 700                     |

Add to `+layout.svelte`'s `<svelte:head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
<link
	href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800&family=JetBrains+Mono:ital,wght@0,400;0,500;0,700;1,400&family=Caveat:wght@500;700&display=swap"
	rel="stylesheet"
/>
```

This single URL loads all three fonts in the exact weights the design uses.

### 2. Hero.svelte — Script

```ts
const HERO_WORDS = [
	'intelligent processes',
	'captivating stories',
	'sexy experiences',
	'impactful brands',
	'scalable systems'
];

let wi = $state(0);

$effect(() => {
	const id = setInterval(() => {
		wi = (wi + 1) % HERO_WORDS.length;
	}, 2400);
	return () => clearInterval(id);
});
```

Terminal lines defined as a typed array: `{ html: string; cursor?: true }[]`. Each line's HTML uses token `<span>` classes (`.tk-key`, `.tk-str`, etc.) and is rendered via `{@html line.html}`.

### 3. Hero.svelte — Template Structure

```
<section class="hero paper-bg">
  <!-- Monstera plant: absolute left -->
  <!-- Snake plant: absolute right -->
  <!-- Spinning sticker badge: absolute top-right -->
  <div class="container">
    <!-- Greeting bar: status pulse + "available · q3 / 2026" + location -->
    <div class="grid">
      <!-- Left column -->
        <div class="meta meta-dot">greetings, I'm branden</div>
        <h1>
          I build ↳
          <span class="scribble">
            {#key wi}
              <em class="rot">{ HERO_WORDS[wi] }</em>
            {/key}
            <!-- yellow SVG underline path -->
          </span>
          <span class="cursor"></span>
        </h1>
        <p class="lead">…</p>
        <!-- CTA buttons: "start a project →" and "see services" -->
      <!-- Right column: terminal window -->
        <div class="terminal">
          <!-- macOS dots bar + filename -->
          <div class="body">
            {#each lines as line, i}
              <div class="line" style="animation: fadein .6s {0.4 + i * 0.18}s both">
                <span class="ln">{ lineNum }</span>
                {@html line.html}
                {#if line.cursor}<span class="blink">▍</span>{/if}
              </div>
            {/each}
          </div>
          <!-- Vine SVG: absolute right side of terminal -->
        </div>
    </div>
  </div>
</section>
```

### 4. Hero.svelte — CSS (scoped `<style>` block)

All px values converted to rem per project rules (÷16).

**Scoped classes** (defined normally):

- `.hero` — `padding: 4rem 0 7.5rem; position: relative; overflow: hidden`
- `.hero .grid` — `display: grid; grid-template-columns: 1.2fr 1fr; gap: 3rem; align-items: end`
- `.greet` — `font-family: var(--mono); font-size: 0.8125rem; color: #5d543f; display: flex; align-items: center; gap: 0.625rem; margin-bottom: 1.5rem`
- `.hero h1 em` — `font-style: normal; color: var(--ink); display: inline-block; animation: wordFade .6s ease both`
- `.lead` — `margin-top: 2.25rem; max-width: 35rem; font-family: var(--mono); font-size: 0.875rem; color: #3a3528; line-height: 1.7`
- `.ctas` — `display: flex; gap: 0.875rem; margin-top: 2rem; flex-wrap: wrap`
- `.btn` — pill button (ink bg, paper text, mono font, hover translateY)
- `.btn.ghost` — transparent variant
- `.sticker` — `9.25rem × 9.25rem` circle, yellow bg, spin animation
- `.plants` — `position: absolute; pointer-events: none`
- `.plant-stem` / `.plant-stem-2` — sway animation
- `.terminal` — ink bg, rounded, rotated -1.2deg, box-shadow
- `.terminal .bar` — macOS dots row
- `.terminal .body` — code lines container
- `.terminal .line` — `white-space: pre-wrap`
- `.ln` — line number color `#55503e`

**Global token classes** (used inside `{@html}`, must escape scope):

```css
:global(.tk-key) {
	color: #b8c8f5;
}
:global(.tk-str) {
	color: #a8d8a8;
}
:global(.tk-com) {
	color: #6b6655;
	font-style: italic;
}
:global(.tk-num) {
	color: var(--yellow);
}
:global(.tk-fn) {
	color: var(--teal);
}
:global(.tk-prompt) {
	color: var(--yellow);
}
```

**Keyframes:**

```css
@keyframes wordFade {
	0% {
		opacity: 0;
		transform: translateY(0.875rem) rotate(-2deg);
	}
	60% {
		opacity: 1;
		transform: translateY(0) rotate(0);
	}
}
@keyframes fadein {
	from {
		opacity: 0;
		transform: translateY(0.375rem);
	}
	to {
		opacity: 1;
		transform: none;
	}
}
@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}
@keyframes sway {
	0%,
	100% {
		transform: rotate(-1.5deg);
	}
	50% {
		transform: rotate(1.5deg);
	}
}
@keyframes pulse {
	0% {
		box-shadow: 0 0 0 0 rgba(62, 163, 92, 0.5);
	}
	70% {
		box-shadow: 0 0 0 0.625rem rgba(62, 163, 92, 0);
	}
	100% {
		box-shadow: 0 0 0 0 rgba(62, 163, 92, 0);
	}
}
```

**Responsive:**

```css
@media (max-width: 61.25rem) {
	/* 980px */
	.hero .grid {
		grid-template-columns: 1fr;
		gap: 2rem;
	}
}
```

### 5. Plant SVGs (inlined in Hero.svelte)

Three SVGs needed by the hero — inlined directly as markup (no separate component files):

- **Monstera** — `viewBox="0 0 220 220"`, width `16.25rem`, absolute top-left with `.plant-stem`
- **Snake** — `viewBox="0 0 160 220"`, width `11.25rem`, absolute bottom-right with `.plant-stem-2`
- **Vine** — `viewBox="0 0 60 380"`, width `3.125rem`, absolute on right edge of terminal

### 6. +page.svelte Update

```svelte
<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
</script>

<Hero />
```

---

## Verification

1. `npm run dev` — visit `localhost:5173`, confirm:
   - Words rotate every 2.4s with fade+slide animation
   - Yellow scribble underline stays under rotating word
   - Terminal lines stagger in on load, blinking cursor on last line
   - Monstera sways left, Snake sways right
   - Sticker badge spins
   - Buttons have hover transitions (lift + arrow slide)
2. Resize to `< 980px` — grid collapses to single column
3. `npm run check` — no TypeScript errors
