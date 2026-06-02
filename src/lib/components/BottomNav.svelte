<script lang="ts">
	import { page } from '$app/state';
	import ToolsIcon from '$lib/components/svgs/icons/ToolsIcon.svelte';
	import ProcessIcon from '$lib/components/svgs/icons/ProcessIcon.svelte';
	import BlogIcon from '$lib/components/svgs/icons/BlogIcon.svelte';
	import MailIcon from '$lib/components/svgs/icons/MailIcon.svelte';

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
		`flex flex-1 items-center justify-center py-3 no-underline transition-colors duration-150 ${activeHref === href ? 'bg-paper-line text-ink' : 'text-ink/45 hover:text-ink'}`;
</script>

<svelte:window bind:scrollY />

<nav
	class="fixed right-0 bottom-0 left-0 z-50 flex items-center border-t border-paper-line bg-paper/85 backdrop-blur-[0.625rem] backdrop-saturate-150 md:hidden"
	aria-label="Mobile navigation"
>
	<a href="/#services" aria-label="Services" class={linkClass('/#services')}>
		<ToolsIcon />
	</a>

	<a href="/#process" aria-label="Process" class={linkClass('/#process')}>
		<ProcessIcon />
	</a>

	<a href="/#blog" aria-label="Blog" class={linkClass('/#blog')}>
		<BlogIcon />
	</a>

	<a
		href="#contact-modal"
		data-sveltekit-noscroll
		aria-label="Contact"
		class={linkClass('#contact-modal')}
	>
		<MailIcon />
	</a>
</nav>

<style>
	nav {
		padding-bottom: env(safe-area-inset-bottom);
	}
</style>
