<script lang="ts">
	interface Props {
		pillarId: string | undefined;
	}

	let { pillarId }: Props = $props();
</script>

{#if pillarId === 'ai'}
	<svg viewBox="0 0 240 200" class="mx-auto block h-auto w-full max-w-md" aria-hidden="true">
		<defs>
			<pattern id="pi-grid-int-ai" width="16" height="16" patternUnits="userSpaceOnUse">
				<path
					d="M 16 0 L 0 0 0 16"
					fill="none"
					stroke="rgba(26,26,26,0.35)"
					stroke-width="0.4"
					opacity="0.5"
				/>
			</pattern>
		</defs>
		<rect width="240" height="200" fill="url(#pi-grid-int-ai)" />

		<line x1="20" y1="50" x2="20" y2="172" stroke="var(--ink)" stroke-width="0.8" opacity="0.4" />
		<line x1="20" y1="172" x2="220" y2="172" stroke="var(--ink)" stroke-width="0.8" opacity="0.4" />
		<text
			x="14"
			y="44"
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
			letter-spacing="0.5">INTEGRATION</text
		>

		<text
			x="55"
			y="184"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="6.5"
			fill="var(--ink)"
			opacity="0.6"
			letter-spacing="0.3">EXISTING STACK</text
		>
		<text
			x="125"
			y="184"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="6.5"
			fill="var(--ink)"
			opacity="0.6"
			letter-spacing="0.3">ENTRY POINT</text
		>
		<text
			x="195"
			y="184"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="6.5"
			fill="var(--ink)"
			opacity="0.6"
			letter-spacing="0.3">AUTOMATION</text
		>

		<rect
			x="30"
			y="58"
			width="110"
			height="102"
			fill="none"
			stroke="var(--ink)"
			stroke-width="0.8"
			stroke-dasharray="4 3"
			opacity="0.45"
			rx="2"
		/>
		<path
			d="M 30 66 L 30 58 L 38 58"
			stroke="var(--ink)"
			stroke-width="1.3"
			fill="none"
			opacity="0.75"
		/>
		<path
			d="M 132 58 L 140 58 L 140 66"
			stroke="var(--ink)"
			stroke-width="1.3"
			fill="none"
			opacity="0.75"
		/>
		<path
			d="M 30 152 L 30 160 L 38 160"
			stroke="var(--ink)"
			stroke-width="1.3"
			fill="none"
			opacity="0.75"
		/>
		<path
			d="M 132 160 L 140 160 L 140 152"
			stroke="var(--ink)"
			stroke-width="1.3"
			fill="none"
			opacity="0.75"
		/>
		<text
			x="34"
			y="68"
			font-family="var(--mono)"
			font-size="6"
			fill="var(--ink)"
			opacity="0.65"
			letter-spacing="0.5">AUDIT</text
		>

		<g stroke="var(--ink)" stroke-width="0.7" opacity="0.3" fill="none">
			{#each [78, 110, 142] as y1 (y1)}
				{#each [86, 118, 150] as y2 (y2)}
					<line x1="55" {y1} x2="115" {y2} />
				{/each}
			{/each}
		</g>

		{#each [78, 110, 142] as ny (ny)}
			<circle cx="55" cy={ny} r="4" fill="var(--paper)" stroke="var(--ink)" stroke-width="1" />
		{/each}
		{#each [86, 150] as my (my)}
			<circle cx="115" cy={my} r="4" fill="var(--paper)" stroke="var(--ink)" stroke-width="1" />
		{/each}

		<circle
			cx="115"
			cy="118"
			r="7.5"
			fill="var(--paper)"
			stroke="var(--yellow)"
			stroke-width="2.4"
		/>
		<circle cx="115" cy="118" r="3" fill="var(--yellow)" />

		<rect
			x="84"
			y="20"
			width="62"
			height="22"
			rx="2"
			fill="var(--yellow)"
			stroke="var(--ink)"
			stroke-width="1.4"
		/>
		<text
			x="115"
			y="34"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="8.5"
			font-weight="700"
			fill="var(--ink)"
			letter-spacing="0.6">AI CORE</text
		>

		<line x1="115" y1="42" x2="115" y2="110.5" stroke="var(--yellow)" stroke-width="2.6" />

		<line
			x1="122.5"
			y1="118"
			x2="170"
			y2="118"
			stroke="var(--yellow)"
			stroke-width="1.4"
			stroke-dasharray="3 2"
		/>

		<rect
			x="170"
			y="108"
			width="44"
			height="20"
			rx="2"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="1.2"
		/>
		<text
			x="192"
			y="122"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="8"
			font-weight="700"
			fill="var(--ink)"
			letter-spacing="0.6">LEARN</text
		>
	</svg>
{:else if pillarId === 'ml'}
	<svg viewBox="0 0 240 200" class="mx-auto block h-auto w-full max-w-md" aria-hidden="true">
		<defs>
			<pattern id="pi-grid-int-ml" width="16" height="16" patternUnits="userSpaceOnUse">
				<path
					d="M 16 0 L 0 0 0 16"
					fill="none"
					stroke="rgba(26,26,26,0.35)"
					stroke-width="0.4"
					opacity="0.5"
				/>
			</pattern>
		</defs>
		<rect width="240" height="200" fill="url(#pi-grid-int-ml)" />

		<line x1="24" y1="24" x2="24" y2="166" stroke="var(--ink)" stroke-width="0.9" opacity="0.55" />
		<line
			x1="24"
			y1="166"
			x2="216"
			y2="166"
			stroke="var(--ink)"
			stroke-width="0.9"
			opacity="0.55"
		/>
		<text
			x="18"
			y="18"
			font-family="var(--mono)"
			font-size="7"
			fill="var(--ink)"
			opacity="0.55"
			letter-spacing="0.5">[feat_02]</text
		>
		<text
			x="216"
			y="180"
			text-anchor="end"
			font-family="var(--mono)"
			font-size="7"
			fill="var(--ink)"
			opacity="0.55"
			letter-spacing="0.5">[feat_01]</text
		>

		<path
			d="M 30 50 C 90 60, 150 140, 210 150"
			stroke="var(--yellow)"
			stroke-width="1.8"
			fill="none"
		/>
		<text
			x="110"
			y="88"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="7"
			font-weight="700"
			fill="var(--ink)"
			letter-spacing="0.4">f(x)</text
		>

		{#each [{ x: 108, y: 148 }, { x: 124, y: 158 }, { x: 146, y: 152 }, { x: 162, y: 144 }, { x: 180, y: 158 }, { x: 196, y: 152 }, { x: 210, y: 158 }, { x: 200, y: 140 }, { x: 175, y: 144 }, { x: 188, y: 152 }] as p (`a-${p.x}-${p.y}`)}
			<circle cx={p.x} cy={p.y} r="3" fill="var(--paper)" stroke="var(--ink)" stroke-width="1" />
		{/each}

		{#each [{ x: 36, y: 36 }, { x: 50, y: 44 }, { x: 64, y: 38 }, { x: 78, y: 50 }, { x: 44, y: 56 }, { x: 58, y: 58 }, { x: 72, y: 62 }, { x: 88, y: 56 }, { x: 92, y: 70 }, { x: 104, y: 76 }] as p (`b-${p.x}-${p.y}`)}
			<rect
				x={p.x - 3}
				y={p.y - 3}
				width="6"
				height="6"
				fill="var(--yellow)"
				stroke="var(--ink)"
				stroke-width="1"
			/>
		{/each}

		<circle cx="155" cy="122" r="5.5" fill="none" stroke="var(--ink)" stroke-width="1.1" />
		<line
			x1="155"
			y1="117"
			x2="155"
			y2="106"
			stroke="var(--ink)"
			stroke-width="0.8"
			opacity="0.6"
		/>
		<text
			x="155"
			y="101"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="6.5"
			fill="var(--ink)"
			opacity="0.6">edge case</text
		>

		<g transform="translate(14 178)">
			<rect
				x="0"
				y="0"
				width="9"
				height="9"
				rx="1"
				fill="var(--yellow)"
				stroke="var(--ink)"
				stroke-width="0.7"
			/>
			<path
				d="M 1.5 4.5 L 3.5 6.5 L 7.5 2.5"
				stroke="var(--ink)"
				stroke-width="1.1"
				fill="none"
				stroke-linecap="round"
			/>
			<text x="12" y="8" font-family="var(--mono)" font-size="6.5" fill="var(--ink)"
				>trained · accuracy 0.94 · n=2.4k</text
			>
		</g>

		<g transform="translate(178 22)">
			<rect
				x="0"
				y="0"
				width="48"
				height="22"
				fill="var(--paper)"
				stroke="var(--ink)"
				stroke-width="0.8"
				rx="2"
			/>
			<circle cx="6" cy="7" r="2.5" fill="var(--paper)" stroke="var(--ink)" stroke-width="0.8" />
			<text x="12" y="9.5" font-family="var(--mono)" font-size="6.5" fill="var(--ink)">class A</text
			>
			<rect
				x="3.5"
				y="14"
				width="5"
				height="5"
				fill="var(--yellow)"
				stroke="var(--ink)"
				stroke-width="0.7"
			/>
			<text x="12" y="18.5" font-family="var(--mono)" font-size="6.5" fill="var(--ink)"
				>class B</text
			>
		</g>
	</svg>
{:else if pillarId === 'agent'}
	<svg viewBox="0 0 240 200" class="mx-auto block h-auto w-full max-w-md" aria-hidden="true">
		<defs>
			<pattern id="pi-grid-int-agt" width="16" height="16" patternUnits="userSpaceOnUse">
				<path
					d="M 16 0 L 0 0 0 16"
					fill="none"
					stroke="rgba(26,26,26,0.35)"
					stroke-width="0.4"
					opacity="0.5"
				/>
			</pattern>
			<marker id="int-agt-arr" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
				<path
					d="M0,1 L5,3.5 L0,6"
					fill="none"
					stroke="var(--yellow)"
					stroke-width="1.2"
					stroke-linecap="round"
				/>
			</marker>
			<marker id="int-agt-arr-i" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
				<path
					d="M0,1 L5,3.5 L0,6"
					fill="none"
					stroke="var(--ink)"
					stroke-width="1"
					stroke-linecap="round"
					opacity="0.7"
				/>
			</marker>
		</defs>
		<rect width="240" height="200" fill="url(#pi-grid-int-agt)" />
		<text
			x="14"
			y="14"
			font-family="var(--mono)"
			font-size="7"
			fill="var(--ink)"
			opacity="0.55"
			letter-spacing="0.5">AGENT LOOP</text
		>
		<text
			x="226"
			y="14"
			text-anchor="end"
			font-family="var(--mono)"
			font-size="7"
			fill="var(--ink)"
			opacity="0.55"
			letter-spacing="0.5">step 04 / n</text
		>

		<rect
			x="84"
			y="32"
			width="72"
			height="26"
			rx="2"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="1.1"
		/>
		<text
			x="120"
			y="49"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="9"
			font-weight="600"
			fill="var(--ink)">OBSERVE</text
		>

		<rect
			x="156"
			y="96"
			width="72"
			height="26"
			rx="2"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="1.1"
		/>
		<text
			x="192"
			y="113"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="9"
			font-weight="600"
			fill="var(--ink)">REASON</text
		>

		<rect
			x="84"
			y="142"
			width="72"
			height="26"
			rx="2"
			fill="var(--yellow)"
			stroke="var(--ink)"
			stroke-width="1.5"
		/>
		<text
			x="120"
			y="159"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="9"
			font-weight="700"
			fill="var(--ink)">ACT</text
		>

		<path
			d="M 156 50 C 188 56, 220 76, 192 96"
			stroke="var(--yellow)"
			stroke-width="1.4"
			fill="none"
			marker-end="url(#int-agt-arr)"
		/>
		<path
			d="M 192 122 C 220 134, 188 150, 156 156"
			stroke="var(--yellow)"
			stroke-width="1.4"
			fill="none"
			marker-end="url(#int-agt-arr)"
		/>

		<path
			d="M 84 158 C 70 158, 60 142, 60 128"
			stroke="var(--yellow)"
			stroke-width="1.4"
			fill="none"
			marker-end="url(#int-agt-arr)"
		/>
		<path
			d="M 60 70 C 60 56, 70 46, 84 46"
			stroke="var(--yellow)"
			stroke-width="1.4"
			fill="none"
			marker-end="url(#int-agt-arr)"
		/>

		<g>
			<text
				x="37"
				y="68"
				text-anchor="middle"
				font-family="var(--mono)"
				font-size="6.5"
				fill="var(--ink)"
				opacity="0.65"
				letter-spacing="0.4">TOOLS</text
			>
			<rect
				x="14"
				y="74"
				width="46"
				height="14"
				rx="2"
				fill="var(--paper)"
				stroke="var(--ink)"
				stroke-width="1"
			/>
			<text
				x="37"
				y="84"
				text-anchor="middle"
				font-family="var(--mono)"
				font-size="7"
				fill="var(--ink)">api.get</text
			>
			<rect
				x="14"
				y="92"
				width="46"
				height="14"
				rx="2"
				fill="var(--paper)"
				stroke="var(--ink)"
				stroke-width="1"
			/>
			<text
				x="37"
				y="102"
				text-anchor="middle"
				font-family="var(--mono)"
				font-size="7"
				fill="var(--ink)">db.query</text
			>
			<rect
				x="14"
				y="110"
				width="46"
				height="14"
				rx="2"
				fill="var(--paper)"
				stroke="var(--ink)"
				stroke-width="1"
			/>
			<text
				x="37"
				y="120"
				text-anchor="middle"
				font-family="var(--mono)"
				font-size="7"
				fill="var(--ink)">tool.call</text
			>
		</g>

		<path
			d="M 210 122 C 222 132, 218 144, 200 148"
			stroke="var(--ink)"
			stroke-width="0.9"
			stroke-dasharray="3 2"
			fill="none"
			opacity="0.7"
			marker-end="url(#int-agt-arr-i)"
		/>
		<rect
			x="170"
			y="150"
			width="58"
			height="16"
			rx="2"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="0.9"
			stroke-dasharray="2 2"
			opacity="0.85"
		/>
		<text
			x="199"
			y="161"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="7"
			fill="var(--ink)"
			opacity="0.85">graceful_exit</text
		>

		<g transform="translate(14 180)">
			<rect
				x="0"
				y="0"
				width="9"
				height="9"
				rx="1"
				fill="var(--yellow)"
				stroke="var(--ink)"
				stroke-width="0.7"
			/>
			<path
				d="M 1.5 4.5 L 3.5 6.5 L 7.5 2.5"
				stroke="var(--ink)"
				stroke-width="1.1"
				fill="none"
				stroke-linecap="round"
			/>
			<text x="12" y="8" font-family="var(--mono)" font-size="6.5" fill="var(--ink)"
				>retries · resilient by design</text
			>
		</g>
	</svg>
{:else if pillarId === 'rag'}
	<svg viewBox="0 0 240 200" class="mx-auto block h-auto w-full max-w-md" aria-hidden="true">
		<defs>
			<pattern id="pi-grid-int-rag" width="16" height="16" patternUnits="userSpaceOnUse">
				<path
					d="M 16 0 L 0 0 0 16"
					fill="none"
					stroke="rgba(26,26,26,0.35)"
					stroke-width="0.4"
					opacity="0.5"
				/>
			</pattern>
			<marker id="int-rag-arr" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
				<path
					d="M0,1 L5,3.5 L0,6"
					fill="none"
					stroke="var(--ink)"
					stroke-width="1"
					stroke-linecap="round"
					opacity="0.7"
				/>
			</marker>
			<marker id="int-rag-arr-y" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
				<path
					d="M0,1 L5,3.5 L0,6"
					fill="none"
					stroke="var(--yellow)"
					stroke-width="1.2"
					stroke-linecap="round"
				/>
			</marker>
		</defs>
		<rect width="240" height="200" fill="url(#pi-grid-int-rag)" />
		<text
			x="14"
			y="14"
			font-family="var(--mono)"
			font-size="7"
			fill="var(--ink)"
			opacity="0.55"
			letter-spacing="0.5">QUERY</text
		>
		<text
			x="226"
			y="14"
			text-anchor="end"
			font-family="var(--mono)"
			font-size="7"
			fill="var(--ink)"
			opacity="0.55"
			letter-spacing="0.5">GROUNDED ANSWER</text
		>

		<rect
			x="12"
			y="24"
			width="44"
			height="20"
			rx="2"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="1.2"
		/>
		<text
			x="34"
			y="37"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="7.5"
			font-weight="700"
			fill="var(--ink)"
			letter-spacing="0.5">QUERY</text
		>

		<rect
			x="86"
			y="22"
			width="62"
			height="24"
			rx="2"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="1.1"
			stroke-dasharray="3 2"
		/>
		<text
			x="117"
			y="31"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="6"
			fill="var(--ink)"
			opacity="0.6"
			letter-spacing="0.5">AUGMENT</text
		>
		<text
			x="117"
			y="41"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="7"
			font-weight="700"
			fill="var(--ink)"
			letter-spacing="0.3">prompt + ctx</text
		>

		<rect
			x="180"
			y="24"
			width="48"
			height="20"
			rx="2"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="1.4"
		/>
		<text
			x="204"
			y="38"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="8"
			font-weight="700"
			fill="var(--ink)"
			letter-spacing="0.4">LLM</text
		>

		<line
			x1="56"
			y1="34"
			x2="84"
			y2="34"
			stroke="var(--yellow)"
			stroke-width="1.4"
			marker-end="url(#int-rag-arr-y)"
		/>
		<text
			x="70"
			y="30"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="5.5"
			fill="var(--ink)"
			opacity="0.65">query</text
		>

		<line
			x1="148"
			y1="34"
			x2="178"
			y2="34"
			stroke="var(--yellow)"
			stroke-width="1.4"
			marker-end="url(#int-rag-arr-y)"
		/>

		<g transform="translate(180 52)">
			<text x="0" y="7" font-family="var(--mono)" font-size="6" fill="var(--ink)" opacity="0.6"
				>cites:</text
			>
			{#each [{ x: 22, label: '[1]' }, { x: 36, label: '[2]' }] as chip (chip.label)}
				<rect
					x={chip.x}
					y="0"
					width="12"
					height="9"
					rx="1.5"
					fill="var(--yellow)"
					stroke="var(--ink)"
					stroke-width="0.7"
				/>
				<text
					x={chip.x + 6}
					y="7"
					text-anchor="middle"
					font-family="var(--mono)"
					font-size="5.5"
					font-weight="700"
					fill="var(--ink)">{chip.label}</text
				>
			{/each}
		</g>

		<line
			x1="34"
			y1="44"
			x2="34"
			y2="58"
			stroke="var(--ink)"
			stroke-width="1"
			stroke-dasharray="2 2"
			marker-end="url(#int-rag-arr)"
			opacity="0.75"
		/>

		<rect
			x="12"
			y="60"
			width="44"
			height="24"
			rx="2"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="1.1"
		/>
		<text
			x="34"
			y="70"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="5.5"
			fill="var(--ink)"
			opacity="0.6"
			letter-spacing="0.3">retrieve</text
		>
		<text
			x="34"
			y="79"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="7"
			font-weight="700"
			fill="var(--ink)"
			letter-spacing="0.3">vec_store</text
		>

		<path
			d="M 56 72 C 72 72, 78 76, 86 76"
			stroke="var(--ink)"
			stroke-width="1"
			fill="none"
			marker-end="url(#int-rag-arr)"
			opacity="0.75"
		/>

		<g>
			<rect
				x="84"
				y="60"
				width="40"
				height="36"
				rx="1"
				fill="var(--paper)"
				stroke="var(--ink)"
				stroke-width="0.9"
			/>
			<rect
				x="88"
				y="64"
				width="40"
				height="36"
				rx="1"
				fill="var(--paper)"
				stroke="var(--ink)"
				stroke-width="0.9"
			/>
			<rect
				x="92"
				y="68"
				width="40"
				height="36"
				rx="1"
				fill="var(--yellow)"
				stroke="var(--ink)"
				stroke-width="1.3"
			/>

			<line
				x1="96"
				y1="76"
				x2="124"
				y2="76"
				stroke="var(--ink)"
				stroke-width="0.6"
				opacity="0.55"
			/>
			<line
				x1="96"
				y1="82"
				x2="118"
				y2="82"
				stroke="var(--ink)"
				stroke-width="0.6"
				opacity="0.55"
			/>
			<line
				x1="96"
				y1="92"
				x2="124"
				y2="92"
				stroke="var(--ink)"
				stroke-width="0.6"
				opacity="0.55"
			/>
			<line
				x1="96"
				y1="98"
				x2="120"
				y2="98"
				stroke="var(--ink)"
				stroke-width="0.6"
				opacity="0.55"
			/>

			<rect
				x="115"
				y="72"
				width="13"
				height="8"
				rx="1.5"
				fill="var(--paper)"
				stroke="var(--ink)"
				stroke-width="0.8"
			/>
			<text
				x="121.5"
				y="78"
				text-anchor="middle"
				font-family="var(--mono)"
				font-size="5"
				font-weight="700"
				fill="var(--ink)">[1]</text
			>
			<rect
				x="115"
				y="88"
				width="13"
				height="8"
				rx="1.5"
				fill="var(--paper)"
				stroke="var(--ink)"
				stroke-width="0.8"
			/>
			<text
				x="121.5"
				y="94"
				text-anchor="middle"
				font-family="var(--mono)"
				font-size="5"
				font-weight="700"
				fill="var(--ink)">[2]</text
			>

			<text
				x="108"
				y="114"
				text-anchor="middle"
				font-family="var(--mono)"
				font-size="6.5"
				font-weight="600"
				fill="var(--ink)"
				letter-spacing="0.3">SOURCES</text
			>
		</g>

		<line
			x1="117"
			y1="68"
			x2="117"
			y2="48"
			stroke="var(--yellow)"
			stroke-width="1.4"
			marker-end="url(#int-rag-arr-y)"
		/>
		<text x="138" y="60" font-family="var(--mono)" font-size="5.5" fill="var(--ink)" opacity="0.65"
			>ctx</text
		>

		<text
			x="14"
			y="138"
			font-family="var(--mono)"
			font-size="6.5"
			fill="var(--ink)"
			opacity="0.55"
			letter-spacing="0.5">FIDELITY</text
		>
		<rect
			x="14"
			y="142"
			width="212"
			height="8"
			rx="1"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="0.8"
		/>
		<rect x="14" y="142" width="192" height="8" rx="1" fill="var(--yellow)" />
		<text
			x="222"
			y="149"
			text-anchor="end"
			font-family="var(--mono)"
			font-size="6.5"
			fill="var(--ink)">0.91</text
		>

		<text
			x="14"
			y="164"
			font-family="var(--mono)"
			font-size="6.5"
			fill="var(--ink)"
			opacity="0.55"
			letter-spacing="0.5">HALLUCINATION</text
		>
		<rect
			x="14"
			y="168"
			width="212"
			height="8"
			rx="1"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="0.8"
		/>
		<rect x="14" y="168" width="12" height="8" rx="1" fill="var(--ink)" opacity="0.8" />
		<text
			x="222"
			y="175"
			text-anchor="end"
			font-family="var(--mono)"
			font-size="6.5"
			fill="var(--ink)">0.04</text
		>

		<text x="14" y="192" font-family="var(--mono)" font-size="6.5" fill="var(--ink)" opacity="0.7"
			>$ rag-pipeline --grounded=true --sources=2</text
		>
	</svg>
{:else if pillarId === 'hardening'}
	<svg viewBox="0 0 240 200" class="mx-auto block h-auto w-full max-w-md" aria-hidden="true">
		<defs>
			<pattern id="pi-grid-int-hrd" width="16" height="16" patternUnits="userSpaceOnUse">
				<path
					d="M 16 0 L 0 0 0 16"
					fill="none"
					stroke="rgba(26,26,26,0.35)"
					stroke-width="0.4"
					opacity="0.5"
				/>
			</pattern>
			<marker id="int-hrd-arr" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
				<path
					d="M0,1 L5,3.5 L0,6"
					fill="none"
					stroke="var(--yellow)"
					stroke-width="1.4"
					stroke-linecap="round"
				/>
			</marker>
		</defs>
		<rect width="240" height="200" fill="url(#pi-grid-int-hrd)" />

		<text
			x="52"
			y="16"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="7"
			fill="var(--ink)"
			opacity="0.55"
			letter-spacing="0.6">ENTROPY</text
		>
		<text
			x="188"
			y="16"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="7"
			fill="var(--ink)"
			opacity="0.55"
			letter-spacing="0.6">DETERMINISTIC</text
		>

		<path
			d="M 12 32 Q 22 22, 32 34 T 52 30 T 72 36 T 92 30"
			stroke="var(--ink)"
			stroke-width="1.1"
			fill="none"
			opacity="0.75"
		/>
		<path
			d="M 12 50 Q 22 62, 32 46 T 52 56 T 72 46 T 92 54"
			stroke="var(--ink)"
			stroke-width="1.1"
			fill="none"
			opacity="0.65"
		/>
		<path
			d="M 12 68 Q 22 56, 32 74 T 52 62 T 72 76 T 92 64"
			stroke="var(--ink)"
			stroke-width="1.1"
			fill="none"
			opacity="0.65"
		/>
		<path
			d="M 12 86 Q 22 98, 32 80 T 52 92 T 72 80 T 92 92"
			stroke="var(--ink)"
			stroke-width="1.1"
			fill="none"
			opacity="0.55"
		/>
		<path
			d="M 12 104 Q 22 92, 32 110 T 52 98 T 72 110 T 92 100"
			stroke="var(--ink)"
			stroke-width="1.1"
			fill="none"
			opacity="0.5"
		/>

		<text
			x="52"
			y="124"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="6.5"
			fill="var(--ink)"
			opacity="0.7"
			letter-spacing="0.3">fuzzy vibe-code</text
		>

		<rect
			x="108"
			y="24"
			width="24"
			height="92"
			rx="2"
			fill="var(--yellow)"
			stroke="var(--ink)"
			stroke-width="1.5"
		/>
		{#each [36, 48, 60, 72, 84, 96, 108] as sy (sy)}
			<line
				x1="113"
				y1={sy}
				x2="127"
				y2={sy}
				stroke="var(--ink)"
				stroke-width="0.8"
				opacity="0.7"
			/>
		{/each}
		<text
			x="120"
			y="124"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="5.5"
			fill="var(--ink)"
			font-weight="700"
			letter-spacing="0.4">CLINICAL</text
		>

		<line
			x1="96"
			y1="68"
			x2="106"
			y2="68"
			stroke="var(--yellow)"
			stroke-width="1.6"
			marker-end="url(#int-hrd-arr)"
		/>
		<line
			x1="134"
			y1="68"
			x2="142"
			y2="68"
			stroke="var(--yellow)"
			stroke-width="1.6"
			marker-end="url(#int-hrd-arr)"
		/>

		<rect
			x="144"
			y="24"
			width="84"
			height="92"
			rx="2"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="1.3"
		/>
		<rect x="144" y="24" width="84" height="12" fill="var(--ink)" rx="2" />
		<rect x="144" y="30" width="84" height="6" fill="var(--ink)" />
		<text
			x="150"
			y="33"
			font-family="var(--mono)"
			font-size="6"
			fill="var(--paper)"
			letter-spacing="0.4">output.json</text
		>
		<circle cx="222" cy="30" r="1.5" fill="var(--yellow)" />

		{#each [{ row: '01', y: 48, len: 60 }, { row: '02', y: 60, len: 48 }, { row: '03', y: 72, len: 56 }, { row: '04', y: 84, len: 40 }, { row: '05', y: 96, len: 60 }, { row: '06', y: 108, len: 35 }] as line (line.row)}
			<text
				x="150"
				y={line.y + 2}
				font-family="var(--mono)"
				font-size="5.5"
				fill="var(--ink)"
				opacity="0.5">{line.row}</text
			>
			<line
				x1="160"
				y1={line.y}
				x2={160 + line.len}
				y2={line.y}
				stroke="var(--ink)"
				stroke-width="0.7"
				opacity="0.5"
			/>
		{/each}

		<text
			x="186"
			y="124"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="6.5"
			fill="var(--ink)"
			opacity="0.7"
			letter-spacing="0.3">enterprise-ready</text
		>

		{#each [{ x: 14, y: 140, label: 'cached' }, { x: 130, y: 140, label: 'deterministic' }, { x: 14, y: 158, label: 'guarded' }, { x: 130, y: 158, label: 'observed' }] as item (item.label)}
			<g transform="translate({item.x} {item.y})">
				<rect
					x="0"
					y="0"
					width="10"
					height="10"
					rx="1.5"
					fill="var(--yellow)"
					stroke="var(--ink)"
					stroke-width="0.9"
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
					letter-spacing="0.3">{item.label}</text
				>
			</g>
		{/each}

		<text
			x="14"
			y="186"
			font-family="var(--mono)"
			font-size="5.5"
			fill="var(--ink)"
			opacity="0.75"
			letter-spacing="0.2">$ harden-agent --env=production --temp=0.0 --fail_gracefully=true</text
		>
	</svg>
{:else if pillarId === 'innovation'}
	<svg viewBox="0 0 240 200" class="mx-auto block h-auto w-full max-w-md" aria-hidden="true">
		<defs>
			<pattern id="pi-grid-int-inn" width="16" height="16" patternUnits="userSpaceOnUse">
				<path
					d="M 16 0 L 0 0 0 16"
					fill="none"
					stroke="rgba(26,26,26,0.35)"
					stroke-width="0.4"
					opacity="0.5"
				/>
			</pattern>
			<marker id="int-inn-arr" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
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
		<rect width="240" height="200" fill="url(#pi-grid-int-inn)" />

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
			marker-end="url(#int-inn-arr)"
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
{:else}
	<div class="aspect-6/5 w-full bg-ink"></div>
{/if}
