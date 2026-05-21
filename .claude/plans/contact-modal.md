# Contact Modal via URL Hash

## Context

The site currently has a full-page Contact section ([Contact.svelte](src/lib/components/Contact.svelte)) rendered in [+layout.svelte:23](src/routes/+layout.svelte#L23). The nav links in [Header.svelte:56](src/lib/components/Header.svelte#L56) and [BottomNav.svelte:85](src/lib/components/BottomNav.svelte#L85) both point to `/#contact` (scroll-to-section).

We want to replace that scroll behavior with a **URL-driven modal**: clicking "contact" sets the hash to `#contact-modal` and a native `<dialog>` opens. The hash is the single source of truth — share/bookmark the link and the modal opens on load. Closing the modal clears the hash.

## Approach

Use the native HTML `<dialog>` element with `showModal()`. React to `page.url.hash` from `$app/state` via `$effect` to open/close the dialog. Lock body scroll while open. Close on X-button click, backdrop click, or Esc (Esc is native).

## Changes

### 1. Update nav links → `#contact-modal`

- [src/lib/components/Header.svelte:56](src/lib/components/Header.svelte#L56) — change `href="/#contact"` to `href="/#contact-modal"`
- [src/lib/components/BottomNav.svelte:85](src/lib/components/BottomNav.svelte#L85) — change `href="/#contact"` to `href="/#contact-modal"`

Note: BottomNav's `activeHref` derivation watches `<section[id]>` elements; with no `#contact-modal` section in the DOM the mobile contact icon will never appear "active" via scroll — that's fine since the modal opens on click.

### 2. Create `src/lib/components/ContactModal.svelte`

New component, ~80 lines. Sketch:

```svelte
<script lang="ts">
	import { page } from '$app/state';
	import { replaceState } from '$app/navigation';

	let dialog = $state<HTMLDialogElement>();
	const isOpen = $derived(page.url.hash === '#contact-modal');

	$effect(() => {
		if (!dialog) return;
		if (isOpen && !dialog.open) dialog.showModal();
		else if (!isOpen && dialog.open) dialog.close();
	});

	// Body scroll lock while open
	$effect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
			return () => {
				document.body.style.overflow = '';
			};
		}
	});

	function close() {
		const url = new URL(page.url);
		url.hash = '';
		replaceState(url, page.state);
	}

	function onBackdropClick(e: MouseEvent) {
		if (e.target === dialog) close();
	}
</script>

<dialog bind:this={dialog} onclose={close} onclick={onBackdropClick} class="...">
	<form method="dialog" onsubmit={(e) => e.preventDefault()} class="...">
		<button type="button" aria-label="Close" onclick={close}>×</button>
		<h2>Contact</h2>
		<label>Name <input name="name" type="text" required /></label>
		<label>Email <input name="email" type="email" required /></label>
		<label>Message <textarea name="message" required></textarea></label>
		<button type="submit">Send</button>
	</form>
</dialog>

<style>
	/* Open/close animation: opacity + slight scale on the dialog,
     opacity on the backdrop. `display` and `overlay` are discrete
     properties; allow-discrete lets them transition so the close
     animation actually plays (otherwise display:none snaps off). */
	dialog {
		opacity: 0;
		transform: scale(0.96) translateY(0.5rem);
		transition:
			opacity 0.2s ease,
			transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
			overlay 0.2s ease allow-discrete,
			display 0.2s ease allow-discrete;
	}
	dialog[open] {
		opacity: 1;
		transform: scale(1) translateY(0);
	}
	/* @starting-style sets the "from" frame the first time the element
     is rendered in the open state, so the open transition has somewhere
     to animate from. */
	@starting-style {
		dialog[open] {
			opacity: 0;
			transform: scale(0.96) translateY(0.5rem);
		}
	}
	dialog::backdrop {
		background: rgb(0 0 0 / 0);
		transition:
			background 0.2s ease,
			overlay 0.2s ease allow-discrete,
			display 0.2s ease allow-discrete;
	}
	dialog[open]::backdrop {
		background: rgb(0 0 0 / 0.6);
	}
	@starting-style {
		dialog[open]::backdrop {
			background: rgb(0 0 0 / 0);
		}
	}
</style>
```

Key details:

- `bind:this={dialog}` gets the element ref via `$state`.
- `$derived(page.url.hash === '#contact-modal')` — reactive to URL.
- `$effect` syncs `dialog.showModal()`/`dialog.close()` to the derived state, including direct URL loads.
- `replaceState` (from `$app/navigation`) clears the hash without adding a history entry, so Back doesn't re-open the modal.
- `onclose={close}` handles native Esc-to-close — it fires `close`, which clears the hash so state stays consistent.
- `onclick` on the dialog: clicking the dialog element itself (not its content) means the backdrop was clicked — close.
- Body scroll lock: native `showModal()` doesn't lock page scroll, so set `body.overflow = 'hidden'` (cleanup via effect teardown).
- Sizes use **rem only** per project convention.
- **Animation strategy**: CSS-only, no JS timers. `@starting-style` provides the "from" frame for the open animation; `transition-behavior: allow-discrete` on `display` and `overlay` lets the close animation play before the dialog unmounts from the top layer. Modern browsers only (Chrome 117+, Firefox 129+, Safari 17.4+) — older browsers degrade gracefully to instant open/close.

### Alignment with the Svelte example

Same shape as the official Svelte example — native `<dialog>`, `bind:this`, `$effect` calling `showModal()`, `onclose` to sync state back, `onclick` target check for backdrop dismiss. The one structural difference: the example owns state via a parent's `bind:showModal`, while ours derives state from `page.url.hash` (URL as source of truth). That means our `$effect` also calls `dialog.close()` when the hash changes externally (back button, manual URL edit) — the example doesn't need that branch.

### 3. Register in layout

- [src/routes/+layout.svelte](src/routes/+layout.svelte) — add `import ContactModal from '$lib/components/ContactModal.svelte';` and render `<ContactModal />` (placement near `<Contact />` is fine; it's portal-like via top layer).

### Out of scope

- Removing or refactoring the existing `<Contact />` section in the layout — user did not ask.
- Form submission (explicitly "does nothing").
- Focus management beyond what `<dialog>` provides natively.

## Critical files

- [src/routes/+layout.svelte](src/routes/+layout.svelte) — add import + render
- [src/lib/components/Header.svelte](src/lib/components/Header.svelte) — update one href
- [src/lib/components/BottomNav.svelte](src/lib/components/BottomNav.svelte) — update one href
- `src/lib/components/ContactModal.svelte` — new

## Verification

1. `npm run dev`, visit `/`.
2. Click "contact" in the top nav → URL becomes `/#contact-modal`, dialog opens, black backdrop visible, page scroll locked.
3. Click the X → dialog closes, hash cleared from URL, scroll restored.
4. Reopen, click outside the dialog content (on backdrop) → closes.
5. Reopen, press Esc → closes (native), hash cleared via `onclose`.
6. Visit `/#contact-modal` directly in a new tab → dialog opens on load.
7. On mobile width, repeat from BottomNav.
8. Confirm the open animation (fade + slight scale-up) and the close animation (reverse) both play smoothly. Backdrop should fade in/out.
9. `npm run check` for type errors. Run `svelte-autofixer` on the new component via the Svelte MCP before finalizing.
