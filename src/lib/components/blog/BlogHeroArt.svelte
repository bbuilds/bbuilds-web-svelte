<script lang="ts">
	const vLines = [52, 104, 156, 208, 260, 312, 364, 416, 468];
	const hLines = [88, 176, 264];

	const leftNodes = [
		{ y: 68, label: 'routes', c: '#8a8676', filled: false },
		{ y: 114, label: 'posts', c: '#b8821a', filled: true },
		{ y: 160, label: 'media', c: '#8a8676', filled: false },
		{ y: 206, label: 'styles', c: '#8a8676', filled: false }
	];

	const leftConnectors = [
		{ y1: 83, y2: 168, dashed: true, yellow: false },
		{ y1: 129, y2: 176, dashed: false, yellow: true },
		{ y1: 175, y2: 182, dashed: true, yellow: false },
		{ y1: 221, y2: 188, dashed: true, yellow: false }
	];

	const rightNodes = [
		{ y: 68, label: 'build', c: '#b8821a', filled: true },
		{ y: 114, label: 'serve', c: '#8a8676', filled: false },
		{ y: 160, label: 'deploy', c: '#7ba87b', filled: false },
		{ y: 206, label: 'cache', c: '#8a8676', filled: false }
	];

	const rightConnectors = [
		{ y1: 168, y2: 83, dashed: false, yellow: true },
		{ y1: 176, y2: 129, dashed: true, yellow: false },
		{ y1: 182, y2: 175, dashed: true, yellow: false },
		{ y1: 188, y2: 221, dashed: true, yellow: false }
	];
</script>

<svg viewBox="0 0 520 352" style="width:100%;height:100%;display:block" aria-hidden="true">
	<defs>
		<radialGradient id="hbg" cx="50%" cy="50%" r="70%">
			<stop offset="0%" stop-color="#212121" />
			<stop offset="100%" stop-color="#0e0e0e" />
		</radialGradient>
	</defs>
	<rect width="520" height="352" fill="url(#hbg)" />

	<!-- subtle grid -->
	<g stroke="rgba(1,253,246,0.04)" stroke-width="1">
		{#each vLines as x (x)}
			<line x1={x} y1="0" x2={x} y2="352" />
		{/each}
		{#each hLines as y (y)}
			<line x1="0" y1={y} x2="520" y2={y} />
		{/each}
	</g>

	<!-- center hub -->
	<rect
		x="210"
		y="142"
		width="100"
		height="68"
		rx="4"
		fill="rgba(1,253,246,0.06)"
		stroke="#01fdf6"
		stroke-width="1.5"
	/>
	<text
		x="260"
		y="170"
		text-anchor="middle"
		fill="#01fdf6"
		font-family="JetBrains Mono,monospace"
		font-size="8.5"
		letter-spacing="1.5">SCHEMA</text
	>
	<text
		x="260"
		y="184"
		text-anchor="middle"
		fill="rgba(1,253,246,0.4)"
		font-family="JetBrains Mono,monospace"
		font-size="7">node_01</text
	>
	<text
		x="260"
		y="198"
		text-anchor="middle"
		fill="rgba(1,253,246,0.25)"
		font-family="JetBrains Mono,monospace"
		font-size="6.5">content · posts · seo</text
	>

	<!-- left column -->
	{#each leftNodes as { y, label, c, filled } (label)}
		<g>
			<rect
				x="60"
				{y}
				width="62"
				height="30"
				rx="3"
				fill={filled ? 'rgba(255,205,103,0.1)' : 'none'}
				stroke={filled ? '#ffcd67' : '#01fdf6'}
				stroke-width="1.2"
				opacity="0.8"
			/>
			<text
				x="91"
				y={y + 19}
				text-anchor="middle"
				fill={c}
				font-family="JetBrains Mono,monospace"
				font-size="7"
				letter-spacing="0.5">{label}</text
			>
		</g>
	{/each}

	<!-- left connectors -->
	{#each leftConnectors as { y1, y2, dashed, yellow }, i (i)}
		<line
			x1="122"
			{y1}
			x2="210"
			{y2}
			stroke={yellow ? '#ffcd67' : '#01fdf6'}
			stroke-width="1"
			stroke-dasharray={dashed ? '4 3' : undefined}
			opacity="0.35"
		/>
	{/each}

	<!-- right column -->
	{#each rightNodes as { y, label, c, filled } (label)}
		<g>
			<rect
				x="398"
				{y}
				width="62"
				height="30"
				rx="3"
				fill={filled ? 'rgba(255,205,103,0.1)' : 'none'}
				stroke={filled ? '#ffcd67' : '#01fdf6'}
				stroke-width="1.2"
				opacity="0.8"
			/>
			<text
				x="429"
				y={y + 19}
				text-anchor="middle"
				fill={c}
				font-family="JetBrains Mono,monospace"
				font-size="7"
				letter-spacing="0.5">{label}</text
			>
		</g>
	{/each}

	<!-- right connectors -->
	{#each rightConnectors as { y1, y2, dashed, yellow }, i (i)}
		<line
			x1="310"
			{y1}
			x2="398"
			{y2}
			stroke={yellow ? '#ffcd67' : '#01fdf6'}
			stroke-width="1"
			stroke-dasharray={dashed ? '4 3' : undefined}
			opacity="0.35"
		/>
	{/each}

	<!-- top node — cms -->
	<rect
		x="220"
		y="36"
		width="80"
		height="34"
		rx="3"
		fill="rgba(255,205,103,0.09)"
		stroke="#ffcd67"
		stroke-width="1.4"
		opacity="0.85"
	/>
	<text
		x="260"
		y="52"
		text-anchor="middle"
		fill="#b8821a"
		font-family="JetBrains Mono,monospace"
		font-size="8"
		letter-spacing="1">cms</text
	>
	<text
		x="260"
		y="63"
		text-anchor="middle"
		fill="rgba(184,130,26,0.5)"
		font-family="JetBrains Mono,monospace"
		font-size="6.5">storyblok</text
	>
	<line x1="260" y1="70" x2="260" y2="142" stroke="#ffcd67" stroke-width="1" opacity="0.35" />

	<!-- bottom node — seo -->
	<rect
		x="220"
		y="282"
		width="80"
		height="34"
		rx="3"
		fill="none"
		stroke="#01fdf6"
		stroke-width="1.2"
		opacity="0.6"
	/>
	<text
		x="260"
		y="298"
		text-anchor="middle"
		fill="#8a8676"
		font-family="JetBrains Mono,monospace"
		font-size="8"
		letter-spacing="1">seo</text
	>
	<text
		x="260"
		y="309"
		text-anchor="middle"
		fill="rgba(138,134,118,0.5)"
		font-family="JetBrains Mono,monospace"
		font-size="6.5">structured</text
	>
	<line
		x1="260"
		y1="282"
		x2="260"
		y2="210"
		stroke="#01fdf6"
		stroke-width="1"
		stroke-dasharray="4 3"
		opacity="0.3"
	/>

	<!-- leaf nodes — corners -->
	<g fill="#01fdf6" opacity="0.45">
		<rect x="24" y="64" width="12" height="12" rx="1" />
		<rect x="484" y="64" width="12" height="12" rx="1" />
		<rect x="24" y="224" width="12" height="12" rx="1" />
		<rect x="484" y="224" width="12" height="12" rx="1" />
	</g>
	<line x1="36" y1="70" x2="60" y2="83" stroke="#01fdf6" stroke-width="0.75" opacity="0.25" />
	<line x1="484" y1="70" x2="460" y2="83" stroke="#01fdf6" stroke-width="0.75" opacity="0.25" />
	<line x1="36" y1="230" x2="60" y2="221" stroke="#01fdf6" stroke-width="0.75" opacity="0.25" />
	<line x1="484" y1="230" x2="460" y2="221" stroke="#01fdf6" stroke-width="0.75" opacity="0.25" />

	<!-- corner frame brackets -->
	<g stroke="#01fdf6" stroke-width="1.5" fill="none" opacity="0.55" stroke-linecap="square">
		<path d="M 10 22 L 10 10 L 22 10" />
		<path d="M 510 22 L 510 10 L 498 10" />
		<path d="M 10 330 L 10 342 L 22 342" />
		<path d="M 510 330 L 510 342 L 498 342" />
	</g>
</svg>
