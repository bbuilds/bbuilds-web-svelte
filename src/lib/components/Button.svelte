<script lang="ts">
	import type { Snippet } from 'svelte';

	type Variant = 'primary' | 'ghost' | 'teal' | 'yellow';
	type Size = 'sm' | 'md' | 'lg';

	interface Props {
		href?: string;
		type?: 'button' | 'submit' | 'reset';
		variant?: Variant;
		size?: Size;
		disabled?: boolean;
		class?: string;
		onclick?: (e: MouseEvent) => void;
		children: Snippet;
	}

	let {
		href,
		type = 'button',
		variant = 'primary',
		size = 'md',
		disabled = false,
		class: className = '',
		onclick,
		children
	}: Props = $props();

	const sizeClasses: Record<Size, string> = {
		sm: 'px-4 py-2 text-xs gap-2',
		md: 'px-[1.375rem] py-[0.875rem] text-[0.8125rem] gap-[0.625rem]',
		lg: 'px-7 py-4 text-sm gap-3'
	};

	const classes = $derived(
		[
			'btn',
			`btn-${variant}`,
			'inline-flex items-center font-mono rounded-full border no-underline cursor-pointer',
			'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink',
			disabled ? 'opacity-50 pointer-events-none' : '',
			sizeClasses[size],
			className
		]
			.filter(Boolean)
			.join(' ')
	);
</script>

{#if href}
	<a {href} class={classes} aria-disabled={disabled || undefined} {onclick}>
		<span class="btn-inner">{@render children()}</span>
	</a>
{:else}
	<button {type} {onclick} {disabled} class={classes}>
		<span class="btn-inner">{@render children()}</span>
	</button>
{/if}

<style>
	/* Mimas hover effect — skewed overlay slides in/out, text uses mix-blend-mode to stay readable */
	.btn {
		overflow: hidden;
		position: relative;
	}

	.btn::before {
		content: '';
		position: absolute;
		top: 0;
		left: -10%;
		width: 120%;
		height: 100%;
		transform: skewX(30deg);
		transition: transform 0.4s cubic-bezier(0.3, 1, 0.8, 1);
	}

	.btn-inner {
		position: relative;
		z-index: 1;
		mix-blend-mode: difference;
	}

	/* Primary: ink overlay covers the button, slides away on hover to reveal paper bg */
	.btn-primary {
		background: var(--paper);
		color: #fff;
		border-color: var(--ink);
	}
	.btn-primary::before {
		background: var(--ink);
	}
	.btn-primary:hover::before {
		transform: translate3d(100%, 0, 0);
	}

	/* Ghost: ink overlay starts off-screen left, slides in on hover */
	.btn-ghost {
		background: transparent;
		color: #fff;
		border-color: var(--ink);
	}
	.btn-ghost::before {
		background: var(--ink);
		transform: translate3d(-110%, 0, 0) skewX(30deg);
	}
	.btn-ghost:hover::before {
		transform: translate3d(0, 0, 0) skewX(30deg);
	}

	/* Teal: ink overlay slides in on hover */
	.btn-teal {
		background: var(--teal);
		color: #fff;
		border-color: var(--teal);
	}
	.btn-teal::before {
		background: var(--ink);
		transform: translate3d(-110%, 0, 0) skewX(30deg);
	}
	.btn-teal:hover::before {
		transform: translate3d(0, 0, 0) skewX(30deg);
	}

	/* Yellow: ink overlay slides in on hover */
	.btn-yellow {
		background: var(--yellow);
		color: #fff;
		border-color: var(--yellow);
	}
	.btn-yellow::before {
		background: var(--ink);
		transform: translate3d(-110%, 0, 0) skewX(30deg);
	}
	.btn-yellow:hover::before {
		transform: translate3d(0, 0, 0) skewX(30deg);
	}
</style>
