<script lang="ts">
	import BlogHeroArt from './BlogHeroArt.svelte';
	import Button from '$lib/components/Button.svelte';

	interface Props {
		eyebrow?: string;
		title?: string;
		copy?: string;
		ctaLabel?: string;
		ctaHref?: string;
		ctaTarget?: string;
		ctaRel?: string;
	}

	const FALLBACKS = {
		eyebrow: '// 05.writing',
		title: 'Branden Builds Blog',
		copy: 'Read articles and posts on web development, SEO, and branding.',
		ctaLabel: 'Talk Nerdy to Me →',
		ctaHref: '/#contact-modal'
	};

	let {
		eyebrow = FALLBACKS.eyebrow,
		title = FALLBACKS.title,
		copy = FALLBACKS.copy,
		ctaLabel = FALLBACKS.ctaLabel,
		ctaHref = FALLBACKS.ctaHref,
		ctaTarget,
		ctaRel
	}: Props = $props();
</script>

<section class="ink-bg relative pt-16 pb-20">
	<div class="container">
		<div class="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
			<div>
				<p class="mb-4 font-mono text-[0.6875rem] tracking-[0.12em] text-teal uppercase">
					{eyebrow}
				</p>
				<h1
					class="mb-5 text-[clamp(2.75rem,7vw,5.5rem)] leading-[1.05] font-semibold tracking-[-0.03em] text-paper"
				>
					{title}
				</h1>
				<p class="mb-8 max-w-md text-lg leading-relaxed text-paper/70">{copy}</p>
				{#if ctaHref}
					<Button href={ctaHref} target={ctaTarget} rel={ctaRel} variant="dark">
						{ctaLabel}
					</Button>
				{/if}
			</div>
			<div class="hidden lg:block">
				<BlogHeroArt />
			</div>
		</div>
	</div>
</section>
