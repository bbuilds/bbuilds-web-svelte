<script lang="ts">
	import type { Diagram, DiagramNode } from '$lib/types/services';

	interface Props {
		diagram: Diagram;
	}

	let { diagram }: Props = $props();

	function getNode(id: string): DiagramNode | undefined {
		return diagram.nodes.find((n) => n.id === id);
	}
</script>

<div
	class="bp relative overflow-hidden rounded-xl border border-ink bg-paper font-mono shadow-[0_1.5rem_3rem_-1.5rem_var(--ink-25),inset_0_0_0_1px_var(--ink-04)]"
	aria-hidden="true"
>
	<div
		class="flex items-center gap-3 border-b border-ink bg-[color:var(--ink-04)] px-3.5 py-2 text-[0.6875rem] tracking-wider"
	>
		<div class="flex gap-1.25">
			<span class="h-2 w-2 rounded-full border border-ink bg-bp-chrome-red"></span>
			<span class="h-2 w-2 rounded-full border border-ink bg-bp-chrome-yellow"></span>
			<span class="h-2 w-2 rounded-full border border-ink bg-bp-chrome-green"></span>
		</div>
		<div class="flex-1 font-medium text-charcoal">~ / {diagram.title}</div>
		<div class="flex items-center gap-1.5 text-muted uppercase">
			<span class="h-1.75 w-1.75 rounded-full bg-green shadow-[0_0_0_0.1875rem_var(--green-18)]"
			></span>
			live
		</div>
	</div>

	<div class="bp-canvas">
		<svg viewBox="0 0 520 360" class="block h-auto w-full">
			<defs>
				<pattern id="bpgrid" width="20" height="20" patternUnits="userSpaceOnUse">
					<path
						d="M 20 0 L 0 0 0 20"
						fill="none"
						stroke="rgb(from var(--ink) r g b / 0.05)"
						stroke-width="0.5"
					/>
				</pattern>
				<marker id="bp-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
					<path
						d="M0,1 L6,4 L0,7"
						fill="none"
						stroke="var(--ink)"
						stroke-width="1"
						stroke-linecap="round"
						stroke-linejoin="round"
						opacity="0.55"
					/>
				</marker>
				<marker
					id="bp-arrow-yellow"
					markerWidth="8"
					markerHeight="8"
					refX="6"
					refY="4"
					orient="auto"
				>
					<path
						d="M0,1 L6,4 L0,7"
						fill="none"
						stroke="var(--yellow)"
						stroke-width="1.2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</marker>
			</defs>

			<rect width="520" height="360" fill="url(#bpgrid)" />

			<text
				x="10"
				y="14"
				fill="var(--muted)"
				font-family="var(--mono)"
				font-size="9"
				letter-spacing="1">VISION</text
			>
			<g stroke="var(--muted)" stroke-width="0.7" opacity="0.5" fill="none">
				<line x1="10" y1="20" x2="10" y2="34" />
				<path d="M 6 30 L 10 36 L 14 30" stroke-linecap="round" stroke-linejoin="round" />
			</g>
			<text
				x="510"
				y="354"
				text-anchor="end"
				fill="var(--muted)"
				font-family="var(--mono)"
				font-size="9"
				letter-spacing="1">REALITY</text
			>
			<g stroke="var(--muted)" stroke-width="0.7" opacity="0.5" fill="none">
				<line x1="510" y1="346" x2="510" y2="332" />
				<path d="M 506 336 L 510 330 L 514 336" stroke-linecap="round" stroke-linejoin="round" />
			</g>
			<text
				x="510"
				y="14"
				text-anchor="end"
				fill="var(--muted)"
				font-family="var(--mono)"
				font-size="9"
				letter-spacing="1">v0.1 ─ draft</text
			>

			{#each diagram.edges as edge (edge.from + '-' + edge.to)}
				{@const a = getNode(edge.from)}
				{@const b = getNode(edge.to)}
				{#if a && b}
					<line
						x1={a.x}
						y1={a.y}
						x2={b.x}
						y2={b.y}
						stroke={edge.hot ? 'var(--yellow)' : 'var(--ink)'}
						stroke-opacity={edge.hot ? 0.85 : 0.45}
						stroke-width={edge.hot ? 1.6 : 1.1}
						stroke-dasharray={edge.hot ? undefined : '4 3'}
						marker-end={edge.hot ? 'url(#bp-arrow-yellow)' : 'url(#bp-arrow)'}
						class={edge.hot ? 'bp-edge-hot' : ''}
					/>
				{/if}
			{/each}

			{#if diagram.loop}
				{#each diagram.loop.paths as d, i (i)}
					<path
						{d}
						fill="none"
						stroke="var(--yellow)"
						stroke-width="1.4"
						stroke-opacity="0.85"
						stroke-linecap="round"
						marker-end="url(#bp-arrow-yellow)"
						class="bp-loop"
					/>
				{/each}
				{#if diagram.loop.label}
					{@const lx = diagram.loop.labelX ?? 260}
					{@const ly = diagram.loop.labelY ?? 348}
					{@const lw = diagram.loop.label.length * 5 + 14}
					<rect
						x={lx - lw / 2}
						y={ly - 8}
						width={lw}
						height="14"
						rx="2"
						fill="var(--paper)"
						stroke="var(--yellow)"
						stroke-width="0.6"
						opacity="0.95"
					/>
					<text
						x={lx}
						y={ly + 2.5}
						text-anchor="middle"
						fill="var(--ink)"
						font-family="var(--mono)"
						font-size="8"
						letter-spacing="0.6">{diagram.loop.label}</text
					>
				{/if}
			{/if}

			{#each diagram.nodes as node, i (node.id)}
				{@const w = node.w ?? 110}
				{@const h = 32}
				<g
					class="bp-node {node.hot ? 'bp-node-hot' : ''} {node.warm ? 'bp-node-warm' : ''}"
					style:--i={i}
				>
					<rect
						x={node.x - w / 2}
						y={node.y - h / 2}
						width={w}
						height={h}
						rx="3"
						fill={node.hot ? 'var(--pale-fire)' : 'var(--paper)'}
						stroke={node.warm ? 'var(--yellow)' : 'var(--ink)'}
						stroke-width={node.hot ? 1.4 : node.warm ? 1.4 : 1}
					/>
					<text
						x={node.x}
						y={node.y + 3.5}
						text-anchor="middle"
						fill="var(--ink)"
						font-family="var(--mono)"
						font-size="10"
						font-weight={node.hot || node.warm ? 700 : 500}
						letter-spacing="0.5">{node.label}</text
					>
					{#if node.tag}
						<text
							x={node.x - w / 2}
							y={node.y - h / 2 - 5}
							fill="var(--muted)"
							font-family="var(--mono)"
							font-size="8"
							letter-spacing="0.7">{node.tag}</text
						>
					{/if}
				</g>
			{/each}

			{#each diagram.nodes.filter((n) => n.hot) as node (node.id)}
				<circle
					cx={node.x}
					cy={node.y}
					r="22"
					fill="none"
					stroke="var(--yellow)"
					stroke-width="1.2"
					opacity="0.4"
					class="bp-pulse"
				/>
			{/each}

			{#each diagram.nodes.filter((n) => n.warm && !n.hot) as node (node.id)}
				{@const w = node.w ?? 110}
				<rect
					x={node.x - w / 2 - 3}
					y={node.y - 19}
					width={w + 6}
					height={38}
					rx="4"
					fill="none"
					stroke="var(--yellow)"
					stroke-width="0.6"
					stroke-dasharray="2 3"
					opacity="0.55"
					class="bp-warm-frame"
				/>
			{/each}
		</svg>
	</div>

	<div
		class="flex items-center gap-2 border-t border-ink bg-ink px-3.5 py-2.5 text-[0.6875rem] tracking-[0.04em] text-bp-grid-label"
	>
		<span class="font-bold text-teal">$</span>
		<span class="text-paper-line">{diagram.cmd ?? ''}</span>
		<span class="bp-cursor ml-auto text-pale-fire" aria-hidden="true">▍</span>
	</div>
</div>

<style>
	.bp::after {
		content: '';
		position: absolute;
		inset: 0.5rem;
		pointer-events: none;
		background:
			linear-gradient(to right, var(--ink) 0 0.625rem, transparent 0.625rem) top left / 0.625rem 1px
				no-repeat,
			linear-gradient(to bottom, var(--ink) 0 0.625rem, transparent 0.625rem) top left / 1px
				0.625rem no-repeat,
			linear-gradient(to left, var(--ink) 0 0.625rem, transparent 0.625rem) top right / 0.625rem 1px
				no-repeat,
			linear-gradient(to bottom, var(--ink) 0 0.625rem, transparent 0.625rem) top right / 1px
				0.625rem no-repeat,
			linear-gradient(to right, var(--ink) 0 0.625rem, transparent 0.625rem) bottom left / 0.625rem
				1px no-repeat,
			linear-gradient(to top, var(--ink) 0 0.625rem, transparent 0.625rem) bottom left / 1px
				0.625rem no-repeat,
			linear-gradient(to left, var(--ink) 0 0.625rem, transparent 0.625rem) bottom right / 0.625rem
				1px no-repeat,
			linear-gradient(to top, var(--ink) 0 0.625rem, transparent 0.625rem) bottom right / 1px
				0.625rem no-repeat;
		opacity: 0.45;
	}

	.bp-canvas {
		background:
			radial-gradient(circle at 20% 0%, rgb(from var(--pale-fire) r g b / 0.08), transparent 60%),
			var(--paper);
	}

	.bp-node {
		animation: bpNodeIn 0.5s cubic-bezier(0.2, 0.7, 0.2, 1) both;
		animation-delay: calc(var(--i, 0) * 90ms + 0.25s);
	}

	:global(.bp-node-hot rect) {
		filter: drop-shadow(0 0.25rem 0.625rem var(--pale-fire-45));
	}

	:global(.bp-node-warm rect) {
		filter: drop-shadow(0 0.1875rem 0.5rem rgb(from var(--pale-fire) r g b / 0.22));
	}

	.bp-warm-frame {
		transform-origin: center;
		transform-box: fill-box;
		animation: bpWarmBreathe 3.6s ease-in-out infinite;
	}

	@keyframes bpWarmBreathe {
		0%,
		100% {
			opacity: 0.4;
		}
		50% {
			opacity: 0.7;
		}
	}

	.bp-pulse {
		transform-origin: center;
		transform-box: fill-box;
		animation: bpPulse 2.4s ease-out infinite;
	}

	:global(.bp-edge-hot) {
		stroke-dasharray: 5 4;
		animation: bpFlow 2s linear infinite;
	}

	.bp-cursor {
		animation: bpBlink 1.1s steps(2) infinite;
	}

	@keyframes bpNodeIn {
		from {
			opacity: 0;
			transform: translateY(0.5rem);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}

	@keyframes bpPulse {
		0% {
			transform: scale(0.55);
			opacity: 0.55;
		}
		100% {
			transform: scale(1.4);
			opacity: 0;
		}
	}

	@keyframes bpFlow {
		to {
			stroke-dashoffset: -18;
		}
	}

	@keyframes bpBlink {
		50% {
			opacity: 0;
		}
	}
</style>
