<script lang="ts">
	import type { Diagram, DiagramNode } from '$lib/services/types';

	interface Props {
		diagram: Diagram;
	}

	let { diagram }: Props = $props();

	function getNode(id: string): DiagramNode | undefined {
		return diagram.nodes.find((n) => n.id === id);
	}
</script>

<div class="bp" aria-hidden="true">
	<div class="bp-chrome">
		<div class="bp-chrome-dots">
			<span></span><span></span><span></span>
		</div>
		<div class="bp-chrome-title">~ / {diagram.title}</div>
		<div class="bp-chrome-status">
			<span class="bp-chrome-status-dot"></span>
			live
		</div>
	</div>

	<div class="bp-canvas">
		<svg viewBox="0 0 520 360" class="bp-svg">
			<defs>
				<pattern id="bpgrid" width="20" height="20" patternUnits="userSpaceOnUse">
					<path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(26,26,26,0.05)" stroke-width="0.5" />
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
			<text
				x="10"
				y="354"
				fill="var(--muted)"
				font-family="var(--mono)"
				font-size="9"
				letter-spacing="1">REALITY</text
			>
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

			{#each diagram.nodes as node, i (node.id)}
				{@const w = node.w ?? 110}
				{@const h = 32}
				<g class="bp-node {node.hot ? 'bp-node-hot' : ''}" style="--i:{i}">
					<rect
						x={node.x - w / 2}
						y={node.y - h / 2}
						width={w}
						height={h}
						rx="3"
						fill={node.hot ? 'var(--pale-fire)' : 'var(--paper)'}
						stroke="var(--ink)"
						stroke-width={node.hot ? 1.4 : 1}
					/>
					<text
						x={node.x}
						y={node.y + 3.5}
						text-anchor="middle"
						fill="var(--ink)"
						font-family="var(--mono)"
						font-size="10"
						font-weight={node.hot ? 700 : 500}
						letter-spacing="0.5">{node.label}</text
					>
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
		</svg>
	</div>

	<div class="bp-footer">
		<span class="bp-prompt">$</span>
		<span class="bp-cmd">{diagram.cmd ?? ''}</span>
		<span class="bp-cursor" aria-hidden="true">▍</span>
	</div>
</div>

<style>
	.bp {
		background: var(--paper);
		border: 1px solid var(--ink);
		border-radius: 0.75rem;
		overflow: hidden;
		box-shadow:
			0 1.5rem 3rem -1.5rem rgba(26, 26, 26, 0.25),
			inset 0 0 0 1px rgba(26, 26, 26, 0.04);
		font-family: var(--mono);
		position: relative;
	}

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

	.bp-chrome {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem 0.875rem;
		border-bottom: 1px solid var(--ink);
		background: rgba(26, 26, 26, 0.04);
		font-size: 0.6875rem;
		letter-spacing: 0.05em;
	}

	.bp-chrome-dots {
		display: flex;
		gap: 0.3125rem;
	}

	.bp-chrome-dots span {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 50%;
		border: 1px solid var(--ink);
		background: var(--paper);
	}

	.bp-chrome-dots span:nth-child(1) {
		background: #f7c5a6;
	}
	.bp-chrome-dots span:nth-child(2) {
		background: #ffdf95;
	}
	.bp-chrome-dots span:nth-child(3) {
		background: #b6dbb6;
	}

	.bp-chrome-title {
		flex: 1;
		color: var(--charcoal);
		font-weight: 500;
	}

	.bp-chrome-status {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		color: var(--muted);
		text-transform: uppercase;
	}

	.bp-chrome-status-dot {
		width: 0.4375rem;
		height: 0.4375rem;
		border-radius: 50%;
		background: var(--green);
		box-shadow: 0 0 0 0.1875rem rgba(123, 168, 123, 0.18);
	}

	.bp-canvas {
		background:
			radial-gradient(circle at 20% 0%, rgba(255, 205, 103, 0.08), transparent 60%), var(--paper);
	}

	.bp-svg {
		display: block;
		width: 100%;
		height: auto;
	}

	.bp-node {
		animation: bpNodeIn 0.5s cubic-bezier(0.2, 0.7, 0.2, 1) both;
		animation-delay: calc(var(--i, 0) * 90ms + 0.25s);
	}

	:global(.bp-node-hot rect) {
		filter: drop-shadow(0 0.25rem 0.625rem rgba(255, 205, 103, 0.45));
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

	.bp-footer {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.625rem 0.875rem;
		border-top: 1px solid var(--ink);
		background: var(--ink);
		color: #cfc4ad;
		font-size: 0.6875rem;
		letter-spacing: 0.04em;
	}

	.bp-prompt {
		color: var(--teal);
		font-weight: 700;
	}

	.bp-cmd {
		color: #d8cdb6;
	}

	.bp-cursor {
		color: var(--yellow-bright);
		animation: bpBlink 1.1s steps(2) infinite;
		margin-left: auto;
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
