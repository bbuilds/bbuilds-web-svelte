<script lang="ts">
	import { SITE_NAME } from '$lib/config/site';
	import Logo from '$lib/components/svgs/icons/Logo.svelte';

	const navItems = [
		{ title: 'services', href: '/#services' },
		{ title: 'process', href: '/#process' },
		{ title: 'blog', href: '/#blog' }
	];
</script>

<nav
	class="top-0 z-50 border-b border-black/[0.07] bg-paper/78 backdrop-blur-[0.625rem] backdrop-saturate-150 md:sticky"
>
	<div class="container flex items-center justify-between gap-6 py-3.5">
		<a
			href="/"
			aria-label={SITE_NAME}
			class="flex items-center gap-2.5 font-mono font-bold tracking-tight text-ink no-underline"
		>
			<Logo class="h-5.5 w-auto fill-current" />
			<span>{SITE_NAME}<span class="text-teal">.</span></span>
		</a>

		<div class="hidden gap-7 font-mono text-[0.8125rem] md:flex">
			{#each navItems as item (item.href)}
				<a
					href={item.href}
					class="relative px-0.5 py-1.5 text-ink no-underline after:absolute after:right-full after:-bottom-0.5 after:left-0 after:h-0.5 after:bg-ink after:transition-[right] after:duration-200 after:content-[''] hover:after:right-0"
				>
					{item.title}
				</a>
			{/each}
		</div>

		<div class="hidden items-center gap-2 md:flex">
			<span class="flex items-center gap-2 text-xs text-charcoal">
				<span class="relative inline-flex h-2 w-2">
					<span
						class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-75"
					></span>
					<span class="relative inline-flex h-2 w-2 rounded-full bg-green"></span>
				</span>
			</span>
			<a
				href="#contact-modal"
				data-sveltekit-noscroll
				class="relative px-0.5 py-1.5 text-ink no-underline after:absolute after:right-full after:-bottom-0.5 after:left-0 after:h-0.5 after:bg-ink after:transition-[right] after:duration-200 after:content-[''] hover:after:right-0"
				>contact</a
			>
		</div>
	</div>
</nav>
