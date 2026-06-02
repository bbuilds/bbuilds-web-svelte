<script lang="ts">
	import { SERVICES_INDEX } from '$lib/services';
	import Eyebrow from '$lib/components/Eyebrow.svelte';

	interface Props {
		currentSlug: string;
		liveSlugs: string[];
	}

	let { currentSlug, liveSlugs }: Props = $props();

	const isLive = (slug: string) => liveSlugs.includes(slug);
	const curIdx = $derived(SERVICES_INDEX.findIndex((s) => s.slug === currentSlug));
	const others = $derived(SERVICES_INDEX.filter((s) => s.slug !== currentSlug));
	const prev = $derived(
		SERVICES_INDEX[(curIdx - 1 + SERVICES_INDEX.length) % SERVICES_INDEX.length]
	);
	const next = $derived(SERVICES_INDEX[(curIdx + 1) % SERVICES_INDEX.length]);
</script>

<section class="paper-bg relative border-t border-paper-line pt-20 pb-24">
	<div class="container">
		<Eyebrow text="// continue reading" class="mb-4 text-[0.8125rem] tracking-[0.06em]" />
		<h2 class="mb-12 text-[clamp(2rem,4vw,3.25rem)]">
			The other <span class="scribble relative inline-block"
				>pillars
				<svg
					viewBox="0 0 200 22"
					preserveAspectRatio="none"
					class="absolute right-[-6%] -bottom-3.5 left-[-6%] h-3.5 w-[112%] overflow-visible"
					aria-hidden="true"
				>
					<path
						d="M2 14 C 40 4, 80 20, 120 10 S 180 16, 198 8"
						stroke="#ffcd67"
						stroke-width="8"
						fill="none"
						stroke-linecap="round"
					/>
				</svg>
			</span>.
		</h2>

		<ul class="mb-16 list-none border-t border-paper-line p-0">
			{#each others as s (s.slug)}
				{@const live = isLive(s.slug)}
				<li class="border-b border-paper-line">
					<a
						class="grid grid-cols-[auto_1fr_auto] items-center gap-5 px-2 py-6 text-ink no-underline transition-[padding,background] duration-300 {live
							? 'group hover:bg-[rgba(184,130,26,0.08)] hover:pl-6'
							: 'pointer-events-none cursor-default opacity-40'}"
						href={live ? `/services/${s.slug}` : undefined}
						aria-disabled={!live || undefined}
					>
						<span
							class="min-w-8 font-mono text-[0.875rem] text-muted transition-colors duration-300 {live
								? 'group-hover:text-yellow'
								: ''}">{s.n}</span
						>
						<span class="flex flex-col gap-0.5">
							<span class="font-mono text-[0.6875rem] tracking-[0.08em] text-muted uppercase"
								>{s.sub}</span
							>
							<span class="text-[clamp(1.25rem,2.4vw,2rem)] font-medium tracking-[-0.02em]"
								>{s.title}</span
							>
						</span>
						<span
							class="font-mono text-xl text-muted transition-[transform,color] duration-300 {live
								? 'group-hover:translate-x-1.5 group-hover:text-ink'
								: ''}"
							aria-hidden="true">→</span
						>
					</a>
				</li>
			{/each}
		</ul>

		<div
			class="grid grid-cols-1 gap-4 border-t border-dashed border-paper-line pt-8 md:grid-cols-2 md:gap-8"
		>
			<a
				class="flex flex-col gap-1.5 py-4 text-inherit no-underline {isLive(prev.slug)
					? 'group'
					: 'pointer-events-none cursor-default opacity-40'}"
				href={isLive(prev.slug) ? `/services/${prev.slug}` : undefined}
				aria-disabled={!isLive(prev.slug) || undefined}
			>
				<span class="font-mono text-xs tracking-[0.04em] text-muted">← previous pillar</span>
				<span
					class="font-sans text-base font-medium text-ink transition-colors duration-200 {isLive(
						prev.slug
					)
						? 'group-hover:text-yellow'
						: ''}">{prev.n} · {prev.title}</span
				>
			</a>
			<a
				class="flex flex-col items-end gap-1.5 py-4 text-right text-inherit no-underline {isLive(
					next.slug
				)
					? 'group'
					: 'pointer-events-none cursor-default opacity-40'}"
				href={isLive(next.slug) ? `/services/${next.slug}` : undefined}
				aria-disabled={!isLive(next.slug) || undefined}
			>
				<span class="font-mono text-xs tracking-[0.04em] text-muted">next pillar →</span>
				<span
					class="font-sans text-base font-medium text-ink transition-colors duration-200 {isLive(
						next.slug
					)
						? 'group-hover:text-yellow'
						: ''}">{next.n} · {next.title}</span
				>
			</a>
		</div>
	</div>
</section>
