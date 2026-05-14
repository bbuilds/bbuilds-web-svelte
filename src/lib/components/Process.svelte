<script lang="ts">
	const PROCESS = [
		{
			n: '01',
			title: 'Discover',
			copy: 'Aligning on the actual problem. Not the brief. Audits, stakeholder interviews, and a one-pager you can take to the board.'
		},
		{
			n: '02',
			title: 'Research',
			copy: "Survey the landscape. Competitors, prior art, technical constraints. Quick prototype if a question can't be answered with a doc."
		},
		{
			n: '03',
			title: 'Create',
			copy: 'Design and build in vertical slices. PRs you can ship every Friday. Demo + retro every other week.'
		},
		{
			n: '04',
			title: 'Ship',
			copy: 'Production rollout, instrumentation, then iterate. I leave teams better than I found them — every project ships with documentation.'
		}
	] as const;

	const DURATION = 4200;

	let active = $state(0);
	let paused = $state(false);

	$effect(() => {
		const next = (active + 1) % PROCESS.length;
		if (paused) return;
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
				<div
					class="font-mono text-sm tracking-wider text-muted-dark uppercase before:mr-2 before:text-yellow before:content-['●']"
				>
					// 03.process
				</div>
				<h2 class="mt-2 text-paper">The creative <span class="text-teal">process</span>.</h2>
				<p class="mt-3.5 max-w-145 font-mono text-[0.8125rem] leading-[1.7] text-muted-dark">
					Every engagement runs the same loop. Tight, transparent, and biased toward shipping — then
					we do it again.
				</p>
			</div>
			<div class="loop-badge" aria-hidden="true">
				<svg viewBox="0 0 80 80" width="4rem" height="4rem">
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
							style="font-family:var(--mono);font-size:0.5625rem;fill:#8a8676;letter-spacing:0.125rem"
						>
							ITERATE · REPEAT · ITERATE · REPEAT ·
						</textPath>
					</text>
				</svg>
				<div class="mt-1.5 text-center font-mono text-[0.625rem] tracking-widest text-muted-dark">
					↻ iterative
				</div>
			</div>
		</header>

		<div class="phase-gittree relative mb-1.5 hidden h-16 md:block" aria-hidden="true">
			<svg
				viewBox="0 0 1000 70"
				preserveAspectRatio="none"
				style="width:100%;height:100%;display:block;overflow:visible"
			>
				<defs>
					<marker id="gh" markerWidth="8" markerHeight="8" refX="5" refY="4" orient="auto">
						<path
							d="M0,1 L6,4 L0,7"
							fill="none"
							stroke="#ffcd67"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</marker>
				</defs>
				<line
					x1="125"
					y1="50"
					x2="875"
					y2="50"
					stroke="rgba(255,255,255,0.18)"
					stroke-width="1.5"
				/>
				<path
					d="M 875 50 C 880 14, 920 8, 500 8 C 80 8, 120 14, 125 50"
					fill="none"
					stroke="#ffcd67"
					stroke-width="1.5"
					stroke-dasharray="5 5"
					opacity="0.7"
					marker-end="url(#gh)"
				/>
				{#each [125, 375, 625, 875] as x, i (x)}
					{@const nodeActive = i === active}
					{@const nodeDone = i < active}
					<g>
						<line
							x1={x}
							y1="50"
							x2={x}
							y2="70"
							stroke="rgba(255,255,255,0.18)"
							stroke-width="1.5"
						/>
						<circle
							cx={x}
							cy="50"
							r="7"
							fill="#1a1a1a"
							stroke={nodeActive ? '#ffcd67' : nodeDone ? '#7ba87b' : 'rgba(255,255,255,0.35)'}
							stroke-width="1.5"
						/>
						{#if nodeActive}
							<circle cx={x} cy="50" r="3.5" fill="#ffcd67" />
						{/if}
						{#if nodeDone}
							<circle cx={x} cy="50" r="3.5" fill="#7ba87b" />
						{/if}
					</g>
				{/each}
			</svg>
			<span class="phase-gittree-label">
				<span class="phase-gittree-prompt">$</span>
				<span>npm run iterate --repeat</span>
			</span>
		</div>

		<div
			class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-3.5 lg:grid-cols-4"
			role="group"
			aria-label="phase cards"
			onmouseenter={() => (paused = true)}
			onmouseleave={() => (paused = false)}
		>
			{#each PROCESS as p, i (p.n)}
				{@const isActive = i === active}
				{@const isDone = i < active}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
				<article
					class={[
						'phase relative flex min-h-60 cursor-pointer flex-col overflow-hidden rounded-[0.875rem] border border-white/8 bg-white/2.5 px-5.5 pt-5.5 pb-5.5',
						isActive && 'is-active',
						isDone && 'is-done'
					]}
					style="--i: {i}"
					onclick={() => (active = i)}
					aria-current={isActive ? 'step' : undefined}
				>
					<header class="mb-7 flex items-center">
						<span class="phase-no font-mono text-[0.6875rem] tracking-[0.08em] text-muted-dark"
							>{p.n}</span
						>
					</header>
					<h3 class="text-[1.75rem] font-medium tracking-[-0.02em] text-paper">{p.title}</h3>
					<p class="mt-2.5 mb-5.5 flex-1 font-mono text-[0.78125rem] leading-[1.65] text-[#cfc4ad]">
						{p.copy}
					</p>
					<div class="phase-track absolute inset-x-0 bottom-0 h-0.75 bg-white/6" aria-hidden="true">
						<div
							class="phase-fill"
							style="width: {isActive || isDone ? '100%' : '0%'}; transition: {isActive
								? `width ${DURATION}ms linear`
								: isDone
									? 'none'
									: 'width 0.35s ease'}"
						></div>
					</div>
				</article>
			{/each}
		</div>

		<div
			class="mt-6 flex items-center justify-center gap-3.5 font-mono text-[0.6875rem] text-muted-dark"
			role="tablist"
			aria-label="process step"
		>
			{#each PROCESS as p, i (p.n)}
				<button
					type="button"
					class={[
						'cursor-pointer rounded-full border border-white/20 bg-transparent px-3 py-1.25 font-mono text-[0.6875rem] tracking-[0.06em] text-muted-dark transition-all duration-250 hover:border-yellow/60 hover:text-paper',
						i === active && 'on'
					]}
					onclick={() => (active = i)}
					role="tab"
					aria-label={`go to step ${p.n} ${p.title}`}
				>
					<span>{p.n}</span>
				</button>
			{/each}
		</div>
	</div>
</section>

<style>
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

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

	.loop-badge svg {
		animation: spin 28s linear infinite;
	}

	.phase {
		opacity: 0;
		animation: phase-enter 0.6s cubic-bezier(0.2, 0.7, 0.2, 1) both;
		animation-delay: calc(var(--i, 0) * 90ms);
		transition:
			transform 0.4s cubic-bezier(0.2, 0.7, 0.2, 1),
			background 0.35s ease,
			border-color 0.35s ease,
			box-shadow 0.35s ease;
	}

	.phase:hover {
		transform: translateY(-0.25rem);
		background: rgba(255, 255, 255, 0.04);
		border-color: rgba(255, 205, 103, 0.4);
	}

	.phase.is-active {
		background: rgba(255, 205, 103, 0.06);
		border-color: rgba(255, 205, 103, 0.55);
		box-shadow:
			0 1.875rem 3.75rem -1.875rem rgba(255, 205, 103, 0.25),
			inset 0 0 0 0.0625rem rgba(255, 205, 103, 0.18);
	}

	.phase.is-done {
		border-color: rgba(255, 255, 255, 0.18);
	}

	.phase-no {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}

	.phase-no::before {
		content: '';
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 50%;
		background: #3a3a3a;
		transition:
			background 0.35s ease,
			box-shadow 0.35s ease;
	}

	.phase.is-active .phase-no {
		color: var(--yellow);
	}

	.phase.is-active .phase-no::before {
		background: var(--yellow);
		box-shadow: 0 0 0 0.25rem rgba(255, 205, 103, 0.18);
	}

	.phase.is-done .phase-no::before {
		background: #7ba87b;
	}

	.phase-fill {
		height: 100%;
		background: linear-gradient(90deg, var(--yellow), #ffd982);
		box-shadow: 0 0 0.75rem rgba(255, 205, 103, 0.4);
	}

	.phase.is-done .phase-fill {
		background: rgba(123, 168, 123, 0.55);
		box-shadow: none;
	}

	.phase-gittree-label {
		position: absolute;
		left: 50%;
		top: -0.125rem;
		transform: translateX(-50%);
		background: var(--ink);
		padding: 0.1875rem 0.875rem;
		font-family: var(--mono);
		font-size: 0.6875rem;
		letter-spacing: 0.04em;
		color: #a8a08a;
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		white-space: nowrap;
	}

	.phase-gittree-prompt {
		color: var(--teal);
	}

	button.on {
		background: var(--yellow);
		color: var(--ink);
		border-color: var(--yellow);
	}
</style>
