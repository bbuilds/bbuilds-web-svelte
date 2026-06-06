<script lang="ts">
	interface Props {
		pillarId: string | undefined;
	}
	let { pillarId }: Props = $props();
</script>

{#if pillarId === 'geo'}
	<svg viewBox="0 0 240 200" class="mx-auto block h-auto w-full max-w-md" aria-hidden="true">
		<defs>
			<marker id="geo-arr-hot" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
				<path
					d="M0,1 L6,4 L0,7"
					fill="none"
					stroke="var(--yellow)"
					stroke-width="1.4"
					stroke-linecap="round"
				/>
			</marker>
			<marker id="geo-arr" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
				<path
					d="M0,1 L6,4 L0,7"
					fill="none"
					stroke="var(--ink)"
					stroke-width="1.2"
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
			letter-spacing="0.6">GEO · AI AUTHORITY</text
		>

		<!-- BRAND node -->
		<rect
			x="10"
			y="28"
			width="68"
			height="52"
			rx="2"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="1.1"
		/>
		<text
			x="44"
			y="46"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="8.5"
			font-weight="700"
			fill="var(--ink)"
			letter-spacing="0.4">BRAND</text
		>
		<text
			x="44"
			y="58"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="6"
			fill="var(--ink)"
			opacity="0.55">entity · schema</text
		>
		<text
			x="44"
			y="68"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="6"
			fill="var(--ink)"
			opacity="0.55">signals · data</text
		>

		<!-- Arrow BRAND → AI MODEL -->
		<line
			x1="80"
			y1="54"
			x2="96"
			y2="54"
			stroke="var(--yellow)"
			stroke-width="1.4"
			marker-end="url(#geo-arr-hot)"
		/>

		<!-- AI MODEL node (hot) -->
		<rect
			x="96"
			y="18"
			width="92"
			height="72"
			rx="2"
			fill="rgb(from var(--pale-fire) r g b / 0.12)"
			stroke="var(--yellow)"
			stroke-width="1.4"
		/>
		<rect
			x="94"
			y="16"
			width="96"
			height="76"
			rx="4"
			fill="none"
			stroke="var(--yellow)"
			stroke-width="0.6"
			opacity="0.3"
			stroke-dasharray="3 3"
		/>
		<text
			x="142"
			y="42"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="9.5"
			font-weight="700"
			fill="var(--ink)"
			letter-spacing="0.3">AI MODEL</text
		>
		<text
			x="142"
			y="55"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="6.5"
			fill="var(--ink)"
			opacity="0.65">context window</text
		>
		<text
			x="142"
			y="66"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="6"
			fill="var(--ink)"
			opacity="0.5">parsing signals</text
		>
		<text
			x="142"
			y="78"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="6"
			fill="var(--ink)"
			opacity="0.5">structured data</text
		>

		<!-- Arrow AI MODEL → CITED -->
		<line
			x1="190"
			y1="54"
			x2="205"
			y2="54"
			stroke="var(--yellow)"
			stroke-width="1.4"
			marker-end="url(#geo-arr-hot)"
		/>

		<!-- CITED node (hot) -->
		<circle cx="218" cy="54" r="18" fill="var(--yellow)" stroke="var(--ink)" stroke-width="1.4" />
		<circle cx="218" cy="54" r="6" fill="var(--ink)" />
		<circle
			cx="218"
			cy="54"
			r="21"
			fill="none"
			stroke="var(--yellow)"
			stroke-width="1"
			opacity="0.35"
			stroke-dasharray="3 3"
		/>
		<text
			x="218"
			y="81"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="6.5"
			font-weight="700"
			fill="var(--ink)"
			letter-spacing="0.3">CITED</text
		>

		<!-- Separator -->
		<line x1="10" y1="100" x2="230" y2="100" stroke="var(--ink)" stroke-width="0.5" opacity="0.2" />

		<text
			x="14"
			y="111"
			font-family="var(--mono)"
			font-size="6.5"
			fill="var(--ink)"
			opacity="0.55"
			letter-spacing="0.6">MODEL CLASSES</text
		>

		<!-- Model class: REASONING CORE -->
		<rect
			x="10"
			y="114"
			width="70"
			height="28"
			rx="2"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="1"
		/>
		<text
			x="45"
			y="126"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="6.5"
			font-weight="700"
			fill="var(--ink)"
			letter-spacing="0.2">REASONING CORE</text
		>
		<text
			x="45"
			y="137"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="5.5"
			fill="var(--ink)"
			opacity="0.55">probabilistic · llm</text
		>

		<!-- Model class: HYBRID ENGINE -->
		<rect
			x="85"
			y="114"
			width="70"
			height="28"
			rx="2"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="1"
		/>
		<text
			x="120"
			y="126"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="6.5"
			font-weight="700"
			fill="var(--ink)"
			letter-spacing="0.2">HYBRID ENGINE</text
		>
		<text
			x="120"
			y="137"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="5.5"
			fill="var(--ink)"
			opacity="0.55">retrieval · rag</text
		>

		<!-- Model class: AGENTIC ROUTER -->
		<rect
			x="160"
			y="114"
			width="70"
			height="28"
			rx="2"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="1"
		/>
		<text
			x="195"
			y="126"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="6.5"
			font-weight="700"
			fill="var(--ink)"
			letter-spacing="0.2">AGENTIC ROUTER</text
		>
		<text
			x="195"
			y="137"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="5.5"
			fill="var(--ink)"
			opacity="0.55">multi-modal · action</text
		>

		<!-- Feedback loop: structured index ingestion (golden dashed arrows rising into model nodes) -->
		<line
			x1="45"
			y1="162"
			x2="45"
			y2="144"
			stroke="var(--yellow)"
			stroke-width="0.9"
			stroke-dasharray="2 2"
			opacity="0.65"
			marker-end="url(#geo-arr-hot)"
		/>
		<line
			x1="120"
			y1="162"
			x2="120"
			y2="144"
			stroke="var(--yellow)"
			stroke-width="0.9"
			stroke-dasharray="2 2"
			opacity="0.65"
			marker-end="url(#geo-arr-hot)"
		/>
		<line
			x1="195"
			y1="162"
			x2="195"
			y2="144"
			stroke="var(--yellow)"
			stroke-width="0.9"
			stroke-dasharray="2 2"
			opacity="0.65"
			marker-end="url(#geo-arr-hot)"
		/>

		<!-- Structured signals base (origin of feedback loop) -->
		<rect
			x="10"
			y="162"
			width="220"
			height="14"
			rx="2"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="0.8"
		/>
		<text
			x="120"
			y="171.5"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="5.5"
			fill="var(--ink)"
			opacity="0.7"
			letter-spacing="0.3">STRUCTURED INDEX INGESTION</text
		>
	</svg>
{:else if pillarId === 'semantic-seo'}
	<svg viewBox="0 0 240 200" class="mx-auto block h-auto w-full max-w-md" aria-hidden="true">
		<defs>
			<marker id="seo-arr" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
				<path
					d="M0,1 L6,4 L0,7"
					fill="none"
					stroke="var(--ink)"
					stroke-width="1"
					stroke-linecap="round"
					opacity="0.55"
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
			letter-spacing="0.6">SCHEMA · SEMANTIC INDEXING</text
		>

		<!-- JSON-LD code block -->
		<rect x="10" y="20" width="220" height="90" rx="2" fill="var(--ink)" />
		<!-- chrome bar -->
		<rect x="10" y="20" width="220" height="14" rx="2" fill="rgba(255,255,255,0.06)" />
		<text
			x="18"
			y="30"
			font-family="var(--mono)"
			font-size="6"
			fill="var(--paper)"
			opacity="0.5"
			letter-spacing="0.3">application/ld+json</text
		>
		<!-- code lines -->
		<text x="18" y="46" font-family="var(--mono)" font-size="6.5" fill="var(--paper)" opacity="0.55"
			>&#123;</text
		>
		<text x="26" y="57" font-family="var(--mono)" font-size="6.5" fill="var(--teal)"
			>"@context"</text
		>
		<text x="80" y="57" font-family="var(--mono)" font-size="6.5" fill="var(--paper)"
			>: "https://schema.org",</text
		>
		<text x="26" y="68" font-family="var(--mono)" font-size="6.5" fill="var(--teal)">"@type"</text>
		<text x="68" y="68" font-family="var(--mono)" font-size="6.5" fill="var(--paper)">: </text>
		<text
			x="76"
			y="68"
			font-family="var(--mono)"
			font-size="6.5"
			fill="var(--yellow)"
			font-weight="700">"Organization"</text
		>
		<text x="26" y="79" font-family="var(--mono)" font-size="6.5" fill="var(--teal)">"name"</text>
		<text x="62" y="79" font-family="var(--mono)" font-size="6.5" fill="var(--paper)"
			>: "YourBrand",</text
		>
		<text x="26" y="90" font-family="var(--mono)" font-size="6.5" fill="var(--teal)">"sameAs"</text>
		<text x="68" y="90" font-family="var(--mono)" font-size="6.5" fill="var(--paper)">: [</text>
		<text x="80" y="90" font-family="var(--mono)" font-size="6.5" fill="var(--yellow)">…</text>
		<text x="90" y="90" font-family="var(--mono)" font-size="6.5" fill="var(--paper)">],</text>
		<text
			x="18"
			y="103"
			font-family="var(--mono)"
			font-size="6.5"
			fill="var(--paper)"
			opacity="0.55">&#125;</text
		>

		<!-- Entity graph -->
		<!-- Organization (center, hot) -->
		<rect
			x="82"
			y="118"
			width="76"
			height="22"
			rx="2"
			fill="var(--yellow)"
			stroke="var(--ink)"
			stroke-width="1.4"
		/>
		<text
			x="120"
			y="132"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="7.5"
			font-weight="700"
			fill="var(--ink)"
			letter-spacing="0.3">ORGANIZATION</text
		>

		<!-- Spoke lines from org with relationship labels -->
		<line
			x1="82"
			y1="129"
			x2="58"
			y2="142"
			stroke="var(--ink)"
			stroke-width="0.9"
			opacity="0.45"
			stroke-dasharray="3 2"
			marker-end="url(#seo-arr)"
		/>
		<line
			x1="120"
			y1="140"
			x2="120"
			y2="148"
			stroke="var(--ink)"
			stroke-width="0.9"
			opacity="0.45"
			stroke-dasharray="3 2"
			marker-end="url(#seo-arr)"
		/>
		<line
			x1="158"
			y1="129"
			x2="182"
			y2="142"
			stroke="var(--ink)"
			stroke-width="0.9"
			opacity="0.45"
			stroke-dasharray="3 2"
			marker-end="url(#seo-arr)"
		/>

		<!-- Schema.org relationship property labels -->
		<text
			x="70"
			y="132"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="4.5"
			fill="var(--ink)"
			opacity="0.5"
			letter-spacing="0.2">founder</text
		>
		<text
			x="125"
			y="146"
			font-family="var(--mono)"
			font-size="4.5"
			fill="var(--ink)"
			opacity="0.5"
			letter-spacing="0.2">makesOffer</text
		>
		<text
			x="170"
			y="132"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="4.5"
			fill="var(--ink)"
			opacity="0.5"
			letter-spacing="0.2">publisher</text
		>

		<!-- Leaf nodes -->
		<rect
			x="26"
			y="146"
			width="48"
			height="16"
			rx="2"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="0.9"
		/>
		<text
			x="50"
			y="157"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="6.5"
			font-weight="600"
			fill="var(--ink)">Person</text
		>

		<rect
			x="88"
			y="150"
			width="48"
			height="16"
			rx="2"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="0.9"
		/>
		<text
			x="112"
			y="161"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="6.5"
			font-weight="600"
			fill="var(--ink)">Product</text
		>

		<rect
			x="164"
			y="146"
			width="48"
			height="16"
			rx="2"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="0.9"
		/>
		<text
			x="188"
			y="157"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="6.5"
			font-weight="600"
			fill="var(--ink)">Article</text
		>

		<!-- Status row with telemetry -->
		<rect
			x="10"
			y="172"
			width="220"
			height="8"
			rx="1"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="0.6"
		/>
		<rect x="10" y="172" width="220" height="8" rx="1" fill="var(--green)" opacity="0.7" />
		<text
			x="14"
			y="178.5"
			font-family="var(--mono)"
			font-size="5"
			fill="var(--ink)"
			font-weight="700"
			letter-spacing="0.3">indexed</text
		>
		<text
			x="226"
			y="178.5"
			text-anchor="end"
			font-family="var(--mono)"
			font-size="5"
			fill="var(--ink)"
			opacity="0.8">status: 200 OK · validated: 100%</text
		>
	</svg>
{:else if pillarId === 'performance'}
	<svg viewBox="0 0 240 200" class="mx-auto block h-auto w-full max-w-md" aria-hidden="true">
		<text
			x="14"
			y="14"
			font-family="var(--mono)"
			font-size="6.5"
			fill="var(--ink)"
			opacity="0.55"
			letter-spacing="0.5">CORE WEB VITALS</text
		>
		<text
			x="226"
			y="14"
			text-anchor="end"
			font-family="var(--mono)"
			font-size="6.5"
			fill="var(--yellow)"
			opacity="0.9"
			font-weight="700"
			letter-spacing="0.5">● PASSING</text
		>

		<!-- LCP gauge (cx=45, cy=70, r=22, value=1.8/4) -->
		<path
			d="M 23 70 A 22 22 0 0 1 67 70"
			fill="none"
			stroke="var(--ink)"
			stroke-width="1"
			opacity="0.25"
		/>
		<path
			d="M 23 70 A 22 22 0 0 1 41.559 48.271"
			fill="none"
			stroke="var(--yellow)"
			stroke-width="4"
			stroke-linecap="round"
		/>
		<circle cx="41.559" cy="48.271" r="2.5" fill="var(--ink)" />
		<text
			x="45"
			y="70"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="10"
			font-weight="700"
			fill="var(--ink)">1.8s</text
		>
		<text
			x="45"
			y="84"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="7.5"
			font-weight="700"
			fill="var(--ink)"
			letter-spacing="0.4">LCP</text
		>

		<!-- INP gauge (cx=120, cy=70, r=22, value=142/500) -->
		<path
			d="M 98 70 A 22 22 0 0 1 142 70"
			fill="none"
			stroke="var(--ink)"
			stroke-width="1"
			opacity="0.25"
		/>
		<path
			d="M 98 70 A 22 22 0 0 1 106.15 52.90"
			fill="none"
			stroke="var(--yellow)"
			stroke-width="4"
			stroke-linecap="round"
		/>
		<circle cx="106.15" cy="52.90" r="2.5" fill="var(--ink)" />
		<text
			x="120"
			y="70"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="10"
			font-weight="700"
			fill="var(--ink)">142ms</text
		>
		<text
			x="120"
			y="84"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="7.5"
			font-weight="700"
			fill="var(--ink)"
			letter-spacing="0.4">INP</text
		>

		<!-- CLS gauge (cx=195, cy=70, r=22, value=0.04/0.25) -->
		<path
			d="M 173 70 A 22 22 0 0 1 217 70"
			fill="none"
			stroke="var(--ink)"
			stroke-width="1"
			opacity="0.25"
		/>
		<path
			d="M 173 70 A 22 22 0 0 1 175.72 59.40"
			fill="none"
			stroke="var(--yellow)"
			stroke-width="4"
			stroke-linecap="round"
		/>
		<circle cx="175.72" cy="59.40" r="2.5" fill="var(--ink)" />
		<text
			x="195"
			y="70"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="10"
			font-weight="700"
			fill="var(--ink)">0.04</text
		>
		<text
			x="195"
			y="84"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="7.5"
			font-weight="700"
			fill="var(--ink)"
			letter-spacing="0.4">CLS</text
		>

		<!-- Threshold targets under gauges (as programmatic constants) -->
		<text
			x="45"
			y="106"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="5.5"
			fill="var(--ink)"
			opacity="0.7">LCP_LIMIT</text
		>
		<text
			x="45"
			y="114"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="5.5"
			font-weight="700"
			fill="var(--ink)">= 2.5s</text
		>
		<text
			x="120"
			y="106"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="5.5"
			fill="var(--ink)"
			opacity="0.7">INP_LIMIT</text
		>
		<text
			x="120"
			y="114"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="5.5"
			font-weight="700"
			fill="var(--ink)">= 200ms</text
		>
		<text
			x="195"
			y="106"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="5.5"
			fill="var(--ink)"
			opacity="0.7">CLS_LIMIT</text
		>
		<text
			x="195"
			y="114"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="5.5"
			font-weight="700"
			fill="var(--ink)">= 0.10</text
		>

		<!-- Lighthouse strip -->
		<g transform="translate(14 124)">
			<rect
				x="0"
				y="0"
				width="212"
				height="32"
				rx="3"
				fill="var(--ink)"
				stroke="var(--ink)"
				stroke-width="1"
			/>
			<text
				x="10"
				y="12"
				font-family="var(--mono)"
				font-size="6.5"
				fill="var(--paper)"
				opacity="0.55"
				letter-spacing="0.5">LIGHTHOUSE</text
			>
			<text
				x="202"
				y="12"
				text-anchor="end"
				font-family="var(--mono)"
				font-size="5.5"
				fill="var(--green)"
				font-weight="700"
				letter-spacing="0.4">budget: pass</text
			>
			{#each [{ label: 'Perf', v: 100 }, { label: 'A11y', v: 100 }, { label: 'BP', v: 100 }, { label: 'SEO', v: 100 }] as score, i (score.label)}
				<g transform={`translate(${10 + i * 50} 18)`}>
					<circle
						cx="6"
						cy="6"
						r="6"
						fill="var(--yellow)"
						stroke="var(--paper)"
						stroke-width="0.9"
					/>
					<text
						x="6"
						y="9"
						text-anchor="middle"
						font-family="var(--mono)"
						font-size="6.5"
						font-weight="700"
						fill="var(--ink)">{score.v}</text
					>
					<text x="16" y="9" font-family="var(--mono)" font-size="6.5" fill="var(--paper)"
						>{score.label}</text
					>
					<path
						d="M 34 7 L 36.5 9.5 L 41 4.5"
						fill="none"
						stroke="var(--green)"
						stroke-width="1.2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</g>
			{/each}
		</g>
	</svg>
{:else if pillarId === 'evolution'}
	<svg viewBox="0 0 240 200" class="mx-auto block h-auto w-full max-w-md" aria-hidden="true">
		<defs>
			<marker id="evol-arr" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
				<path
					d="M0,1 L6,4 L0,7"
					fill="none"
					stroke="var(--ink)"
					stroke-width="1.2"
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
			letter-spacing="0.6">MAINTENANCE · EVOLUTION</text
		>

		<!-- Version timeline track -->
		<line x1="20" y1="50" x2="220" y2="50" stroke="var(--ink)" stroke-width="0.9" opacity="0.35" />

		<!-- v1.0 node -->
		<circle cx="36" cy="50" r="8" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.2" />
		<text
			x="36"
			y="53.5"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="5.5"
			font-weight="700"
			fill="var(--ink)">1.0</text
		>
		<text
			x="36"
			y="68"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="6"
			fill="var(--ink)"
			opacity="0.6"
			font-weight="700">v1.0.0</text
		>

		<!-- v1.1 node -->
		<circle cx="90" cy="50" r="8" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.2" />
		<text
			x="90"
			y="53.5"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="5.5"
			font-weight="700"
			fill="var(--ink)">1.1</text
		>
		<rect
			x="70"
			y="26"
			width="40"
			height="14"
			rx="7"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="0.8"
		/>
		<text
			x="90"
			y="36"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="5.5"
			fill="var(--ink)"
			opacity="0.7">security</text
		>
		<line x1="90" y1="40" x2="90" y2="42" stroke="var(--ink)" stroke-width="0.7" opacity="0.4" />
		<text
			x="90"
			y="68"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="6"
			fill="var(--ink)"
			opacity="0.6"
			font-weight="700">v1.1.0</text
		>

		<!-- v1.2 node -->
		<circle cx="154" cy="50" r="8" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.2" />
		<text
			x="154"
			y="53.5"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="5.5"
			font-weight="700"
			fill="var(--ink)">1.2</text
		>
		<text
			x="154"
			y="68"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="6"
			fill="var(--ink)"
			opacity="0.6"
			font-weight="700">v1.2.0</text
		>

		<!-- v2.0 node (hot / current) -->
		<circle cx="208" cy="50" r="11" fill="var(--yellow)" stroke="var(--ink)" stroke-width="1.4" />
		<text
			x="208"
			y="53.5"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="6.5"
			font-weight="700"
			fill="var(--ink)">2.0</text
		>
		<rect
			x="182"
			y="26"
			width="52"
			height="14"
			rx="7"
			fill="var(--yellow)"
			stroke="var(--ink)"
			stroke-width="0.9"
		/>
		<text
			x="208"
			y="36"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="5.5"
			font-weight="700"
			fill="var(--ink)">✦ current</text
		>
		<line x1="208" y1="40" x2="208" y2="39" stroke="var(--ink)" stroke-width="0.7" opacity="0.5" />
		<text
			x="208"
			y="68"
			text-anchor="middle"
			font-family="var(--mono)"
			font-size="6"
			fill="var(--ink)"
			opacity="0.85"
			font-weight="700">v2.0.0</text
		>

		<!-- Separator -->
		<line x1="10" y1="84" x2="230" y2="84" stroke="var(--ink)" stroke-width="0.5" opacity="0.2" />

		<!-- Two-column detail section -->
		<!-- Left: Security -->
		<text
			x="14"
			y="96"
			font-family="var(--mono)"
			font-size="6.5"
			fill="var(--ink)"
			opacity="0.55"
			letter-spacing="0.5">SECURITY</text
		>
		<rect
			x="14"
			y="100"
			width="100"
			height="52"
			rx="2"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="1"
		/>
		<!-- Shield icon (compact, top-left) -->
		<path
			d="M 28 108 L 20 111 L 20 117 Q 20 122 28 126 Q 36 122 36 117 L 36 111 Z"
			fill="none"
			stroke="var(--ink)"
			stroke-width="1.1"
			stroke-linejoin="round"
		/>
		<path
			d="M 24 116 L 27 119 L 32 113"
			stroke="var(--green)"
			stroke-width="1.3"
			fill="none"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<!-- Live status dot -->
		<circle cx="105" cy="110" r="2.5" fill="var(--green)" />
		<circle
			cx="105"
			cy="110"
			r="4.5"
			fill="none"
			stroke="var(--green)"
			stroke-width="0.8"
			opacity="0.4"
		/>
		<text
			x="42"
			y="111"
			font-family="var(--mono)"
			font-size="5"
			fill="var(--ink)"
			opacity="0.55"
			letter-spacing="0.3">POSTURE</text
		>
		<text
			x="42"
			y="119"
			font-family="var(--mono)"
			font-size="5.5"
			font-weight="700"
			fill="var(--ink)"
			letter-spacing="0.2">SECURE</text
		>
		<!-- Row 1: audit -->
		<path
			d="M 19 129 L 21.5 131 L 25.5 127"
			stroke="var(--green)"
			stroke-width="1.1"
			fill="none"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<text x="28" y="130.5" font-family="var(--mono)" font-size="5" fill="var(--ink)" opacity="0.7"
			>audit: <tspan font-weight="700" fill="var(--ink)" opacity="1">passed</tspan></text
		>
		<!-- Row 2: dependencies -->
		<path
			d="M 19 138 L 21.5 140 L 25.5 136"
			stroke="var(--green)"
			stroke-width="1.1"
			fill="none"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<text x="28" y="139.5" font-family="var(--mono)" font-size="5" fill="var(--ink)" opacity="0.7"
			>dependencies: <tspan font-weight="700" fill="var(--ink)" opacity="1">patched</tspan></text
		>
		<!-- Row 3: guardrails -->
		<path
			d="M 19 147 L 21.5 149 L 25.5 145"
			stroke="var(--green)"
			stroke-width="1.1"
			fill="none"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<text x="28" y="148.5" font-family="var(--mono)" font-size="5" fill="var(--ink)" opacity="0.7"
			>guardrails: <tspan font-weight="700" fill="var(--ink)" opacity="1">active</tspan></text
		>

		<!-- Right: Evolution / updates -->
		<text
			x="126"
			y="96"
			font-family="var(--mono)"
			font-size="6.5"
			fill="var(--ink)"
			opacity="0.55"
			letter-spacing="0.5">EVOLUTION</text
		>
		<rect
			x="126"
			y="100"
			width="104"
			height="52"
			rx="2"
			fill="var(--paper)"
			stroke="var(--ink)"
			stroke-width="1"
		/>
		{#each [{ y: 112, label: 'dep update', value: '0 out of date', pct: 88 }, { y: 122, label: 'perf audit', value: '100% target', pct: 94 }, { y: 132, label: 'feature ship', value: 'v2.0.0-rc1', pct: 72 }, { y: 142, label: 'proactive', value: 'active', pct: 100 }] as row (row.label)}
			<text
				x="132"
				y={row.y}
				font-family="var(--mono)"
				font-size="5.5"
				fill="var(--ink)"
				opacity="0.65">{row.label}</text
			>
			<text
				x="224"
				y={row.y}
				text-anchor="end"
				font-family="var(--mono)"
				font-size="4.5"
				font-weight="700"
				fill="var(--ink)">[{row.value}]</text
			>
			<rect
				x="132"
				y={row.y + 2}
				width="92"
				height="1.4"
				rx="0.5"
				fill="var(--paper)"
				stroke="var(--ink)"
				stroke-width="0.3"
				opacity="0.7"
			/>
			<rect
				x="132"
				y={row.y + 2}
				width={row.pct * 0.92}
				height="1.4"
				rx="0.5"
				fill={row.pct === 100 ? 'var(--yellow)' : 'var(--green)'}
				opacity="0.9"
			/>
		{/each}

		<!-- Footer terminal -->
		<rect x="10" y="162" width="220" height="30" rx="2" fill="var(--ink)" />
		<text
			x="16"
			y="176"
			font-family="var(--mono)"
			font-size="6.5"
			fill="var(--teal)"
			font-weight="700">$</text
		>
		<text x="24" y="176" font-family="var(--mono)" font-size="6.5" fill="var(--paper)"
			>npm audit fix && npm run deploy</text
		>
		<text x="16" y="188" font-family="var(--mono)" font-size="6" fill="var(--green)">✔</text>
		<text x="24" y="188" font-family="var(--mono)" font-size="6" fill="var(--paper)" opacity="0.8"
			>0 vulnerabilities <tspan fill="var(--paper)" opacity="0.55">[142 packages audited]</tspan
			></text
		>
	</svg>
{:else}
	<div class="aspect-6/5 w-full bg-ink"></div>
{/if}
