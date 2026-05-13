<script lang="ts">
	import { page } from '$app/state';

	let scrollY = $state(0);

	const activeHref = $derived.by(() => {
		const pathname = page.url.pathname;
		if (pathname !== '/') return pathname;
		if (typeof document === 'undefined') return '';

		const sections = [...document.querySelectorAll<HTMLElement>('section[id]')];
		if (!sections.length) return '';

		const atBottom = window.innerHeight + scrollY >= document.documentElement.scrollHeight - 4;
		const active = atBottom
			? sections[sections.length - 1]
			: sections.reduce<HTMLElement>(
					(cur, s) => (s.getBoundingClientRect().top <= window.innerHeight * 0.35 ? s : cur),
					sections[0]
				);
		return `/#${active.id}`;
	});

	const linkClass = (href: string) =>
		`flex flex-1 items-center justify-center py-3 no-underline transition-colors duration-150 ${activeHref === href ? 'text-teal' : 'text-ink/35 hover:text-ink'}`;
</script>

<svelte:window bind:scrollY />

<nav
	class="fixed right-0 bottom-0 left-0 z-50 flex items-center border-t border-paper-line bg-paper/85 backdrop-blur-md backdrop-saturate-150 md:hidden"
	aria-label="Mobile navigation"
>
	<a href="/#services" aria-label="Services" class={linkClass('/#services')}>
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
			class="h-5 w-5"
		>
			<path
				d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
			/>
		</svg>
	</a>

	<a href="/#stack" aria-label="Stack" class={linkClass('/#stack')}>
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
			class="h-5 w-5"
		>
			<path
				d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"
			/>
			<path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
			<path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
		</svg>
	</a>

	<a href="/#process" aria-label="Process" class={linkClass('/#process')}>
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
			class="h-5 w-5"
		>
			<line x1="6" x2="6" y1="3" y2="15" />
			<circle cx="18" cy="6" r="3" />
			<circle cx="6" cy="18" r="3" />
			<path d="M18 9a9 9 0 0 1-9 9" />
		</svg>
	</a>

	<a href="/blog" aria-label="Blog" class={linkClass('/blog')}>
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
			class="h-5 w-5"
		>
			<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
			<path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
		</svg>
	</a>

	<a href="/#contact" aria-label="Contact" class={linkClass('/#contact')}>
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
			class="h-5 w-5"
		>
			<path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
			<rect x="2" y="4" width="20" height="16" rx="2" />
		</svg>
	</a>
</nav>

<style>
	nav {
		padding-bottom: env(safe-area-inset-bottom);
	}
</style>
