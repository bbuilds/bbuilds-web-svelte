# Site Layout: Sticky Header & Mobile Menu

## Context

The new Svelte/SvelteKit project (`bbuilds-web-svelte`) currently has only a passthrough layout (`src/routes/+layout.svelte`) — no header, no navigation. We need to build a sticky top-bar navigation that:

- **Re-uses functionality** from the legacy Next.js site (`llm_docs/brandenbuilds-website-nextjs/components/Header.js`) — sticky top bar, hamburger button on mobile, full-screen overlay menu.
- **Adopts the new branding/UI** from the Claude-designed prototype (`llm_docs/brandenbuilds-claude-design/project/index.html`) — paper-grain palette, frosted-glass sticky bar, JetBrains Mono nav text, green pulsing status badge.
- **Favors Tailwind utilities over custom CSS, and CSS over JS** — sticky behavior, hover effects, responsive show/hide, status pulse, and overlay fade are all handled by Tailwind v4 utility classes referencing the project's existing `@theme` design tokens. Only the mobile-menu open state, body-scroll lock, and breakpoint-resize listener require minimal JS (`$state` + `$effect`).

Outcome: a reusable `Header.svelte` rendered once in the root layout so every route inherits the new navigation shell.

---

## Decisions (from user)

| Question     | Decision                                                                                                                                              |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nav items    | `services`, `stack`, `process`, `contact` (in-page anchors) **+** `blog` (route)                                                                      |
| Status badge | Include — green pulse + "open for q3 · 2026" (desktop only)                                                                                           |
| Logo         | Old site's icon SVG (`bar + square + box`) styled with `currentColor`, paired with `BrandenBuilds.` in JetBrains Mono (teal period) — no wordmark SVG |
| Mobile menu  | Full-screen overlay (old-site behavior — locks body scroll, slides into view)                                                                         |

---

## Files

### Create

- **`src/lib/components/Header.svelte`** — single component containing:
  - Sticky `<nav>` bar with logo, desktop nav links, status badge, hamburger toggle
  - Mobile full-screen overlay panel (rendered in same component, toggled by `$state` flag)
  - **Styled almost entirely with Tailwind v4 utility classes** referencing the existing design-token `@theme` (`bg-paper`, `text-ink`, `text-teal`, `font-mono`, `border-paper-line`, etc.) — no scoped `<style>` block needed

### Modify

- **`src/routes/+layout.svelte`** — import & render `<Header />` above `{@render children()}`. Keep favicon link.

### Read-only references (do not modify)

- `src/lib/styles/design.css` — design tokens (`--ink`, `--paper`, `--yellow`, `--teal`, `--mono`, etc.) — already wired into Tailwind v4 `@theme` and `:root` aliases
- `src/routes/layout.css` — already imports tailwindcss + design.css
- `llm_docs/brandenbuilds-claude-design/project/index.html` — source of nav CSS to port
- `llm_docs/brandenbuilds-website-nextjs/components/{Header,MobileNav,MenuToggle}.js` + `context/AppContext.js` — source of mobile-menu behavior

---

## Implementation

### `Header.svelte` structure (Tailwind-first)

The design tokens (`--color-yellow`, `--color-teal`, `--color-ink`, `--color-paper`, `--font-mono`, etc.) are already mapped into Tailwind v4 via the `@theme` block in `src/lib/styles/design.css`, so utility classes like `bg-paper`, `text-ink`, `text-teal`, `font-mono`, `border-paper-line` work out of the box.

```svelte
<script lang="ts">
  import { page } from '$app/state';

  let mobileOpen = $state(false);

  const navItems = [
    { title: 'services', href: '/#services' },
    { title: 'stack',    href: '/#stack' },
    { title: 'process',  href: '/#process' },
    { title: 'contact',  href: '/#contact' },
    { title: 'blog',     href: '/blog' }
  ];

  // Lock body scroll while overlay is open
  $effect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  });

  // Close overlay when crossing into desktop breakpoint (≥768px)
  $effect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const handler = (e: MediaQueryListEvent) => { if (e.matches) mobileOpen = false; };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  });
</script>

<nav class="sticky top-0 z-50 border-b border-black/10 bg-paper/80 backdrop-blur-md backdrop-saturate-150">
  <div class="container flex items-center justify-between gap-6 py-3.5">
    <!-- Logo -->
    <a
      href="/"
      aria-label="Branden Builds"
      class="flex items-center gap-2.5 font-mono font-bold tracking-tight text-ink no-underline"
      onclick={() => (mobileOpen = false)}
    >
      <svg class="h-[22px] w-auto fill-current" viewBox="0 0 178.565 291.148" aria-hidden="true" focusable="false">
        <rect width="33.422" height="145.57"/>
        <rect width="78.641" height="78.641" transform="translate(67.079 34)"/>
        <path d="M5017.408,471.579H4905.343V617.148h145.486V471.579Zm0,112.147h-78.642V505h78.642Z"
              transform="translate(-4872.264 -326)"/>
      </svg>
      <span>BrandenBuilds<span class="text-teal">.</span></span>
    </a>

    <!-- Desktop nav links (with pure-Tailwind hover-underline via after:) -->
    <div class="hidden gap-7 font-mono text-[13px] md:flex">
      {#each navItems as item}
        <a
          href={item.href}
          class="relative px-0.5 py-1.5 text-ink no-underline
                 after:absolute after:bottom-[-2px] after:left-0 after:right-full after:h-0.5 after:bg-ink after:content-['']
                 after:transition-[right] after:duration-200 hover:after:right-0"
        >
          {item.title}
        </a>
      {/each}
    </div>

    <!-- Status badge (desktop only) — uses Tailwind's built-in animate-ping for the ring -->
    <div class="hidden items-center gap-2 font-mono text-xs text-[#5d543f] md:flex">
      <span class="relative inline-flex h-2 w-2">
        <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-75"></span>
        <span class="relative inline-flex h-2 w-2 rounded-full bg-green"></span>
      </span>
      open for q3 · 2026
    </div>

    <!-- Hamburger (mobile only) — two inline SVGs swapped by state -->
    <button
      type="button"
      aria-label="Toggle navigation menu"
      aria-expanded={mobileOpen}
      onclick={() => (mobileOpen = !mobileOpen)}
      class="inline-flex h-9 w-11 items-center justify-center rounded-lg border border-ink bg-teal text-ink md:hidden"
    >
      {#if mobileOpen}
        <svg viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5" aria-hidden="true">
          <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
        </svg>
      {:else}
        <svg viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5" aria-hidden="true">
          <path d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/>
        </svg>
      {/if}
    </button>
  </div>
</nav>

<!-- Full-screen overlay menu — opacity fade via Tailwind transition utilities -->
<div
  class="fixed inset-0 z-40 bg-ink text-paper transition-opacity duration-200 md:hidden
         {mobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}"
  aria-hidden={!mobileOpen}
>
  <ul class="flex h-full flex-col gap-2 overflow-y-auto px-8 pb-20 pt-24">
    {#each navItems as item}
      <li>
        <a
          href={item.href}
          onclick={() => (mobileOpen = false)}
          class="block py-4 font-mono text-2xl text-teal no-underline hover:text-yellow"
        >
          {item.title}
        </a>
      {/each}
  </ul>
</div>
```

> ℹ️ **No `<style>` block needed.** Every visual concern (sticky bar, frosted glass, hover underline, status pulse, hamburger button, mobile overlay fade, responsive show/hide) is expressed with Tailwind utilities referencing the existing `@theme` tokens.

### `+layout.svelte` update

```svelte
<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<Header />
{@render children()}
```

---

## Reuse notes

- **Tailwind v4 `@theme` tokens** already exist in `src/lib/styles/design.css` (`--color-ink`, `--color-paper`, `--color-yellow`, `--color-teal`, `--color-green`, `--font-mono`). They generate utility classes like `bg-paper`, `text-ink`, `text-teal`, `font-mono`, `bg-green`, `border-paper-line` — use those directly instead of writing custom CSS.
- **`.container` utility** already exists in `design.css` (max-width 1280, 32px padding) — re-use on the nav's inner wrapper.
- **Mobile-overlay behavior** ported conceptually from the old `MobileNav` (full-screen, body-scroll lock) but simplified — the old `width:0 → 100vw` transition is replaced with an `opacity-0 → opacity-100` + `pointer-events` toggle via Tailwind utilities (cleaner, same UX).
- **Frosted-glass nav** ported from the Claude design (`nav.top` rules) but expressed as `sticky top-0 z-50 bg-paper/80 backdrop-blur-md backdrop-saturate-150 border-b border-black/10`.

## Tailwind-first styling choices

| Behavior                             | Implementation                                                                                            |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| Sticky bar                           | `sticky top-0 z-50` (Tailwind)                                                                            |
| Frosted glass                        | `bg-paper/80 backdrop-blur-md backdrop-saturate-150` (Tailwind)                                           |
| Hover underline                      | Tailwind `after:` pseudo utilities + `after:transition-[right] hover:after:right-0` — no scoped CSS       |
| Status pulse                         | Tailwind built-in `animate-ping` on an absolutely positioned ring layered over the green dot              |
| Hamburger ↔ X icon                   | Two inline SVGs swapped by `{#if mobileOpen}{:else}{/if}` (simpler than CSS-morphing spans, no animation) |
| Mobile overlay show/hide             | `transition-opacity duration-200` with `opacity-0/100` + `pointer-events-none/auto` toggled by `$state`   |
| Responsive show/hide                 | `hidden md:flex` (desktop nav, status) and `md:hidden` (hamburger, overlay)                               |
| Mobile-open state                    | `$state` rune (minimal JS — required)                                                                     |
| Body scroll lock                     | `$effect` toggles `body.style.overflow` (minimal JS — required)                                           |
| Auto-close on resize past breakpoint | `matchMedia` listener in `$effect` (minimal JS — required)                                                |

**Result: zero scoped `<style>` block.** All visuals come from Tailwind utilities referencing the project's existing `@theme`.

---

## Svelte 5 / MCP checklist

Per `CLAUDE.md`, during implementation I will:

1. Call `mcp__svelte__list-sections` first to discover relevant Svelte 5 docs.
2. Fetch any needed docs via `mcp__svelte__get-documentation` (likely `$state`, `$effect`, event handlers, snippet/each).
3. Run `mcp__svelte__svelte-autofixer` on the final `Header.svelte` until it returns no issues.
4. Do **not** request a playground link (code is being written into the project).
5. Spawn the `svelte:svelte-file-editor` agent to do the actual file writes (per its proactive-use directive).

---

## Verification

1. `npm run dev` → open `http://localhost:5173/`.
2. Desktop (≥768px): confirm sticky bar stays on scroll, hover underline animates, status badge pulses, anchors smooth-scroll.
3. Resize to <768px: nav links + status hide, hamburger appears.
4. Click hamburger: full-screen overlay fades + expands in; body scroll locks; X icon shown; link click closes overlay.
5. Resize back to desktop while overlay open: overlay auto-closes (matchMedia handler).
6. Click logo from any anchor: scrolls home & closes overlay.
7. `npm run check` → no type errors.
8. `npm run lint` → passes prettier + eslint.
9. Run `svelte-autofixer` MCP tool — no remaining issues.
