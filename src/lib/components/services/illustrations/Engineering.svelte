<script lang="ts">
	interface Props {
		pillarId: string | undefined;
	}

	let { pillarId }: Props = $props();
</script>

{#if pillarId === 'frontend'}
	<svg viewBox="0 0 240 200" class="mx-auto block h-auto w-full max-w-md" aria-hidden="true">
		<defs>
			<pattern id="pi-grid-fe" width="16" height="16" patternUnits="userSpaceOnUse">
				<path
					d="M 16 0 L 0 0 0 16"
					fill="none"
					stroke="var(--grid-line)"
					stroke-width="0.4"
					opacity="0.5"
				/>
			</pattern>
		</defs>
		<rect width="240" height="200" fill="url(#pi-grid-fe)" />
		<rect
			x="88"
			y="14"
			width="64"
			height="24"
			rx="2"
			fill="var(--yellow)"
			stroke="var(--ink)"
			stroke-width="1.4"
		/>
		<rect x="138" y="10" width="20" height="10" rx="1.5" fill="var(--ink)" />
		<text
			x="148"
			y="17.5"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="6.5"
			font-weight="700"
			fill="var(--paper)"
			letter-spacing="0.3">.tsx</text
		>
		<text
			x="120"
			y="32"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="9"
			font-weight="700"
			fill="var(--ink)"
			letter-spacing="0.5">App</text
		>
		<g stroke="var(--ink)" stroke-width="0.6" opacity="0.55">
			<line x1="84" y1="14" x2="92" y2="14" />
			<line x1="88" y1="10" x2="88" y2="18" />
			<line x1="148" y1="14" x2="156" y2="14" />
			<line x1="152" y1="10" x2="152" y2="18" />
			<line x1="84" y1="38" x2="92" y2="38" />
			<line x1="88" y1="34" x2="88" y2="42" />
			<line x1="148" y1="38" x2="156" y2="38" />
			<line x1="152" y1="34" x2="152" y2="42" />
		</g>
		<g stroke="var(--ink)" stroke-width="0.4" opacity="0.5">
			<line x1="76" y1="54" x2="92" y2="54" />
			<path d="M 78 52.5 L 76 54 L 78 55.5" fill="none" stroke-linecap="round" />
			<path d="M 90 52.5 L 92 54 L 90 55.5" fill="none" stroke-linecap="round" />
		</g>
		<rect x="79.5" y="50" width="9" height="8" fill="var(--paper)" opacity="0.85" />
		<text
			x="84"
			y="56"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="5"
			fill="var(--ink)"
			opacity="0.7">16</text
		>
		<line x1="120" y1="38" x2="120" y2="50" stroke="var(--ink)" stroke-width="0.85" opacity="0.5" />
		<line x1="48" y1="50" x2="192" y2="50" stroke="var(--ink)" stroke-width="0.85" opacity="0.5" />
		<line x1="48" y1="50" x2="48" y2="58" stroke="var(--ink)" stroke-width="0.85" opacity="0.5" />
		<line x1="120" y1="50" x2="120" y2="58" stroke="var(--ink)" stroke-width="0.85" opacity="0.5" />
		<line x1="192" y1="50" x2="192" y2="58" stroke="var(--ink)" stroke-width="0.85" opacity="0.5" />
		<rect
			x="20"
			y="58"
			width="56"
			height="22"
			rx="2"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="1"
		/>
		<text
			x="48"
			y="73"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="8"
			fill="var(--ink)">Nav</text
		>
		<rect
			x="92"
			y="58"
			width="56"
			height="22"
			rx="2"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="1.2"
		/>
		<text
			x="120"
			y="73"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="8"
			font-weight="600"
			fill="var(--ink)">Page</text
		>
		<rect
			x="164"
			y="58"
			width="56"
			height="22"
			rx="2"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="1"
		/>
		<text
			x="192"
			y="73"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="8"
			fill="var(--ink)">Footer</text
		>
		<line x1="120" y1="80" x2="120" y2="92" stroke="var(--ink)" stroke-width="0.85" opacity="0.5" />
		<line x1="88" y1="92" x2="152" y2="92" stroke="var(--ink)" stroke-width="0.85" opacity="0.5" />
		<line x1="88" y1="92" x2="88" y2="100" stroke="var(--ink)" stroke-width="0.85" opacity="0.5" />
		<line
			x1="152"
			y1="92"
			x2="152"
			y2="100"
			stroke="var(--ink)"
			stroke-width="0.85"
			opacity="0.5"
		/>
		<rect
			x="60"
			y="100"
			width="56"
			height="20"
			rx="2"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="1"
		/>
		<rect
			x="57"
			y="97"
			width="62"
			height="26"
			rx="3"
			fill="none"
			stroke="var(--yellow)"
			stroke-width="1.1"
			stroke-dasharray="3 2"
			opacity="0.85"
		/>
		<text
			x="88"
			y="114"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="7.5"
			fill="var(--ink)">Hero</text
		>
		<g stroke="var(--ink)" stroke-width="0.8" stroke-linecap="round" fill="none" opacity="0.55">
			<path d="M 122 96 q 3 -2 6 0" />
			<path d="M 124 92 q 3 -1.5 5.5 0.5" />
		</g>
		<path
			d="M 114 105 L 114 117 L 117 114.5 L 119 119 L 121 118 L 119 113.5 L 122.5 113.5 Z"
			fill="var(--ink)"
			stroke="var(--paper)"
			stroke-width="0.6"
			stroke-linejoin="round"
		/>
		<rect
			x="124"
			y="100"
			width="56"
			height="20"
			rx="2"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="1"
		/>
		<text
			x="152"
			y="114"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="7.5"
			fill="var(--ink)">Content</text
		>
		<text
			x="16"
			y="140"
			font-family="var(--mono)"
			font-size="6.5"
			fill="var(--ink)"
			opacity="0.5"
			letter-spacing="0.5">RENDER PERF</text
		>
		<line
			x1="16"
			y1="143"
			x2="224"
			y2="143"
			stroke="var(--ink)"
			stroke-width="0.5"
			opacity="0.25"
		/>
		{#each [{ label: 'JS exec', w: 72, y: 147 }, { label: 'Layout ', w: 44, y: 160 }, { label: 'Paint  ', w: 28, y: 173 }] as bar (bar.y)}
			<text
				x="16"
				y={bar.y + 8}
				font-family="var(--mono)"
				font-size="6.5"
				fill="var(--ink)"
				opacity="0.55">{bar.label}</text
			>
			<rect
				x="58"
				y={bar.y}
				width="152"
				height="8"
				rx="1"
				fill="var(--paper)"
				stroke="var(--ink)"
				stroke-width="0.7"
				opacity="0.5"
			/>
			<rect x="58" y={bar.y} width={bar.w} height="8" rx="1" fill="var(--yellow)" opacity="0.8" />
		{/each}
		<line
			x1="146"
			y1="145"
			x2="146"
			y2="183"
			stroke="var(--ink)"
			stroke-width="0.8"
			stroke-dasharray="2 2"
			opacity="0.75"
		/>
		<rect x="135" y="138" width="22" height="7" fill="var(--paper)" opacity="0.9" />
		<text
			x="146"
			y="143"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="6"
			font-weight="700"
			fill="var(--ink)"
			opacity="0.8">16ms</text
		>
	</svg>
{:else if pillarId === 'mobile'}
	<svg viewBox="0 0 240 200" class="mx-auto block h-auto w-full max-w-md" aria-hidden="true">
		<defs>
			<pattern id="pi-grid-mob" width="16" height="16" patternUnits="userSpaceOnUse">
				<path
					d="M 16 0 L 0 0 0 16"
					fill="none"
					stroke="var(--grid-line)"
					stroke-width="0.4"
					opacity="0.5"
				/>
			</pattern>
			<marker id="mob-arr" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
				<path
					d="M0,1 L5,3.5 L0,6"
					fill="none"
					stroke="var(--ink)"
					stroke-width="1"
					stroke-linecap="round"
					opacity="0.75"
				/>
			</marker>
		</defs>
		<rect width="240" height="200" fill="url(#pi-grid-mob)" />

		<rect x="88" y="2" width="64" height="13" rx="2" fill="var(--ink)" />
		<text
			x="120"
			y="10.5"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="7"
			font-weight="700"
			fill="var(--paper)"
			letter-spacing="0.4">React Native</text
		>
		<path
			d="M 102 14 Q 88 16 70 17"
			fill="none"
			stroke="var(--ink)"
			stroke-width="0.85"
			stroke-dasharray="3 2"
			opacity="0.55"
		/>
		<path
			d="M 138 14 Q 152 16 170 19"
			fill="none"
			stroke="var(--ink)"
			stroke-width="0.85"
			stroke-dasharray="3 2"
			opacity="0.55"
		/>

		<rect
			x="26"
			y="18"
			width="78"
			height="130"
			rx="13"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="1.4"
		/>
		<rect x="48" y="18" width="34" height="9" rx="4.5" fill="var(--ink)" />
		<line x1="34" y1="35" x2="96" y2="35" stroke="var(--ink)" stroke-width="0.6" opacity="0.4" />

		<rect
			x="36"
			y="42"
			width="58"
			height="32"
			rx="2"
			fill="var(--yellow)"
			opacity="0.35"
			stroke="var(--ink)"
			stroke-width="0.7"
		/>
		<g stroke="var(--ink)" stroke-width="0.5" opacity="0.65">
			<line x1="33" y1="42" x2="39" y2="42" />
			<line x1="36" y1="39" x2="36" y2="45" />
			<line x1="91" y1="42" x2="97" y2="42" />
			<line x1="94" y1="39" x2="94" y2="45" />
			<line x1="33" y1="74" x2="39" y2="74" />
			<line x1="36" y1="71" x2="36" y2="77" />
			<line x1="91" y1="74" x2="97" y2="74" />
			<line x1="94" y1="71" x2="94" y2="77" />
		</g>

		<line x1="36" y1="80" x2="94" y2="80" stroke="var(--ink)" stroke-width="0.7" opacity="0.45" />
		<line x1="36" y1="89" x2="80" y2="89" stroke="var(--ink)" stroke-width="0.7" opacity="0.45" />

		<path
			d="M 94 75 L 99 75 L 99 114 L 83 114"
			fill="none"
			stroke="var(--ink)"
			stroke-width="0.7"
			stroke-dasharray="2 2"
			opacity="0.6"
			marker-end="url(#mob-arr)"
		/>

		<rect
			x="42"
			y="107"
			width="40"
			height="14"
			rx="1"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="0.9"
		/>
		<g stroke="var(--ink)" stroke-width="0.5" opacity="0.7">
			<line x1="48" y1="107" x2="48" y2="104" />
			<line x1="54" y1="107" x2="54" y2="104" />
			<line x1="60" y1="107" x2="60" y2="104" />
			<line x1="66" y1="107" x2="66" y2="104" />
			<line x1="72" y1="107" x2="72" y2="104" />
			<line x1="76" y1="107" x2="76" y2="104" />
			<line x1="48" y1="121" x2="48" y2="124" />
			<line x1="54" y1="121" x2="54" y2="124" />
			<line x1="60" y1="121" x2="60" y2="124" />
			<line x1="66" y1="121" x2="66" y2="124" />
			<line x1="72" y1="121" x2="72" y2="124" />
			<line x1="76" y1="121" x2="76" y2="124" />
		</g>
		<text
			x="62"
			y="117.5"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="6"
			font-weight="700"
			fill="var(--ink)"
			letter-spacing="0.3">A·SoC</text
		>

		<line
			x1="51"
			y1="138"
			x2="79"
			y2="138"
			stroke="var(--ink)"
			stroke-width="2.5"
			stroke-linecap="round"
			opacity="0.4"
		/>

		<rect
			x="45"
			y="151"
			width="40"
			height="9"
			rx="1.5"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="0.7"
		/>
		<text
			x="65"
			y="157.5"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="6"
			font-weight="600"
			fill="var(--ink)"
			opacity="0.85">iOS · Swift</text
		>

		<rect
			x="136"
			y="20"
			width="78"
			height="128"
			rx="9"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="1.4"
		/>
		<circle cx="175" cy="28" r="3.5" fill="var(--ink)" opacity="0.35" />
		<line x1="144" y1="35" x2="206" y2="35" stroke="var(--ink)" stroke-width="0.6" opacity="0.4" />

		<rect
			x="146"
			y="42"
			width="58"
			height="32"
			rx="2"
			fill="var(--yellow)"
			opacity="0.35"
			stroke="var(--ink)"
			stroke-width="0.7"
		/>
		<g stroke="var(--ink)" stroke-width="0.5" opacity="0.65">
			<line x1="143" y1="42" x2="149" y2="42" />
			<line x1="146" y1="39" x2="146" y2="45" />
			<line x1="201" y1="42" x2="207" y2="42" />
			<line x1="204" y1="39" x2="204" y2="45" />
			<line x1="143" y1="74" x2="149" y2="74" />
			<line x1="146" y1="71" x2="146" y2="77" />
			<line x1="201" y1="74" x2="207" y2="74" />
			<line x1="204" y1="71" x2="204" y2="77" />
		</g>

		<line x1="146" y1="80" x2="204" y2="80" stroke="var(--ink)" stroke-width="0.7" opacity="0.45" />
		<line x1="146" y1="89" x2="190" y2="89" stroke="var(--ink)" stroke-width="0.7" opacity="0.45" />

		<path
			d="M 146 75 L 141 75 L 141 105 L 151 105"
			fill="none"
			stroke="var(--ink)"
			stroke-width="0.7"
			stroke-dasharray="2 2"
			opacity="0.6"
			marker-end="url(#mob-arr)"
		/>

		<rect
			x="152"
			y="98"
			width="40"
			height="14"
			rx="1"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="0.9"
		/>
		<g stroke="var(--ink)" stroke-width="0.5" opacity="0.7">
			<line x1="158" y1="98" x2="158" y2="95" />
			<line x1="164" y1="98" x2="164" y2="95" />
			<line x1="170" y1="98" x2="170" y2="95" />
			<line x1="176" y1="98" x2="176" y2="95" />
			<line x1="182" y1="98" x2="182" y2="95" />
			<line x1="188" y1="98" x2="188" y2="95" />
			<line x1="158" y1="112" x2="158" y2="115" />
			<line x1="164" y1="112" x2="164" y2="115" />
			<line x1="170" y1="112" x2="170" y2="115" />
			<line x1="176" y1="112" x2="176" y2="115" />
			<line x1="182" y1="112" x2="182" y2="115" />
			<line x1="188" y1="112" x2="188" y2="115" />
		</g>
		<text
			x="172"
			y="108.5"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="6"
			font-weight="700"
			fill="var(--ink)"
			letter-spacing="0.3">SoC</text
		>

		<line
			x1="144"
			y1="125"
			x2="206"
			y2="125"
			stroke="var(--ink)"
			stroke-width="0.6"
			opacity="0.35"
		/>
		<circle
			cx="160"
			cy="135"
			r="4"
			fill="none"
			stroke="var(--ink)"
			stroke-width="1.1"
			opacity="0.4"
		/>
		<rect
			x="170"
			y="131"
			width="8"
			height="8"
			rx="1.5"
			fill="none"
			stroke="var(--ink)"
			stroke-width="1.1"
			opacity="0.4"
		/>
		<path
			d="M 184 135 L 188 130 L 192 135"
			fill="none"
			stroke="var(--ink)"
			stroke-width="1.1"
			stroke-linecap="round"
			opacity="0.4"
		/>

		<rect
			x="146"
			y="151"
			width="58"
			height="9"
			rx="1.5"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="0.7"
		/>
		<text
			x="175"
			y="157.5"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="5.5"
			font-weight="600"
			fill="var(--ink)"
			opacity="0.85">Android · Kotlin</text
		>

		<path
			d="M 65 160 Q 65 165 92 168"
			fill="none"
			stroke="var(--ink)"
			stroke-width="0.9"
			stroke-dasharray="3 2"
			opacity="0.6"
			marker-end="url(#mob-arr)"
		/>
		<path
			d="M 175 160 Q 175 165 148 168"
			fill="none"
			stroke="var(--ink)"
			stroke-width="0.9"
			stroke-dasharray="3 2"
			opacity="0.6"
			marker-end="url(#mob-arr)"
		/>

		<rect
			x="52"
			y="170"
			width="136"
			height="16"
			rx="8"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="0.9"
		/>
		<text
			x="120"
			y="182"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="7.5"
			font-weight="600"
			fill="var(--ink)"
			letter-spacing="0.3">native-level polish</text
		>
	</svg>
{:else if pillarId === 'backend'}
	<svg viewBox="0 0 240 200" class="mx-auto block h-auto w-full max-w-md" aria-hidden="true">
		<defs>
			<pattern id="pi-grid-be" width="16" height="16" patternUnits="userSpaceOnUse">
				<path
					d="M 16 0 L 0 0 0 16"
					fill="none"
					stroke="var(--grid-line)"
					stroke-width="0.4"
					opacity="0.5"
				/>
			</pattern>
			<marker id="be-arr" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
				<path
					d="M0,1 L6,4 L0,7"
					fill="none"
					stroke="var(--ink)"
					stroke-width="1.1"
					stroke-linecap="round"
					opacity="0.75"
				/>
			</marker>
			<marker id="be-arr-y" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
				<path
					d="M0,1 L6,4 L0,7"
					fill="none"
					stroke="var(--yellow)"
					stroke-width="1.2"
					stroke-linecap="round"
				/>
			</marker>
		</defs>
		<rect width="240" height="200" fill="url(#pi-grid-be)" />
		<text
			x="14"
			y="14"
			font-family="var(--mono)"
			font-size="6.5"
			fill="var(--ink)"
			opacity="0.5"
			letter-spacing="0.5">REQUEST ──────────────── DATA</text
		>

		<rect
			x="8"
			y="56"
			width="46"
			height="22"
			rx="2"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="1"
		/>
		<text
			x="31"
			y="70.5"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="7.5"
			font-weight="700"
			fill="var(--ink)">FRONTEND</text
		>

		<rect
			x="8"
			y="86"
			width="46"
			height="22"
			rx="2"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="1"
			stroke-dasharray="3 2"
		/>
		<text
			x="31"
			y="100.5"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="7.5"
			font-weight="700"
			fill="var(--ink)">AI AGENT</text
		>

		<line
			x1="54"
			y1="67"
			x2="84"
			y2="67"
			stroke="var(--yellow)"
			stroke-width="1.4"
			marker-end="url(#be-arr-y)"
		/>
		<line
			x1="54"
			y1="97"
			x2="84"
			y2="97"
			stroke="var(--yellow)"
			stroke-width="1.4"
			marker-end="url(#be-arr-y)"
		/>

		<rect
			x="84"
			y="50"
			width="86"
			height="64"
			rx="2"
			fill="var(--yellow)"
			stroke="var(--ink)"
			stroke-width="1.5"
		/>

		<line
			x1="127"
			y1="58"
			x2="127"
			y2="106"
			stroke="var(--ink)"
			stroke-width="0.7"
			stroke-dasharray="2 2"
			opacity="0.55"
		/>

		<text
			x="105"
			y="80"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="7"
			font-weight="700"
			fill="var(--ink)"
			letter-spacing="0.3">API</text
		>
		<text
			x="105"
			y="90"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="7"
			font-weight="700"
			fill="var(--ink)"
			letter-spacing="0.3">GATEWAY</text
		>

		<text
			x="149"
			y="80"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="7"
			font-weight="700"
			fill="var(--ink)"
			letter-spacing="0.3">CORE</text
		>
		<text
			x="149"
			y="90"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="7"
			font-weight="700"
			fill="var(--ink)"
			letter-spacing="0.3">SERVICES</text
		>

		<line
			x1="174"
			y1="82"
			x2="186"
			y2="82"
			stroke="var(--ink)"
			stroke-width="1.1"
			marker-end="url(#be-arr)"
			opacity="0.7"
		/>
		<ellipse
			cx="208"
			cy="70"
			rx="18"
			ry="7"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="1.1"
		/>
		<rect x="190" y="70" width="36" height="28" fill="var(--paper)" stroke="none" />
		<line x1="190" y1="70" x2="190" y2="98" stroke="var(--ink)" stroke-width="1.1" />
		<line x1="226" y1="70" x2="226" y2="98" stroke="var(--ink)" stroke-width="1.1" />
		<ellipse
			cx="208"
			cy="98"
			rx="18"
			ry="7"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="1.1"
		/>
		<text
			x="208"
			y="88"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="7.5"
			font-weight="600"
			fill="var(--ink)">DB</text
		>

		<path
			d="M 127 118 L 127 138 L 31 138 L 31 110"
			stroke="var(--ink)"
			stroke-width="0.9"
			stroke-dasharray="4 3"
			fill="none"
			marker-end="url(#be-arr)"
			opacity="0.5"
		/>
		<text
			x="79"
			y="135"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="6.5"
			fill="var(--ink)"
			opacity="0.65">← HTTP/200</text
		>

		<line x1="128" y1="50" x2="128" y2="38" stroke="var(--ink)" stroke-width="0.8" opacity="0.5" />
		<rect
			x="102"
			y="24"
			width="52"
			height="14"
			rx="2"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="0.8"
		/>
		<text
			x="128"
			y="35"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="7"
			font-weight="700"
			fill="var(--ink)"
			letter-spacing="0.4">hardened</text
		>
		{#each ['documented', 'tested', 'typed'] as label, i (label)}
			<g transform="translate({14 + i * 66} 160)">
				<rect
					x="0"
					y="0"
					width="9"
					height="9"
					rx="1"
					fill="var(--yellow)"
					stroke="var(--ink)"
					stroke-width="0.8"
				/>
				<path
					d="M 1.5 4.5 L 3.5 6.5 L 7.5 2.5"
					stroke="var(--ink)"
					stroke-width="1.1"
					fill="none"
					stroke-linecap="round"
				/>
				<text
					x="12"
					y="8.5"
					font-family="var(--mono)"
					font-size="7"
					fill="var(--ink)"
					opacity="0.75">{label}</text
				>
			</g>
		{/each}
	</svg>
{:else if pillarId === 'cms'}
	<svg viewBox="0 0 240 200" class="mx-auto block h-auto w-full max-w-md" aria-hidden="true">
		<defs>
			<pattern id="pi-grid-cms" width="16" height="16" patternUnits="userSpaceOnUse">
				<path
					d="M 16 0 L 0 0 0 16"
					fill="none"
					stroke="var(--grid-line)"
					stroke-width="0.4"
					opacity="0.5"
				/>
			</pattern>
			<marker id="cms-arr" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
				<path
					d="M0,1 L5,3.5 L0,6"
					fill="none"
					stroke="var(--ink)"
					stroke-width="1"
					stroke-linecap="round"
					opacity="0.65"
				/>
			</marker>
		</defs>
		<rect width="240" height="200" fill="url(#pi-grid-cms)" />
		<text
			x="14"
			y="14"
			font-family="var(--mono)"
			font-size="7"
			fill="var(--ink)"
			opacity="0.5"
			letter-spacing="0.5">CONTENT MODEL</text
		>
		<text
			x="226"
			y="14"
			text-anchor="end"
			font-family="var(--mono)"
			font-size="7"
			fill="var(--ink)"
			opacity="0.5"
			letter-spacing="0.5">CHANNELS</text
		>

		<rect
			x="14"
			y="22"
			width="106"
			height="148"
			rx="3"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="1.2"
		/>
		<rect x="14" y="22" width="106" height="20" rx="3" fill="var(--ink)" />
		<rect x="14" y="36" width="106" height="6" fill="var(--ink)" />
		<text
			x="67"
			y="36"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="8.5"
			font-weight="700"
			fill="var(--paper)"
			letter-spacing="0.5">ARTICLE</text
		>

		{#each [{ label: 'title', type: 'string' }, { label: 'body', type: 'richtext' }, { label: 'image', type: 'media' }, { label: 'tags', type: 'array' }, { label: 'slug', type: 'string' }, { label: 'status', type: 'enum' }] as field, i (field.label)}
			<g transform="translate(17 {49 + i * 19})">
				<rect
					x="0"
					y="0"
					width="100"
					height="17"
					rx="1.5"
					fill="var(--paper)"
					stroke="var(--ink)"
					stroke-width="0.45"
					opacity="0.9"
				/>
				<rect x="0" y="0" width="3" height="17" rx="1.5" fill="var(--ink)" opacity="0.55" />
				<text
					x="9"
					y="11.5"
					font-family="var(--mono)"
					font-size="7"
					font-weight="500"
					fill="var(--ink)">{field.label}</text
				>
				<text
					x="94"
					y="11.5"
					text-anchor="end"
					font-family="var(--mono)"
					font-size="6"
					fill="var(--ink)"
					opacity="0.55">{field.type}</text
				>
			</g>
		{/each}

		<line
			x1="121"
			y1="52"
			x2="148"
			y2="52"
			stroke="var(--ink)"
			stroke-width="0.9"
			stroke-dasharray="3 2"
			opacity="0.65"
			marker-end="url(#cms-arr)"
		/>
		<line
			x1="121"
			y1="102"
			x2="148"
			y2="102"
			stroke="var(--ink)"
			stroke-width="0.9"
			stroke-dasharray="3 2"
			opacity="0.65"
			marker-end="url(#cms-arr)"
		/>
		<line
			x1="121"
			y1="152"
			x2="148"
			y2="152"
			stroke="var(--ink)"
			stroke-width="0.9"
			stroke-dasharray="3 2"
			opacity="0.65"
			marker-end="url(#cms-arr)"
		/>

		{#each [{ y: 40, label: 'WEB' }, { y: 90, label: 'MOBILE' }, { y: 140, label: 'API' }] as channel (channel.label)}
			<rect
				x="150"
				y={channel.y}
				width="76"
				height="24"
				rx="2"
				fill="var(--paper)"
				stroke="var(--ink)"
				stroke-width="1"
			/>
			<text
				x="188"
				y={channel.y + 16}
				text-anchor="middle"
				font-family="var(--mono)"
				font-size="9.5"
				font-weight="600"
				fill="var(--ink)"
				letter-spacing="0.5">{channel.label}</text
			>
		{/each}
	</svg>
{:else if pillarId === 'ecommerce'}
	<svg viewBox="0 0 240 200" class="mx-auto block h-auto w-full max-w-md" aria-hidden="true">
		<defs>
			<pattern id="pi-grid-eco" width="16" height="16" patternUnits="userSpaceOnUse">
				<path
					d="M 16 0 L 0 0 0 16"
					fill="none"
					stroke="var(--grid-line)"
					stroke-width="0.4"
					opacity="0.5"
				/>
			</pattern>
			<marker id="eco-arr" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
				<path
					d="M0,1 L5,3.5 L0,6"
					fill="none"
					stroke="var(--ink)"
					stroke-width="1"
					stroke-linecap="round"
					opacity="0.7"
				/>
			</marker>
			<marker id="eco-arr-y" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
				<path
					d="M0,1 L5,3.5 L0,6"
					fill="none"
					stroke="var(--yellow)"
					stroke-width="1.2"
					stroke-linecap="round"
				/>
			</marker>
		</defs>
		<rect width="240" height="200" fill="url(#pi-grid-eco)" />
		<text
			x="120"
			y="14"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="7"
			fill="var(--ink)"
			opacity="0.5"
			letter-spacing="0.5">COMMERCE FLOW</text
		>
		{#each [{ x: 10, w: 46, label: 'CART', hot: false }, { x: 62, w: 60, label: 'CHECKOUT', hot: false }, { x: 128, w: 54, label: 'STRIPE', hot: true }, { x: 188, w: 42, label: 'DONE', hot: false }] as step (step.label)}
			<rect
				x={step.x}
				y="60"
				width={step.w}
				height="30"
				rx="2"
				fill={step.hot ? 'var(--yellow)' : 'var(--paper)'}
				stroke="var(--ink)"
				stroke-width={step.hot ? 1.5 : 1}
			/>
			<text
				x={step.x + step.w / 2}
				y="79"
				text-anchor="middle"
				font-family="var(--mono)"
				font-size={step.label.length > 5 ? 7.5 : 9}
				font-weight={step.hot ? 700 : 500}
				fill="var(--ink)"
				letter-spacing="0.3">{step.label}</text
			>
		{/each}
		<line
			x1="56"
			y1="75"
			x2="62"
			y2="75"
			stroke="var(--ink)"
			stroke-width="1"
			marker-end="url(#eco-arr)"
			opacity="0.7"
		/>
		<line
			x1="122"
			y1="75"
			x2="128"
			y2="75"
			stroke="var(--yellow)"
			stroke-width="1.3"
			marker-end="url(#eco-arr-y)"
		/>
		<line
			x1="182"
			y1="75"
			x2="188"
			y2="75"
			stroke="var(--ink)"
			stroke-width="1"
			marker-end="url(#eco-arr)"
			opacity="0.7"
		/>
		<line
			x1="155"
			y1="90"
			x2="155"
			y2="112"
			stroke="var(--ink)"
			stroke-width="0.9"
			stroke-dasharray="3 2"
			opacity="0.5"
		/>
		<rect
			x="116"
			y="112"
			width="78"
			height="24"
			rx="2"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="1"
		/>
		<text
			x="155"
			y="128"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="8"
			font-weight="600"
			fill="var(--ink)"
			letter-spacing="0.3">POS TERMINAL</text
		>
		{#each ['stripe-powered', 'inventory sync', 'global scale'] as label, i (label)}
			<g transform="translate({14 + i * 74} 152)">
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
				<text x="12" y="8" font-family="var(--mono)" font-size="6.5" fill="var(--ink)" opacity="1"
					>{label}</text
				>
			</g>
		{/each}
		<text
			x="120"
			y="186"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="6.5"
			fill="var(--ink)"
			opacity="0.4">inventory · scaling · deep integrations</text
		>
	</svg>
{:else}
	<div class="aspect-6/5 w-full bg-ink"></div>
{/if}
