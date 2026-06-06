<script lang="ts">
	interface Props {
		pillarId: string | undefined;
	}

	let { pillarId }: Props = $props();
</script>

{#if pillarId === 'brand-strategy'}
	<svg viewBox="0 0 240 158" class="mx-auto block h-auto w-full max-w-md" aria-hidden="true">
		<defs>
			<marker id="bstr-ax" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
				<path
					d="M0,0.5 L4,2.5 L0,4.5"
					fill="none"
					stroke="var(--ink)"
					stroke-width="1"
					stroke-linecap="round"
					opacity="0.45"
				/>
			</marker>
			<marker id="bstr-ay" markerWidth="5" markerHeight="5" refX="2.5" refY="1" orient="auto">
				<path
					d="M0.5,4 L2.5,0 L4.5,4"
					fill="none"
					stroke="var(--ink)"
					stroke-width="1"
					stroke-linecap="round"
					opacity="0.45"
				/>
			</marker>
		</defs>

		<text
			x="14"
			y="11"
			font-family="var(--mono)"
			font-size="6.5"
			fill="var(--ink)"
			opacity="0.55"
			letter-spacing="0.6">POSITIONING MATRIX</text
		>

		<line
			x1="30"
			y1="128"
			x2="216"
			y2="128"
			stroke="var(--ink)"
			stroke-width="0.9"
			opacity="0.45"
			marker-end="url(#bstr-ax)"
		/>
		<line
			x1="30"
			y1="128"
			x2="30"
			y2="18"
			stroke="var(--ink)"
			stroke-width="0.9"
			opacity="0.45"
			marker-end="url(#bstr-ay)"
		/>

		<text x="32" y="137" font-family="var(--mono)" font-size="5.5" fill="var(--ink)" opacity="0.45"
			>LOW</text
		>
		<text
			x="212"
			y="137"
			text-anchor="end"
			font-family="var(--mono)"
			font-size="5.5"
			fill="var(--ink)"
			opacity="0.45">HIGH</text
		>
		<text
			x="122"
			y="143"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="5.5"
			fill="var(--ink)"
			opacity="0.45"
			letter-spacing="0.3">MARKET FRICTION</text
		>

		<text
			transform="rotate(-90)"
			x="-73"
			y="22"
			font-family="var(--mono)"
			font-size="5.5"
			fill="var(--ink)"
			opacity="0.45"
			text-anchor="middle"
			letter-spacing="0.3">EMOTIONAL RESONANCE</text
		>

		<line
			x1="30"
			y1="73"
			x2="216"
			y2="73"
			stroke="var(--ink)"
			stroke-width="0.4"
			opacity="0.18"
			stroke-dasharray="2 3"
		/>
		<line
			x1="123"
			y1="18"
			x2="123"
			y2="128"
			stroke="var(--ink)"
			stroke-width="0.4"
			opacity="0.18"
			stroke-dasharray="2 3"
		/>

		<circle
			cx="166"
			cy="47"
			r="17"
			fill="var(--teal)"
			fill-opacity="0.07"
			stroke="var(--teal)"
			stroke-width="0.7"
			stroke-opacity="0.3"
		/>
		<circle
			cx="184"
			cy="47"
			r="17"
			fill="var(--yellow)"
			fill-opacity="0.07"
			stroke="var(--yellow)"
			stroke-width="0.7"
			stroke-opacity="0.3"
		/>
		<circle
			cx="175"
			cy="61"
			r="17"
			fill="var(--ink)"
			fill-opacity="0.04"
			stroke="var(--ink)"
			stroke-width="0.7"
			stroke-opacity="0.2"
		/>

		<text
			x="150"
			y="37"
			font-family="var(--mono)"
			font-size="4.8"
			fill="var(--ink)"
			opacity="0.4"
			text-anchor="middle">core</text
		>
		<text
			x="198"
			y="37"
			font-family="var(--mono)"
			font-size="4.8"
			fill="var(--ink)"
			opacity="0.4"
			text-anchor="middle">needs</text
		>
		<text
			x="175"
			y="83"
			font-family="var(--mono)"
			font-size="4.8"
			fill="var(--ink)"
			opacity="0.4"
			text-anchor="middle">gaps</text
		>

		{#each [{ x: 62, y: 106 }, { x: 76, y: 94 }, { x: 88, y: 114 }, { x: 100, y: 104 }, { x: 70, y: 120 }, { x: 108, y: 90 }, { x: 56, y: 122 }, { x: 90, y: 82 }] as p, i (i)}
			<circle
				cx={p.x}
				cy={p.y}
				r="2.5"
				fill="rgb(from var(--ink) r g b / 0.2)"
				stroke="rgb(from var(--ink) r g b / 0.3)"
				stroke-width="0.6"
			/>
		{/each}
		<text
			x="80"
			y="118"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="5.5"
			fill="var(--ink)"
			opacity="0.35">competitors</text
		>

		<path
			d="M 46 126 Q 44 78 90 76 Q 118 76 116 100 Q 114 128 46 126 Z"
			fill="none"
			stroke="var(--yellow)"
			stroke-width="0.9"
			stroke-dasharray="3 3"
			opacity="0.5"
		/>

		<polygon
			points="175,45 183,53 175,61 167,53"
			fill="var(--paper)"
			stroke="var(--yellow)"
			stroke-width="1.8"
		/>
		<polygon points="175,49 179,53 175,57 171,53" fill="var(--yellow)" />

		<text
			x="186"
			y="56"
			font-family="var(--mono)"
			font-size="6.5"
			font-weight="700"
			fill="var(--yellow)"
			letter-spacing="0.5">YOU</text
		>
	</svg>
{:else if pillarId === 'brand-identity'}
	<svg viewBox="0 0 240 200" class="mx-auto block h-auto w-full max-w-md" aria-hidden="true">
		<rect
			x="14"
			y="20"
			width="138"
			height="100"
			rx="2"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="1.2"
		/>
		<text
			x="22"
			y="34"
			font-family="var(--mono)"
			font-size="6.5"
			fill="var(--ink)"
			opacity="0.55"
			letter-spacing="0.5">TYPE / DISPLAY</text
		>
		<text
			x="22"
			y="72"
			font-family="var(--sans)"
			font-size="34"
			font-weight="700"
			fill="var(--ink)"
			letter-spacing="-0.04em">Aa</text
		>
		<line
			x1="62"
			y1="40"
			x2="62"
			y2="78"
			stroke="var(--ink)"
			stroke-width="0.5"
			opacity="0.35"
			stroke-dasharray="2 2"
		/>
		<line x1="62" y1="40" x2="68" y2="40" stroke="var(--ink)" stroke-width="0.6" opacity="0.5" />
		<line x1="62" y1="78" x2="68" y2="78" stroke="var(--ink)" stroke-width="0.6" opacity="0.5" />
		<text x="72" y="44" font-family="var(--mono)" font-size="6" fill="var(--ink)" opacity="0.55"
			>cap</text
		>
		<text x="72" y="80" font-family="var(--mono)" font-size="6" fill="var(--ink)" opacity="0.55"
			>base</text
		>
		<text
			x="22"
			y="98"
			font-family="var(--mono)"
			font-size="6.5"
			fill="var(--ink)"
			opacity="0.55"
			letter-spacing="0.5">MONO / META</text
		>
		<text
			x="22"
			y="112"
			font-family="var(--mono)"
			font-size="10"
			font-weight="600"
			fill="var(--ink)"
			letter-spacing="0.04em">brand.voice</text
		>

		<g transform="translate(160 20)">
			<text
				x="0"
				y="-2"
				font-family="var(--mono)"
				font-size="6.5"
				fill="var(--ink)"
				opacity="0.55"
				letter-spacing="0.5">PALETTE</text
			>
			{#each [{ c: 'var(--ink)', label: 'ink' }, { c: 'var(--yellow)', label: 'accent' }, { c: 'var(--paper-2)', label: 'paper' }, { c: 'var(--teal)', label: 'teal' }] as s, i (s.label)}
				<g transform="translate(0 {i * 22})">
					<rect
						x="0"
						y="0"
						width="22"
						height="18"
						rx="2"
						fill={s.c}
						stroke="var(--ink)"
						stroke-width="1"
					/>
					<text
						x="28"
						y="7"
						font-family="var(--mono)"
						font-size="6"
						fill="var(--ink)"
						font-weight="700"
						letter-spacing="0.3">{s.label}</text
					>
					<text
						x="28"
						y="15"
						font-family="var(--mono)"
						font-size="5.5"
						fill="var(--ink)"
						opacity="0.55">#01</text
					>
				</g>
			{/each}
		</g>

		<g transform="translate(14 132)">
			<rect
				x="0"
				y="0"
				width="212"
				height="50"
				rx="2"
				fill="var(--ink)"
				stroke="var(--ink)"
				stroke-width="1.2"
			/>
			<g transform="translate(14 14)">
				<rect
					x="0"
					y="0"
					width="22"
					height="22"
					rx="1"
					fill="var(--yellow)"
					stroke="var(--paper)"
					stroke-width="0.9"
				/>
				<path
					d="M 4 16 L 4 6 L 12 6 L 12 11 L 4 11 M 12 11 L 18 16"
					stroke="var(--ink)"
					stroke-width="1.6"
					fill="none"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</g>
			<text
				x="46"
				y="32"
				font-family="var(--sans)"
				font-size="18"
				font-weight="700"
				fill="var(--paper)"
				letter-spacing="-0.02em">brand</text
			>
			<text
				x="100"
				y="32"
				font-family="var(--mono)"
				font-size="9"
				fill="var(--yellow)"
				font-weight="700"
				letter-spacing="0.3">/mark</text
			>
			<line
				x1="160"
				y1="10"
				x2="200"
				y2="10"
				stroke="var(--paper)"
				stroke-width="0.6"
				opacity="0.4"
				stroke-dasharray="2 2"
			/>
			<line
				x1="160"
				y1="40"
				x2="200"
				y2="40"
				stroke="var(--paper)"
				stroke-width="0.6"
				opacity="0.4"
				stroke-dasharray="2 2"
			/>
			<text
				x="200"
				y="44"
				text-anchor="end"
				font-family="var(--mono)"
				font-size="6"
				fill="var(--paper)"
				opacity="0.6">v1.0</text
			>
		</g>
	</svg>
{:else if pillarId === 'brand-system'}
	<svg viewBox="0 0 240 200" class="mx-auto block h-auto w-full max-w-md" aria-hidden="true">
		<defs>
			<marker id="bds-arr" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
				<path
					d="M0,1 L6,4 L0,7"
					fill="none"
					stroke="var(--ink)"
					stroke-width="1"
					stroke-linecap="round"
					opacity="0.6"
				/>
			</marker>
		</defs>

		<text
			x="14"
			y="14"
			font-family="var(--mono)"
			font-size="6.5"
			fill="var(--ink)"
			opacity="0.55"
			letter-spacing="0.6">TOKENS</text
		>

		<rect
			x="14"
			y="22"
			width="74"
			height="22"
			rx="2"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="1"
		/>
		<circle cx="24" cy="33" r="5" fill="var(--yellow)" stroke="var(--ink)" stroke-width="0.9" />
		<text
			x="34"
			y="32"
			font-family="var(--mono)"
			font-size="6.5"
			fill="var(--ink)"
			font-weight="700">color.brand</text
		>
		<text x="34" y="40" font-family="var(--mono)" font-size="5.5" fill="var(--ink)" opacity="0.55"
			>#b8821a</text
		>

		<rect
			x="14"
			y="48"
			width="74"
			height="22"
			rx="2"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="1"
		/>
		<text
			x="20"
			y="63"
			font-family="var(--sans)"
			font-size="11"
			font-weight="700"
			fill="var(--ink)"
			letter-spacing="-0.03em">Ag</text
		>
		<text
			x="34"
			y="58"
			font-family="var(--mono)"
			font-size="6.5"
			fill="var(--ink)"
			font-weight="700">type.body</text
		>
		<text x="34" y="66" font-family="var(--mono)" font-size="5.5" fill="var(--ink)" opacity="0.55"
			>14/20 0.01</text
		>

		<rect
			x="14"
			y="74"
			width="74"
			height="22"
			rx="2"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="1"
		/>
		<g transform="translate(20 84)">
			<line x1="0" y1="0" x2="2" y2="0" stroke="var(--ink)" stroke-width="1.4" />
			<line x1="6" y1="0" x2="10" y2="0" stroke="var(--ink)" stroke-width="1.4" />
			<line x1="14" y1="0" x2="22" y2="0" stroke="var(--ink)" stroke-width="1.4" />
		</g>
		<text
			x="34"
			y="84"
			font-family="var(--mono)"
			font-size="6.5"
			fill="var(--ink)"
			font-weight="700">space.4</text
		>
		<text x="34" y="92" font-family="var(--mono)" font-size="5.5" fill="var(--ink)" opacity="0.55"
			>16px</text
		>

		<rect
			x="14"
			y="100"
			width="74"
			height="22"
			rx="2"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="1"
		/>
		<rect
			x="20"
			y="106"
			width="10"
			height="10"
			rx="3"
			fill="none"
			stroke="var(--ink)"
			stroke-width="1.2"
		/>
		<text
			x="34"
			y="113"
			font-family="var(--mono)"
			font-size="6.5"
			fill="var(--ink)"
			font-weight="700">radius.md</text
		>
		<text x="34" y="120" font-family="var(--mono)" font-size="5.5" fill="var(--ink)" opacity="0.55"
			>6px</text
		>

		{#each [33, 59, 85, 111] as y (y)}
			<line
				x1="90"
				y1={y}
				x2="116"
				y2={y}
				stroke="var(--ink)"
				stroke-width="0.9"
				stroke-dasharray="3 2"
				marker-end="url(#bds-arr)"
				opacity="0.55"
			/>
		{/each}

		<text
			x="120"
			y="14"
			font-family="var(--mono)"
			font-size="6.5"
			fill="var(--ink)"
			opacity="0.55"
			letter-spacing="0.6">COMPONENTS</text
		>

		<g transform="translate(120 22)">
			<rect
				x="0"
				y="0"
				width="44"
				height="20"
				rx="10"
				fill="var(--yellow)"
				stroke="var(--ink)"
				stroke-width="1"
			/>
			<text
				x="22"
				y="13"
				text-anchor="middle"
				font-family="var(--mono)"
				font-size="7"
				font-weight="700"
				fill="var(--ink)">badge</text
			>
		</g>
		<g transform="translate(120 48)">
			<rect
				x="0"
				y="0"
				width="106"
				height="22"
				rx="2"
				fill="var(--paper)"
				stroke="var(--ink)"
				stroke-width="1"
			/>
			<line x1="8" y1="11" x2="8" y2="17" stroke="var(--ink)" stroke-width="1" opacity="0.7" />
			<text x="14" y="14" font-family="var(--mono)" font-size="6.5" fill="var(--ink)" opacity="0.5"
				>field</text
			>
		</g>
		<g transform="translate(120 74)">
			<rect
				x="0"
				y="0"
				width="106"
				height="22"
				rx="2"
				fill="var(--paper)"
				stroke="var(--ink)"
				stroke-width="1"
			/>
			<rect
				x="6"
				y="6"
				width="10"
				height="10"
				rx="2"
				fill="var(--yellow)"
				stroke="var(--ink)"
				stroke-width="0.7"
			/>
			<line x1="20" y1="9" x2="64" y2="9" stroke="var(--ink)" stroke-width="0.8" opacity="0.7" />
			<line x1="20" y1="14" x2="48" y2="14" stroke="var(--ink)" stroke-width="0.7" opacity="0.4" />
			<text
				x="100"
				y="17"
				text-anchor="end"
				font-family="var(--mono)"
				font-size="5.5"
				fill="var(--ink)"
				font-weight="700"
				opacity="0.75">card</text
			>
		</g>
		<g transform="translate(120 100)">
			<rect
				x="0"
				y="0"
				width="62"
				height="22"
				rx="3"
				fill="var(--ink)"
				stroke="var(--yellow)"
				stroke-width="1.2"
			/>
			<text
				x="31"
				y="14"
				text-anchor="middle"
				font-family="var(--mono)"
				font-size="7"
				font-weight="700"
				fill="var(--paper)"
				letter-spacing="0.5">button</text
			>
		</g>

		<text
			x="14"
			y="142"
			font-family="var(--mono)"
			font-size="6.5"
			fill="var(--ink)"
			opacity="0.55"
			letter-spacing="0.5">COVERAGE</text
		>
		<rect
			x="14"
			y="146"
			width="212"
			height="8"
			rx="1"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="0.8"
		/>
		<rect x="14" y="146" width="188" height="8" rx="1" fill="var(--yellow)" />
		<text
			x="222"
			y="153"
			text-anchor="end"
			font-family="var(--mono)"
			font-size="6.5"
			fill="var(--ink)">89%</text
		>

		<text
			x="14"
			y="161"
			font-family="var(--mono)"
			font-size="5.5"
			fill="var(--ink)"
			opacity="0.4"
			letter-spacing="0.2">figma-to-code parity · status: nominal</text
		>
		<g transform="translate(14 166)">
			<rect x="0" y="0" width="212" height="22" rx="2" fill="var(--ink)" />
			<text
				x="8"
				y="14"
				font-family="var(--mono)"
				font-size="7"
				fill="var(--teal)"
				font-weight="700">$</text
			>
			<text x="18" y="14" font-family="var(--mono)" font-size="7" fill="var(--paper)">npm i </text>
			<text
				x="48"
				y="14"
				font-family="var(--mono)"
				font-size="7"
				fill="var(--yellow)"
				font-weight="700">@brand/ui</text
			>
			<text
				x="200"
				y="14"
				text-anchor="end"
				font-family="var(--mono)"
				font-size="7"
				fill="var(--paper)"
				opacity="0.6">v1.4.0</text
			>
		</g>
	</svg>
{:else if pillarId === 'brand-ia'}
	<svg viewBox="0 0 240 184" class="mx-auto block h-auto w-full max-w-md" aria-hidden="true">
		<text
			x="14"
			y="14"
			font-family="var(--mono)"
			font-size="6.5"
			fill="var(--ink)"
			opacity="0.55"
			letter-spacing="0.6">SITEMAP / WAYFINDING</text
		>

		<rect
			x="92"
			y="22"
			width="56"
			height="22"
			rx="2"
			fill="var(--yellow)"
			stroke="var(--ink)"
			stroke-width="1.4"
		/>
		<text
			x="120"
			y="36"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="8"
			font-weight="700"
			fill="var(--ink)"
			letter-spacing="0.4">/home</text
		>

		<line x1="120" y1="44" x2="120" y2="64" stroke="var(--ink)" stroke-width="0.9" opacity="0.55" />
		<line x1="36" y1="64" x2="204" y2="64" stroke="var(--ink)" stroke-width="0.9" opacity="0.3" />
		<line x1="36" y1="64" x2="36" y2="82" stroke="var(--ink)" stroke-width="0.9" opacity="0.3" />
		<line x1="92" y1="64" x2="92" y2="82" stroke="var(--ink)" stroke-width="0.9" opacity="0.55" />
		<line x1="148" y1="64" x2="148" y2="82" stroke="var(--ink)" stroke-width="0.9" opacity="0.3" />
		<line x1="204" y1="64" x2="204" y2="82" stroke="var(--ink)" stroke-width="0.9" opacity="0.3" />

		{#each [{ x: 12, label: 'work', hot: false }, { x: 68, label: 'services', hot: true }, { x: 124, label: 'story', hot: false }, { x: 180, label: 'contact', hot: false }] as node (node.label)}
			<g>
				<rect
					x={node.x}
					y="82"
					width="48"
					height="20"
					rx="2"
					fill={node.hot ? 'var(--pale-fire-25)' : 'var(--paper)'}
					stroke="var(--ink)"
					stroke-width={node.hot ? 1.3 : 1}
				/>
				<text
					x={node.x + 24}
					y="95"
					text-anchor="middle"
					font-family="var(--mono)"
					font-size="7"
					font-weight={node.hot ? 700 : 500}
					fill="var(--ink)">{node.label}</text
				>
			</g>
		{/each}

		<line x1="92" y1="102" x2="92" y2="116" stroke="var(--yellow)" stroke-width="2" />
		<line x1="48" y1="116" x2="148" y2="116" stroke="var(--yellow)" stroke-width="2" />
		{#each [48, 92, 148] as x (x)}
			<line x1={x} y1="116" x2={x} y2="130" stroke="var(--yellow)" stroke-width="2" />
		{/each}

		{#each [{ x: 26, label: 'brand-strat', hot: true }, { x: 70, label: 'stack', hot: false }, { x: 126, label: 'agents', hot: false }] as node (node.label)}
			<g>
				<rect
					x={node.x}
					y="130"
					width="44"
					height="18"
					rx="2"
					fill={node.hot ? 'var(--yellow)' : 'var(--paper)'}
					stroke="var(--ink)"
					stroke-width={node.hot ? 1.3 : 1}
				/>
				<text
					x={node.x + 22}
					y="142"
					text-anchor="middle"
					font-family="var(--mono)"
					font-size="6"
					font-weight={node.hot ? 700 : 500}
					fill="var(--ink)">{node.label}</text
				>
			</g>
		{/each}

		<g transform="translate(14 158)">
			<rect
				x="0"
				y="0"
				width="212"
				height="18"
				rx="2"
				fill="var(--paper)"
				stroke="var(--ink)"
				stroke-width="0.9"
			/>
			<text x="8" y="12" font-family="var(--mono)" font-size="7" fill="var(--ink)" opacity="0.55"
				>path:</text
			>
			<text
				x="30"
				y="12"
				font-family="var(--mono)"
				font-size="7"
				font-weight="600"
				fill="var(--ink)">/</text
			>
			<text x="36" y="12" font-family="var(--mono)" font-size="7" fill="var(--ink)">home</text>
			<text x="62" y="12" font-family="var(--mono)" font-size="7" fill="var(--ink)" opacity="0.5"
				>›</text
			>
			<text x="70" y="12" font-family="var(--mono)" font-size="7" fill="var(--ink)">services</text>
			<text x="108" y="12" font-family="var(--mono)" font-size="7" fill="var(--ink)" opacity="0.5"
				>›</text
			>
			<text
				x="116"
				y="12"
				font-family="var(--mono)"
				font-size="6"
				font-weight="700"
				fill="var(--ink)">brand-strat</text
			>
			<rect
				x="158"
				y="3"
				width="48"
				height="12"
				rx="6"
				fill="var(--yellow)"
				stroke="var(--ink)"
				stroke-width="0.7"
			/>
			<text
				x="182"
				y="12"
				text-anchor="middle"
				font-family="var(--mono)"
				font-size="6"
				font-weight="700"
				fill="var(--ink)"
				letter-spacing="0.3">2 clicks</text
			>
		</g>
	</svg>
{:else if pillarId === 'brand-ux'}
	<svg viewBox="0 0 240 200" class="mx-auto block h-auto w-full max-w-md" aria-hidden="true">
		<defs>
			<marker id="bux-arr" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
				<path
					d="M0,1 L6,4 L0,7"
					fill="none"
					stroke="var(--yellow)"
					stroke-width="1.4"
					stroke-linecap="round"
				/>
			</marker>
		</defs>

		<text
			x="14"
			y="14"
			font-family="var(--mono)"
			font-size="6.5"
			fill="var(--ink)"
			opacity="0.55"
			letter-spacing="0.6">FLOW · TOUCHPOINTS</text
		>

		<circle cx="22" cy="60" r="6" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.2" />
		<circle cx="22" cy="60" r="2" fill="var(--ink)" />
		<text
			x="22"
			y="80"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="6.5"
			fill="var(--ink)"
			opacity="0.65">user</text
		>

		<line
			x1="30"
			y1="60"
			x2="50"
			y2="60"
			stroke="var(--yellow)"
			stroke-width="1.4"
			marker-end="url(#bux-arr)"
		/>

		<g transform="translate(50 28)">
			<rect
				x="0"
				y="0"
				width="50"
				height="64"
				rx="3"
				fill="var(--paper)"
				stroke="var(--ink)"
				stroke-width="1.2"
			/>
			<rect
				x="4"
				y="4"
				width="42"
				height="10"
				rx="1"
				fill="var(--yellow)"
				opacity="0.3"
				stroke="var(--ink)"
				stroke-width="0.6"
			/>
			<line x1="4" y1="20" x2="42" y2="20" stroke="var(--ink)" stroke-width="0.6" opacity="0.45" />
			<line x1="4" y1="26" x2="34" y2="26" stroke="var(--ink)" stroke-width="0.6" opacity="0.45" />
			<rect x="4" y="34" width="20" height="8" rx="4" fill="var(--ink)" />
			<text
				x="25"
				y="60"
				text-anchor="middle"
				font-family="var(--mono)"
				font-size="6"
				fill="var(--ink)"
				opacity="0.65">land</text
			>
		</g>

		<line
			x1="100"
			y1="60"
			x2="120"
			y2="60"
			stroke="var(--yellow)"
			stroke-width="1.4"
			marker-end="url(#bux-arr)"
		/>

		<g transform="translate(120 28)">
			<rect
				x="0"
				y="0"
				width="50"
				height="64"
				rx="3"
				fill="var(--paper)"
				stroke="var(--ink)"
				stroke-width="1.2"
			/>
			<rect
				x="4"
				y="4"
				width="20"
				height="20"
				rx="1"
				fill="var(--yellow)"
				opacity="0.3"
				stroke="var(--ink)"
				stroke-width="0.6"
			/>
			<rect
				x="26"
				y="4"
				width="20"
				height="20"
				rx="1"
				fill="var(--paper)"
				stroke="var(--ink)"
				stroke-width="0.6"
			/>
			<rect
				x="4"
				y="26"
				width="20"
				height="20"
				rx="1"
				fill="var(--paper)"
				stroke="var(--ink)"
				stroke-width="0.6"
			/>
			<rect
				x="26"
				y="26"
				width="20"
				height="20"
				rx="1"
				fill="var(--paper)"
				stroke="var(--ink)"
				stroke-width="0.6"
			/>
			<line x1="4" y1="52" x2="34" y2="52" stroke="var(--ink)" stroke-width="0.6" opacity="0.45" />
			<text
				x="25"
				y="60"
				text-anchor="middle"
				font-family="var(--mono)"
				font-size="6"
				fill="var(--ink)"
				opacity="0.65">explore</text
			>
		</g>

		<line
			x1="170"
			y1="60"
			x2="190"
			y2="60"
			stroke="var(--yellow)"
			stroke-width="1.4"
			marker-end="url(#bux-arr)"
		/>

		<g transform="translate(190 28)">
			<rect
				x="0"
				y="0"
				width="36"
				height="64"
				rx="3"
				fill="var(--paper)"
				stroke="var(--ink)"
				stroke-width="1.2"
			/>
			<rect
				x="4"
				y="4"
				width="28"
				height="10"
				rx="1"
				fill="var(--yellow)"
				opacity="0.3"
				stroke="var(--ink)"
				stroke-width="0.6"
			/>
			<line x1="4" y1="20" x2="28" y2="20" stroke="var(--ink)" stroke-width="0.6" opacity="0.45" />
			<line x1="4" y1="26" x2="22" y2="26" stroke="var(--ink)" stroke-width="0.6" opacity="0.45" />
			<rect
				x="2"
				y="32"
				width="32"
				height="18"
				rx="2"
				fill="var(--yellow)"
				stroke="var(--ink)"
				stroke-width="1.2"
			/>
			<path
				d="M 11 41 L 15 45 L 23 37"
				stroke="var(--ink)"
				stroke-width="1.6"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<text
				x="18"
				y="60"
				text-anchor="middle"
				font-family="var(--mono)"
				font-size="6"
				fill="var(--ink)"
				opacity="0.65">convert</text
			>
		</g>

		<line
			x1="75"
			y1="92"
			x2="75"
			y2="108"
			stroke="var(--ink)"
			stroke-width="0.6"
			opacity="0.5"
			stroke-dasharray="2 2"
		/>
		<rect
			x="46"
			y="108"
			width="58"
			height="14"
			rx="2"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="0.9"
		/>
		<text
			x="75"
			y="118"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="6.5"
			font-weight="700"
			fill="var(--ink)"
			letter-spacing="0.3">hover</text
		>

		<line
			x1="145"
			y1="92"
			x2="145"
			y2="108"
			stroke="var(--ink)"
			stroke-width="0.6"
			opacity="0.5"
			stroke-dasharray="2 2"
		/>
		<rect
			x="116"
			y="108"
			width="58"
			height="14"
			rx="2"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="0.9"
		/>
		<text
			x="145"
			y="118"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="6.5"
			font-weight="700"
			fill="var(--ink)"
			letter-spacing="0.3">focus / a11y</text
		>

		<line
			x1="208"
			y1="92"
			x2="208"
			y2="108"
			stroke="var(--ink)"
			stroke-width="0.6"
			opacity="0.5"
			stroke-dasharray="2 2"
		/>
		<rect
			x="184"
			y="108"
			width="48"
			height="14"
			rx="2"
			fill="var(--yellow)"
			stroke="var(--ink)"
			stroke-width="0.9"
		/>
		<text
			x="208"
			y="118"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="6.5"
			font-weight="700"
			fill="var(--ink)"
			letter-spacing="0.3">tap · ship</text
		>

		<text
			x="14"
			y="142"
			font-family="var(--mono)"
			font-size="6.5"
			fill="var(--ink)"
			opacity="0.55"
			letter-spacing="0.5">FRICTION</text
		>
		<text
			x="222"
			y="142"
			text-anchor="end"
			font-family="var(--mono)"
			font-size="5.5"
			fill="var(--ink)"
			opacity="0.55"
			letter-spacing="0.3">low · [0.12s latency]</text
		>
		<rect
			x="14"
			y="146"
			width="212"
			height="7"
			rx="1"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="0.8"
		/>
		<rect x="14" y="146" width="18" height="7" rx="1" fill="var(--ink)" opacity="0.8" />

		<text
			x="14"
			y="161"
			font-family="var(--mono)"
			font-size="6.5"
			fill="var(--ink)"
			opacity="0.55"
			letter-spacing="0.5">DELIGHT</text
		>
		<text
			x="222"
			y="161"
			text-anchor="end"
			font-family="var(--mono)"
			font-size="5.5"
			fill="var(--ink)"
			opacity="0.55"
			letter-spacing="0.3">high · [99.2% success]</text
		>
		<rect
			x="14"
			y="165"
			width="212"
			height="7"
			rx="1"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="0.8"
		/>
		<rect x="14" y="165" width="196" height="7" rx="1" fill="var(--yellow)" />
	</svg>
{:else}
	<div class="aspect-6/5 w-full bg-ink"></div>
{/if}
