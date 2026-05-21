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
			x="220"
			y="194"
			text-anchor="end"
			font-family="var(--mono)"
			font-size="7"
			fill="var(--ink)"
			opacity="0.5"
			letter-spacing="0.5">WORKFLOW</text
		>
		<text
			x="50"
			y="194"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="7"
			fill="var(--ink)"
			opacity="0.55">in</text
		>
		<text
			x="120"
			y="194"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="7"
			fill="var(--ink)"
			opacity="0.55">hidden</text
		>
		<text
			x="190"
			y="194"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="7"
			fill="var(--ink)"
			opacity="0.55">out</text
		>
		<g stroke="var(--ink)" stroke-width="0.7" opacity="0.35" fill="none">
			{#each [40, 90, 140] as y1 (y1)}
				{#each [50, 110, 170] as y2 (y2)}
					<line x1="50" {y1} x2="120" {y2} />
				{/each}
			{/each}
		</g>
		<g stroke="var(--ink)" stroke-width="0.7" opacity="0.35" fill="none">
			{#each [50, 110, 170] as y1 (y1)}
				{#each [70, 130] as y2 (y2)}
					<line x1="120" {y1} x2="190" {y2} />
				{/each}
			{/each}
		</g>
		<g stroke="var(--yellow)" stroke-width="1.6" fill="none">
			<line x1="50" y1="90" x2="120" y2="110" />
			<line x1="120" y1="110" x2="190" y2="70" />
		</g>
		{#each [40, 90, 140] as y (y)}
			<circle cx="50" cy={y} r="5" fill="var(--paper)" stroke="var(--ink)" stroke-width="1" />
		{/each}
		{#each [50, 110, 170] as y, i (y)}
			<circle
				cx="120"
				cy={y}
				r={i === 1 ? 6.5 : 5}
				fill={i === 1 ? 'var(--yellow)' : 'var(--paper)'}
				stroke="var(--ink)"
				stroke-width={i === 1 ? 1.4 : 1}
			/>
		{/each}
		<circle cx="190" cy="70" r="6.5" fill="var(--yellow)" stroke="var(--ink)" stroke-width="1.4" />
		<circle cx="190" cy="130" r="5" fill="var(--paper)" stroke="var(--ink)" stroke-width="1" />
		<rect
			x="200"
			y="58"
			width="34"
			height="14"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="0.8"
			rx="2"
		/>
		<text
			x="217"
			y="68"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="7"
			font-weight="700"
			fill="var(--ink)"
			letter-spacing="0.6">SHIP</text
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
			x="34"
			y="30"
			width="170"
			height="24"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="1.1"
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
			stroke-width="1.1"
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
			stroke-width="1.4"
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
			stroke-width="1.1"
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
		<line
			x1="204"
			y1="118"
			x2="222"
			y2="118"
			stroke="var(--ink)"
			stroke-width="0.9"
			opacity="0.65"
		/>
		<circle cx="204" cy="118" r="2" fill="var(--yellow)" stroke="var(--ink)" stroke-width="0.8" />
		<text
			x="222"
			y="115"
			font-family="var(--mono)"
			font-size="7"
			fill="var(--ink)"
			font-weight="700"
			letter-spacing="0.5">AUDIT</text
		>
		<text
			x="222"
			y="124"
			font-family="var(--mono)"
			font-size="6"
			fill="var(--ink)"
			opacity="0.6"
			letter-spacing="0.5">bottleneck</text
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
				d="M 12 34 L 14 42 L 22 34 Z"
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
			<marker id="pi-arrow-inn" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
				<path
					d="M0,1 L6,4 L0,7"
					fill="none"
					stroke="var(--yellow)"
					stroke-width="1.6"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</marker>
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
		<path
			d="M 92 76 C 110 60, 130 90, 148 76"
			stroke="var(--yellow)"
			stroke-width="1.6"
			fill="none"
			marker-end="url(#pi-arrow-inn)"
		/>
		<text
			x="120"
			y="56"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="7"
			fill="var(--ink)"
			font-weight="700"
			letter-spacing="0.5">harden →</text
		>
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
		<g transform="translate(20 138)">
			{#each ['tested', 'typed', 'instrumented', 'documented'] as label, i (label)}
				<g transform="translate({i * 52} 0)">
					<rect
						x="0"
						y="0"
						width="10"
						height="10"
						fill="var(--yellow)"
						stroke="var(--ink)"
						stroke-width="0.9"
						rx="1.5"
					/>
					<path
						d="M 2.5 5 L 4.5 7 L 8 3"
						stroke="var(--ink)"
						stroke-width="1.2"
						fill="none"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<text
						x="14"
						y="9"
						font-family="var(--mono)"
						font-size="7"
						fill="var(--ink)"
						font-weight="600"
						letter-spacing="0.3">{label}</text
					>
				</g>
			{/each}
		</g>
	</svg>
{/if}
