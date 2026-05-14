<script lang="ts">
	const navItems = [
		{ title: 'services', href: '/#services' },
		{ title: 'stack', href: '/#stack' },
		{ title: 'process', href: '/#process' },
		{ title: 'blog', href: '/blog' }
	];
</script>

<nav
	class="top-0 z-50 border-b border-black/10 bg-paper/80 backdrop-blur-md backdrop-saturate-150 md:sticky"
>
	<div class="container flex items-center justify-between gap-6 py-3.5">
		<a
			href="/"
			aria-label="Branden Builds"
			class="flex items-center gap-2.5 font-mono font-bold tracking-tight text-ink no-underline"
		>
			<svg
				class="h-5.5 w-auto fill-current"
				viewBox="0 0 178.565 291.148"
				xmlns="http://www.w3.org/2000/svg"
				aria-hidden="true"
				focusable="false"
			>
				<rect width="33.422" height="145.57"></rect>
				<rect width="78.641" height="78.641" transform="translate(67.079 34)"></rect>
				<path
					d="M5017.408,471.579H4905.343V617.148h145.486V471.579Zm0,112.147h-78.642V505h78.642Z"
					transform="translate(-4872.264 -326)"
				></path>
			</svg>
			<span>BrandenBuilds<span class="text-teal">.</span></span>
		</a>

		<div class="hidden gap-7 font-mono text-[0.8125rem] md:flex">
			{#each navItems as item (item.href)}
				<a
					href={item.href}
					class="relative px-0.5 py-1.5 text-ink no-underline after:absolute after:right-full after:bottom-[-0.125rem] after:left-0 after:h-0.5 after:bg-ink after:transition-[right] after:duration-200 after:content-[''] hover:after:right-0"
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
				href="/#contact"
				class="relative px-0.5 py-1.5 text-ink no-underline after:absolute after:right-full after:bottom-[-0.125rem] after:left-0 after:h-0.5 after:bg-ink after:transition-[right] after:duration-200 after:content-[''] hover:after:right-0"
				>contact</a
			>
		</div>
	</div>
</nav>
