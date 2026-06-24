import { goto } from '$app/navigation';

/**
 * Drives a native `<dialog>` from the URL hash: opens it as a modal while the hash matches,
 * closes it (and strips the hash) otherwise, locks body scroll while open, and returns focus
 * to the trigger that opened it. Call this during component init and `bind:this` the dialog
 * element to a local variable passed in via `getDialog`.
 */
export function createHashDialog(hash: string, getDialog: () => HTMLDialogElement | undefined) {
	let triggerEl = $state<HTMLElement | null>(null);
	let currentHash = $state('');
	const isOpen = $derived(currentHash === hash);

	// Mirror the URL hash into reactive state.
	$effect(() => {
		currentHash = location.hash;
		const onHashChange = () => (currentHash = location.hash);
		window.addEventListener('hashchange', onHashChange);
		return () => window.removeEventListener('hashchange', onHashChange);
	});

	// Remember which trigger opened the dialog so focus can return to it on close.
	$effect(() => {
		const onClick = (e: MouseEvent) => {
			const target = e.target;
			if (!(target instanceof Element)) return;
			const anchor = target.closest(`a[href$="${hash}"]`);
			if (anchor instanceof HTMLElement) triggerEl = anchor;
		};
		document.addEventListener('click', onClick, true);
		return () => document.removeEventListener('click', onClick, true);
	});

	// Keep the native dialog's open state in sync with the hash.
	$effect(() => {
		const dialog = getDialog();
		if (!dialog) return;
		if (isOpen && !dialog.open) {
			dialog.showModal();
		} else if (!isOpen && dialog.open) {
			dialog.close();
		}
	});

	// Lock body scroll while the dialog is open.
	$effect(() => {
		if (!isOpen) return;
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = '';
		};
	});

	function close() {
		getDialog()?.close();
	}

	async function handleClose() {
		const trigger = triggerEl;
		triggerEl = null;
		if (location.hash !== hash) {
			trigger?.focus();
			return;
		}
		// Strip the hash so a refresh / back-button doesn't reopen the modal.
		// https://svelte.dev/docs/kit/state-management
		await goto(location.pathname + location.search, {
			replaceState: true,
			noScroll: true,
			keepFocus: true
		});
		currentHash = location.hash;
		trigger?.focus();
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === getDialog()) close();
	}

	return { close, handleClose, handleBackdropClick };
}
