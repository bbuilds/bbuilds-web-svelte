<script lang="ts">
	import type { PillarIconKind } from '$lib/services/types';

	interface Props {
		kind: PillarIconKind;
	}

	let { kind }: Props = $props();
</script>

{#if kind === 'ai'}
	<svg viewBox="0 0 240 200" class="mx-auto block h-auto w-full max-w-md" aria-hidden="true">
		<defs>
			<pattern id="pi-grid-ai" width="16" height="16" patternUnits="userSpaceOnUse">
				<path
					d="M 16 0 L 0 0 0 16"
					fill="none"
					stroke="rgba(26,26,26,0.35)"
					stroke-width="0.4"
					opacity="0.5"
				/>
			</pattern>
		</defs>
		<rect width="240" height="200" fill="url(#pi-grid-ai)" />
		<line x1="20" y1="20" x2="20" y2="180" stroke="var(--ink)" stroke-width="0.8" opacity="0.4" />
		<line x1="20" y1="180" x2="220" y2="180" stroke="var(--ink)" stroke-width="0.8" opacity="0.4" />
		<text
			x="14"
			y="14"
			font-family="var(--mono)"
			font-size="7"
			fill="var(--ink)"
			opacity="0.5"
			letter-spacing="0.5">LEVERAGE</text
		>
		<text
			x="50"
			y="194"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="6"
			fill="var(--ink)"
			opacity="0.55">AUDIT</text
		>
		<text
			x="120"
			y="194"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="6"
			fill="var(--ink)"
			opacity="0.55">MAP·BUILD</text
		>
		<text
			x="190"
			y="194"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="6"
			fill="var(--ink)"
			opacity="0.55">DEPLOY</text
		>
		<rect
			x="26"
			y="24"
			width="186"
			height="148"
			fill="none"
			stroke="var(--ink)"
			stroke-width="0.6"
			stroke-dasharray="4 3"
			opacity="0.2"
			rx="2"
		/>
		<text
			x="29"
			y="21"
			font-family="var(--mono)"
			font-size="5.5"
			fill="var(--ink)"
			opacity="0.35"
			letter-spacing="0.3">SCAN</text
		>
		<g stroke="var(--ink)" stroke-width="0.7" opacity="0.16" fill="none">
			{#each [40, 90, 140] as y1 (y1)}
				{#each [50, 110, 170] as y2 (y2)}
					<line x1="50" {y1} x2="120" {y2} />
				{/each}
			{/each}
		</g>
		<g stroke="var(--ink)" stroke-width="0.5" opacity="0.09" fill="none" stroke-dasharray="2 3">
			<line x1="50" y1="40" x2="120" y2="170" />
			<line x1="50" y1="140" x2="120" y2="50" />
			<line x1="75" y1="30" x2="130" y2="175" />
		</g>
		<g stroke="var(--ink)" stroke-width="0.7" opacity="0.16" fill="none">
			{#each [50, 110, 170] as y1 (y1)}
				{#each [70, 130] as y2 (y2)}
					<line x1="120" {y1} x2="190" {y2} />
				{/each}
			{/each}
		</g>
		<g stroke="var(--ink)" stroke-width="0.5" opacity="0.09" fill="none" stroke-dasharray="2 3">
			<line x1="120" y1="170" x2="190" y2="70" />
			<line x1="120" y1="50" x2="190" y2="130" />
		</g>
		<line x1="50" y1="90" x2="120" y2="110" stroke="var(--yellow)" stroke-width="2.2" />
		<line x1="120" y1="110" x2="190" y2="70" stroke="var(--yellow)" stroke-width="2.2" />
		{#each [{ y: 40, label: 'DATA', w: 15 }, { y: 90, label: 'BRAND', w: 18 }, { y: 140, label: 'OPS', w: 12 }] as node (node.y)}
			<rect x={41 - node.w} y={node.y - 2.5} width={node.w + 2} height="7" fill="var(--paper)" />
			<circle cx="50" cy={node.y} r="5" fill="var(--paper)" stroke="var(--ink)" stroke-width="1" />
			<text
				x="43"
				y={node.y + 2.5}
				text-anchor="end"
				font-family="var(--mono)"
				font-size="5.5"
				fill="var(--ink)"
				opacity="0.5">{node.label}</text
			>
		{/each}
		{#each [{ y: 50, label: 'ROUTE', active: false, lw: 20 }, { y: 110, label: 'AI CORE', active: true, lw: 25 }, { y: 170, label: 'ANALYZE', active: false, lw: 22 }] as node (node.y)}
			<rect x="126" y={node.y - 2.5} width={node.lw} height="7" fill="var(--paper)" />
			<circle
				cx="120"
				cy={node.y}
				r={node.active ? 6.5 : 5}
				fill={node.active ? 'var(--yellow)' : 'var(--paper)'}
				stroke="var(--ink)"
				stroke-width={node.active ? 1.4 : 1}
			/>
			{#if node.active}
				<path
					d="M 120 {node.y - 3.5} L 120.85 {node.y - 0.85} L 123.5 {node.y} L 120.85 {node.y +
						0.85} L 120 {node.y + 3.5} L 119.15 {node.y + 0.85} L 116.5 {node.y} L 119.15 {node.y -
						0.85} Z"
					fill="var(--ink)"
					opacity="0.6"
				/>
			{/if}
			<text
				x="128"
				y={node.y + 2.5}
				font-family="var(--mono)"
				font-size="5"
				fill="var(--ink)"
				opacity={node.active ? 0.7 : 0.45}>{node.label}</text
			>
		{/each}
		<circle cx="190" cy="70" r="6.5" fill="var(--yellow)" stroke="var(--ink)" stroke-width="1.4" />
		<path
			d="M 190 66.5 L 190.85 69.15 L 193.5 70 L 190.85 70.85 L 190 73.5 L 189.15 70.85 L 186.5 70 L 189.15 69.15 Z"
			fill="var(--ink)"
			opacity="0.6"
		/>
		<circle cx="190" cy="130" r="5" fill="var(--paper)" stroke="var(--ink)" stroke-width="1" />
		<rect
			x="200"
			y="58"
			width="36"
			height="14"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="0.8"
			rx="2"
		/>
		<text
			x="218"
			y="68"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="7"
			font-weight="700"
			fill="var(--ink)"
			letter-spacing="0.6">VISION</text
		>
	</svg>
{:else if kind === 'systems'}
	<svg viewBox="0 0 240 200" class="mx-auto block h-auto w-full max-w-md" aria-hidden="true">
		<defs>
			<pattern id="pi-grid-sys" width="16" height="16" patternUnits="userSpaceOnUse">
				<path
					d="M 16 0 L 0 0 0 16"
					fill="none"
					stroke="rgba(26,26,26,0.35)"
					stroke-width="0.4"
					opacity="0.5"
				/>
			</pattern>
		</defs>
		<rect width="240" height="200" fill="url(#pi-grid-sys)" />
		<text
			x="14"
			y="42"
			font-family="var(--mono)"
			font-size="7"
			fill="var(--ink)"
			opacity="0.55"
			letter-spacing="0.6">L4</text
		>
		<text
			x="14"
			y="80"
			font-family="var(--mono)"
			font-size="7"
			fill="var(--ink)"
			opacity="0.55"
			letter-spacing="0.6">L3</text
		>
		<text
			x="14"
			y="118"
			font-family="var(--mono)"
			font-size="7"
			fill="var(--ink)"
			opacity="0.55"
			letter-spacing="0.6">L2</text
		>
		<text
			x="14"
			y="156"
			font-family="var(--mono)"
			font-size="7"
			fill="var(--ink)"
			opacity="0.55"
			letter-spacing="0.6">L1</text
		>
		<rect
			x="30"
			y="26"
			width="178"
			height="146"
			fill="none"
			stroke="var(--ink)"
			stroke-width="0.6"
			stroke-dasharray="4 3"
			opacity="0.25"
			rx="2"
		/>
		<rect
			x="34"
			y="30"
			width="170"
			height="24"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="1.3"
			rx="2"
		/>
		<text x="44" y="46" font-family="var(--mono)" font-size="9" fill="var(--ink)" font-weight="600"
			>interface</text
		>
		<rect
			x="34"
			y="68"
			width="170"
			height="24"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="1.3"
			rx="2"
		/>
		<text x="44" y="84" font-family="var(--mono)" font-size="9" fill="var(--ink)" font-weight="600"
			>api · services</text
		>
		<rect
			x="34"
			y="106"
			width="170"
			height="24"
			fill="var(--yellow)"
			stroke="var(--ink)"
			stroke-width="1.6"
			rx="2"
		/>
		<text x="44" y="122" font-family="var(--mono)" font-size="9" fill="var(--ink)" font-weight="700"
			>domain logic</text
		>
		<rect
			x="34"
			y="144"
			width="170"
			height="24"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="1.3"
			rx="2"
		/>
		<text x="44" y="160" font-family="var(--mono)" font-size="9" fill="var(--ink)" font-weight="600"
			>data · infra</text
		>
		{#each [58, 96, 134] as y (y)}
			<line
				x1="74"
				y1={y - 4}
				x2="74"
				y2={y + 4}
				stroke="var(--ink)"
				stroke-width="0.9"
				opacity="0.55"
			/>
			<line
				x1="119"
				y1={y - 4}
				x2="119"
				y2={y + 4}
				stroke="var(--ink)"
				stroke-width="0.9"
				opacity="0.55"
			/>
			<line
				x1="164"
				y1={y - 4}
				x2="164"
				y2={y + 4}
				stroke="var(--ink)"
				stroke-width="0.9"
				opacity="0.55"
			/>
		{/each}
		<circle cx="204" cy="118" r="2" fill="var(--yellow)" stroke="var(--ink)" stroke-width="0.8" />
		<line
			x1="204"
			y1="118"
			x2="216"
			y2="118"
			stroke="var(--yellow)"
			stroke-width="1.2"
			stroke-dasharray="2 2"
			opacity="0.9"
		/>
		<text
			x="238"
			y="120"
			text-anchor="end"
			font-family="var(--mono)"
			font-size="7"
			fill="var(--ink)"
			font-weight="700"
			letter-spacing="0.5">AUDIT</text
		>
	</svg>
{:else if kind === 'research'}
	<svg viewBox="0 0 240 200" class="mx-auto block h-auto w-full max-w-md" aria-hidden="true">
		<defs>
			<pattern id="pi-grid-res" width="16" height="16" patternUnits="userSpaceOnUse">
				<path
					d="M 16 0 L 0 0 0 16"
					fill="none"
					stroke="rgba(26,26,26,0.35)"
					stroke-width="0.4"
					opacity="0.5"
				/>
			</pattern>
		</defs>
		<rect width="240" height="200" fill="url(#pi-grid-res)" />
		<line x1="28" y1="24" x2="28" y2="170" stroke="var(--ink)" stroke-width="0.9" opacity="0.55" />
		<line
			x1="28"
			y1="170"
			x2="220"
			y2="170"
			stroke="var(--ink)"
			stroke-width="0.9"
			opacity="0.55"
		/>
		<text
			x="22"
			y="18"
			font-family="var(--mono)"
			font-size="7"
			fill="var(--ink)"
			opacity="0.55"
			letter-spacing="0.5">N</text
		>
		<text
			x="220"
			y="184"
			text-anchor="end"
			font-family="var(--mono)"
			font-size="7"
			fill="var(--ink)"
			opacity="0.55"
			letter-spacing="0.5">TIME</text
		>
		{#each [{ x: 40, h: 40 }, { x: 58, h: 70 }, { x: 76, h: 55 }, { x: 94, h: 95 }, { x: 112, h: 78 }, { x: 130, h: 110 }, { x: 148, h: 92 }] as bar, i (bar.x)}
			<rect
				x={bar.x}
				y={170 - bar.h}
				width="10"
				height={bar.h}
				fill={i === 5 ? 'var(--yellow)' : 'var(--paper)'}
				stroke="var(--ink)"
				stroke-width="1"
			/>
		{/each}
		<line
			x1="135"
			y1="60"
			x2="218"
			y2="104"
			stroke="var(--yellow)"
			stroke-width="1"
			stroke-dasharray="3 3"
			opacity="0.55"
		/>
		<g transform="translate(170 36)">
			<rect
				x="0"
				y="0"
				width="58"
				height="34"
				rx="3"
				fill="var(--paper)"
				stroke="var(--ink)"
				stroke-width="1"
			/>
			<line x1="6" y1="10" x2="50" y2="10" stroke="var(--ink)" stroke-width="0.8" opacity="0.6" />
			<line x1="6" y1="18" x2="42" y2="18" stroke="var(--ink)" stroke-width="0.8" opacity="0.6" />
			<line x1="6" y1="26" x2="46" y2="26" stroke="var(--ink)" stroke-width="0.8" opacity="0.6" />
			<path
				d="M 44 34 L 48 68 L 52 34 Z"
				fill="var(--paper)"
				stroke="var(--ink)"
				stroke-width="1"
			/>
			<text
				x="-2"
				y="-4"
				font-family="var(--mono)"
				font-size="7"
				fill="var(--ink)"
				font-weight="700"
				letter-spacing="0.5">"WHY?"</text
			>
		</g>
		<g transform="translate(170 92)">
			{#each [{ x: 8, y: 8 }, { x: 28, y: 4 }, { x: 48, y: 12 }, { x: 18, y: 26 }, { x: 38, y: 28 }] as p, i (p.x)}
				<circle
					cx={p.x}
					cy={p.y}
					r="6"
					fill={i === 2 ? 'var(--yellow)' : 'var(--paper)'}
					stroke="var(--ink)"
					stroke-width="1"
				/>
			{/each}
			<rect
				x="-6"
				y="49"
				width="75"
				height="13"
				rx="6.5"
				fill="var(--paper)"
				stroke="var(--ink)"
				stroke-width="0.8"
			/>
			<text
				x="-2"
				y="58"
				font-family="var(--mono)"
				font-size="7"
				fill="var(--ink)"
				opacity="0.6"
				letter-spacing="0.5">n=14 interviews</text
			>
		</g>
	</svg>
{:else if kind === 'innovation'}
	<svg viewBox="0 0 240 200" class="mx-auto block h-auto w-full max-w-md" aria-hidden="true">
		<defs>
			<pattern id="pi-grid-inn" width="16" height="16" patternUnits="userSpaceOnUse">
				<path
					d="M 16 0 L 0 0 0 16"
					fill="none"
					stroke="rgba(26,26,26,0.35)"
					stroke-width="0.4"
					opacity="0.5"
				/>
			</pattern>
		</defs>
		<rect width="240" height="200" fill="url(#pi-grid-inn)" />
		<text
			x="50"
			y="20"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="7"
			fill="var(--ink)"
			opacity="0.55"
			letter-spacing="0.6">PROTOTYPE</text
		>
		<text
			x="190"
			y="20"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="7"
			fill="var(--ink)"
			opacity="0.55"
			letter-spacing="0.6">PRODUCTION</text
		>
		<!-- v0.1 prototype — dashed, organic, unrefined -->
		<g transform="translate(20 36)">
			<rect
				x="0"
				y="0"
				width="60"
				height="80"
				rx="2"
				fill="var(--paper)"
				stroke="var(--ink)"
				stroke-width="1"
				stroke-dasharray="3 2"
			/>
			<path
				d="M 6 12 C 18 8, 32 18, 54 10"
				stroke="var(--ink)"
				stroke-width="0.9"
				fill="none"
				opacity="0.7"
			/>
			<path
				d="M 6 26 C 22 22, 30 32, 50 28"
				stroke="var(--ink)"
				stroke-width="0.9"
				fill="none"
				opacity="0.55"
			/>
			<path
				d="M 6 40 C 14 36, 38 48, 54 42"
				stroke="var(--ink)"
				stroke-width="0.9"
				fill="none"
				opacity="0.55"
			/>
			<!-- Raw brand soul: gold squiggle cutting across the vibe-coded lines -->
			<path
				d="M 8 38 C 18 30, 32 48, 52 36"
				stroke="var(--yellow)"
				stroke-width="1.8"
				fill="none"
				opacity="0.8"
			/>
			<path
				d="M 6 54 C 24 52, 32 60, 48 56"
				stroke="var(--ink)"
				stroke-width="0.9"
				fill="none"
				opacity="0.55"
			/>
			<path
				d="M 6 68 C 18 66, 36 72, 50 70"
				stroke="var(--ink)"
				stroke-width="0.9"
				fill="none"
				opacity="0.55"
			/>
			<text
				x="2"
				y="-4"
				font-family="var(--mono)"
				font-size="7"
				fill="var(--ink)"
				opacity="0.7"
				letter-spacing="0.5">v0.1</text
			>
		</g>
		<!-- Suspension bridge — structural durability as the metaphor -->
		<text
			x="120"
			y="49"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="7"
			fill="var(--ink)"
			font-weight="700"
			letter-spacing="0.5">harden</text
		>
		<rect x="98" y="54" width="5" height="18" fill="var(--ink)" opacity="0.55" rx="0.5" />
		<rect x="138" y="54" width="5" height="18" fill="var(--ink)" opacity="0.55" rx="0.5" />
		<polyline
			points="82,72 100.5,54 120,62 140.5,54 158,72"
			stroke="var(--ink)"
			stroke-width="0.9"
			fill="none"
			opacity="0.55"
		/>
		<line x1="110" y1="58" x2="110" y2="72" stroke="var(--ink)" stroke-width="0.6" opacity="0.4" />
		<line x1="120" y1="62" x2="120" y2="72" stroke="var(--ink)" stroke-width="0.6" opacity="0.4" />
		<line x1="130" y1="58" x2="130" y2="72" stroke="var(--ink)" stroke-width="0.6" opacity="0.4" />
		<rect x="82" y="72" width="76" height="7" fill="var(--yellow)" opacity="0.9" rx="0.5" />
		<polygon points="158,71 166,75.5 158,80" fill="var(--yellow)" opacity="0.9" />
		<!-- v1.0 production — solid, structured, engineered -->
		<g transform="translate(160 36)">
			<rect
				x="0"
				y="0"
				width="60"
				height="80"
				rx="2"
				fill="var(--paper)"
				stroke="var(--ink)"
				stroke-width="1.4"
			/>
			<rect
				x="6"
				y="8"
				width="48"
				height="6"
				fill="var(--yellow)"
				stroke="var(--ink)"
				stroke-width="0.8"
				rx="1"
			/>
			<rect
				x="6"
				y="20"
				width="34"
				height="4"
				fill="var(--paper)"
				stroke="var(--ink)"
				stroke-width="0.7"
				rx="0.5"
			/>
			<rect
				x="6"
				y="28"
				width="48"
				height="4"
				fill="var(--paper)"
				stroke="var(--ink)"
				stroke-width="0.7"
				rx="0.5"
			/>
			<rect
				x="6"
				y="36"
				width="28"
				height="4"
				fill="var(--paper)"
				stroke="var(--ink)"
				stroke-width="0.7"
				rx="0.5"
			/>
			<rect
				x="6"
				y="48"
				width="48"
				height="22"
				fill="var(--paper)"
				stroke="var(--ink)"
				stroke-width="0.8"
				rx="1"
			/>
			<circle cx="48" cy="56" r="2" fill="var(--yellow)" stroke="var(--ink)" stroke-width="0.6" />
			<text
				x="2"
				y="-4"
				font-family="var(--mono)"
				font-size="7"
				fill="var(--ink)"
				font-weight="700"
				letter-spacing="0.5">v1.0</text
			>
		</g>
		<!-- 2×2 checklist grid — centered at x=120, ~25px column gap -->
		<!-- row 1 -->
		<rect
			x="62"
			y="126"
			width="10"
			height="10"
			fill="var(--yellow)"
			stroke="var(--ink)"
			stroke-width="0.9"
			rx="1.5"
		/>
		<path
			d="M 64.5 131 L 66.5 133 L 70 129"
			stroke="var(--ink)"
			stroke-width="1.2"
			fill="none"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<text
			x="76"
			y="135"
			font-family="var(--mono)"
			font-size="7"
			fill="var(--ink)"
			font-weight="600"
			letter-spacing="0.3">tested</text
		>
		<rect
			x="128"
			y="126"
			width="10"
			height="10"
			fill="var(--yellow)"
			stroke="var(--ink)"
			stroke-width="0.9"
			rx="1.5"
		/>
		<path
			d="M 130.5 131 L 132.5 133 L 136 129"
			stroke="var(--ink)"
			stroke-width="1.2"
			fill="none"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<text
			x="142"
			y="135"
			font-family="var(--mono)"
			font-size="7"
			fill="var(--ink)"
			font-weight="600"
			letter-spacing="0.3">clean</text
		>
		<!-- row 2 -->
		<rect
			x="62"
			y="150"
			width="10"
			height="10"
			fill="var(--yellow)"
			stroke="var(--ink)"
			stroke-width="0.9"
			rx="1.5"
		/>
		<path
			d="M 64.5 155 L 66.5 157 L 70 153"
			stroke="var(--ink)"
			stroke-width="1.2"
			fill="none"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<text
			x="76"
			y="159"
			font-family="var(--mono)"
			font-size="7"
			fill="var(--ink)"
			font-weight="600"
			letter-spacing="0.3">sexy</text
		>
		<rect
			x="128"
			y="150"
			width="10"
			height="10"
			fill="var(--yellow)"
			stroke="var(--ink)"
			stroke-width="0.9"
			rx="1.5"
		/>
		<path
			d="M 130.5 155 L 132.5 157 L 136 153"
			stroke="var(--ink)"
			stroke-width="1.2"
			fill="none"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<text
			x="142"
			y="159"
			font-family="var(--mono)"
			font-size="7"
			fill="var(--ink)"
			font-weight="600"
			letter-spacing="0.3">scalable</text
		>
	</svg>
{/if}
