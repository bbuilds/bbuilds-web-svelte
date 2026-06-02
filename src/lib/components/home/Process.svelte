<script lang="ts">
	import type { StoryblokHomePage } from '$lib/types/storyblok';
	import Eyebrow from '$lib/components/Eyebrow.svelte';

	const DURATION = 4200;

	interface Props {
		content?: StoryblokHomePage;
	}
	let { content }: Props = $props();

	const phases = $derived(
		(content?.process_cards ?? []).map((c, i) => ({
			n: String(i + 1).padStart(2, '0'),
			title: c.title ?? '',
			copy: c.copy ?? ''
		}))
	);

	let active = $state(0);
	let paused = $state(false);

	$effect(() => {
		if (paused || phases.length === 0) return;
		const next = (active + 1) % phases.length;
		const id = setTimeout(() => {
			active = next;
		}, DURATION);
		return () => clearTimeout(id);
	});
</script>

<section id="process" class="ink-bg relative pt-30 pb-25">
	<div class="container">
		<header class="mb-14 flex flex-wrap items-end justify-between gap-8">
			<div>
				<Eyebrow text={content?.process_eyebrow} tone="dark" class="text-sm" />
				<h2 class="mt-2 text-paper">The runtime <span class="text-teal">loop</span>.</h2>
				<p class="mt-3.5 max-w-145 font-mono text-[0.8125rem] leading-[1.7] text-muted-dark">
					{content?.process_copy}
				</p>
			</div>
			<div class="hidden md:block" aria-hidden="true">
				<svg
					class="animate-[spin_28s_linear_infinite]"
					viewBox="0 0 80 80"
					width="4rem"
					height="4rem"
				>
					<defs>
						<path id="loopArc" d="M 40 8 A 32 32 0 1 1 39.99 8" fill="none" />
					</defs>
					<circle
						cx="40"
						cy="40"
						r="32"
						fill="none"
						stroke="rgba(255,255,255,0.15)"
						stroke-width="1"
						stroke-dasharray="3 4"
					/>
					<path
						d="M 40 8 A 32 32 0 1 1 22 14"
						fill="none"
						stroke="#ffcd67"
						stroke-width="2"
						stroke-linecap="round"
					/>
					<path
						d="M 22 14 L 26 8 M 22 14 L 16 16"
						stroke="#ffcd67"
						stroke-width="2"
						stroke-linecap="round"
						fill="none"
					/>
					<text>
						<textPath
							href="#loopArc"
							startOffset="0"
							font-family="var(--mono)"
							font-size="0.5625rem"
							fill="#8a8676"
							letter-spacing="0.125rem"
						>
							ITERATE · REPEAT · ITERATE · REPEAT ·
						</textPath>
					</text>
				</svg>
			</div>
		</header>

		<div class="relative mb-1.5 hidden h-20 md:block" aria-hidden="true">
			<svg
				viewBox="0 0 1000 80"
				preserveAspectRatio="none"
				class="block h-full w-full overflow-visible"
			>
				<line
					x1="500"
					y1="8"
					x2="500"
					y2="25"
					stroke="#ffcd67"
					stroke-width="1.5"
					stroke-dasharray="5 5"
					opacity="0.7"
				/>
				<line
					x1="125"
					y1="25"
					x2="875"
					y2="25"
					stroke="#ffcd67"
					stroke-width="1.5"
					stroke-dasharray="5 5"
					opacity="0.7"
				/>
				{#each [125, 375, 625, 875] as x (x)}
					<line
						x1={x}
						y1="25"
						x2={x}
						y2="55"
						stroke="#ffcd67"
						stroke-width="1.5"
						stroke-dasharray="5 5"
						opacity="0.7"
					/>
				{/each}
				<line
					x1="125"
					y1="55"
					x2="875"
					y2="55"
					stroke="rgba(255,255,255,0.18)"
					stroke-width="1.5"
				/>
				{#each [125, 375, 625, 875] as x, i (x)}
					{@const nodeActive = i === active}
					{@const nodeDone = i < active}
					<g>
						<line
							x1={x}
							y1="55"
							x2={x}
							y2="80"
							stroke="rgba(255,255,255,0.18)"
							stroke-width="1.5"
						/>
						<circle
							cx={x}
							cy="55"
							r="7"
							fill="#1a1a1a"
							style:stroke={nodeActive
								? 'var(--yellow)'
								: nodeDone
									? 'var(--green)'
									: 'rgba(255,255,255,0.35)'}
							stroke-width="1.5"
						/>
						{#if nodeActive}
							<circle cx={x} cy="55" r="3.5" fill="#ffcd67" />
						{/if}
						{#if nodeDone}
							<circle cx={x} cy="55" r="3.5" style:fill="var(--green)" />
						{/if}
					</g>
				{/each}
			</svg>
			<span
				class="absolute -top-3.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 bg-ink px-3.5 py-0.75 font-mono text-[0.6875rem] tracking-[0.04em] whitespace-nowrap text-[#a8a08a]"
			>
				<span class="text-teal">$</span>
				<span>npm run branden:builds --repeat</span>
			</span>
		</div>

		<div
			class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-3.5 lg:grid-cols-4"
			role="group"
			aria-label="phase cards"
			onmouseenter={() => (paused = true)}
			onmouseleave={() => (paused = false)}
		>
			{#each phases as p, i (p.n)}
				{@const isActive = i === active}
				{@const isDone = i < active}
				<button
					type="button"
					class={[
						'relative flex min-h-60 w-full cursor-pointer flex-col overflow-hidden rounded-[0.875rem] border border-white/8 bg-white/2.5 px-5.5 pt-5.5 pb-5.5 text-left',
						'animate-[phase-enter_0.6s_cubic-bezier(0.2,0.7,0.2,1)_both]',
						'[transition:transform_0.4s_cubic-bezier(0.2,0.7,0.2,1),background_0.35s_ease,border-color_0.35s_ease,box-shadow_0.35s_ease]',
						'hover:-translate-y-1 hover:border-yellow/40 hover:bg-white/4',
						'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow focus-visible:outline-solid',
						isActive &&
							'is-active border-yellow/55 bg-yellow/6 shadow-[0_1.875rem_3.75rem_-1.875rem_rgba(255,205,103,0.25),inset_0_0_0_0.0625rem_rgba(255,205,103,0.18)]',
						isDone && 'border-white/18',
						'[animation-delay:calc(var(--i)*90ms)]'
					]}
					style:--i={i}
					onclick={() => (active = i)}
					aria-current={isActive ? 'step' : undefined}
				>
					<div class="mb-7 flex items-center">
						<span
							class={[
								"inline-flex items-center gap-2 font-mono text-[0.6875rem] tracking-[0.08em] before:inline-block before:size-2 before:rounded-full before:transition-[background,box-shadow] before:duration-350 before:content-['']",
								isActive
									? 'text-yellow before:bg-yellow before:shadow-[0_0_0_0.25rem_rgba(255,205,103,0.18)]'
									: isDone
										? 'text-muted-dark before:bg-green'
										: 'text-muted-dark before:bg-[#3a3a3a]'
							]}>{p.n}</span
						>
					</div>
					<h3 class="text-[1.75rem] font-medium tracking-[-0.02em] text-paper">{p.title}</h3>
					<p
						class="mt-2.5 mb-5.5 flex-1 font-mono text-[0.78125rem] leading-[1.65] text-bp-grid-label"
					>
						{p.copy}
					</p>
					<div class="absolute inset-x-0 bottom-0 h-0.75 bg-white/6" aria-hidden="true">
						<div
							class={[
								'h-full',
								isDone
									? 'bg-[color-mix(in_srgb,var(--green)_55%,transparent)] shadow-none'
									: 'bg-linear-to-r from-yellow to-[#ffd982] shadow-[0_0_0.75rem_rgba(255,205,103,0.4)]'
							]}
							style:width={isActive || isDone ? '100%' : '0%'}
							style:transition={isActive
								? `width ${DURATION}ms linear`
								: isDone
									? 'none'
									: 'width 0.35s ease'}
						></div>
					</div>
				</button>
			{/each}
		</div>

		<div
			class="mt-6 flex items-center justify-center gap-3.5 font-mono text-[0.6875rem] text-muted-dark"
			aria-label="process steps"
		>
			{#each phases as p, i (p.n)}
				<button
					type="button"
					class={[
						'cursor-pointer rounded-full border px-3 py-1.25 font-mono text-[0.6875rem] tracking-[0.06em] transition-all duration-250',
						i === active
							? 'border-yellow bg-yellow text-ink'
							: 'border-white/20 bg-transparent text-muted-dark hover:border-yellow/60 hover:text-paper'
					]}
					onclick={() => (active = i)}
					aria-pressed={i === active}
					aria-label={`go to step ${p.n} ${p.title}`}
				>
					<span>{p.n}</span>
				</button>
			{/each}
		</div>
	</div>
</section>

<style>
	@keyframes phase-enter {
		from {
			opacity: 0;
			transform: translateY(1.25rem);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
</style>
