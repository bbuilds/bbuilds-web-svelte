<script lang="ts">
	const SLOTS = [
		{ words: ['Svelte,', 'tears,', 'terminal,'] },
		{ words: ['Cloudflare,', 'coffee,', 'speed,'] },
		{ words: ['Claude', 'telemetry', 'skillz'] }
	] as const;

	const CYCLE_MS = 3200;
	const DURATION_MS = 320;
	const STAGGER_BUDGET_MS = 180;
	const EASING = 'cubic-bezier(0.65, 0, 0.35, 1)';

	let slot0: HTMLElement;
	let slot1: HTMLElement;
	let slot2: HTMLElement;

	function staggerFor(length: number): number {
		return Math.min(STAGGER_BUDGET_MS / Math.max(length - 1, 1), 35);
	}

	function buildChars(word: string, startY: string): HTMLSpanElement[] {
		return word.split('').map((letter) => {
			const span = document.createElement('span');
			span.className = 'bw-char';
			span.textContent = letter;
			span.style.transform = `translateY(${startY})`;
			return span;
		});
	}

	function swapWord(
		el: HTMLElement,
		nextWord: string,
		outChars: HTMLSpanElement[]
	): HTMLSpanElement[] {
		const outStagger = staggerFor(outChars.length);
		const inStagger = staggerFor(nextWord.length);
		const outTotal = (outChars.length - 1) * outStagger + DURATION_MS;

		outChars.forEach((char, i) => {
			setTimeout(() => {
				char.style.transition = `transform ${DURATION_MS}ms ${EASING}`;
				char.style.transform = 'translateY(-110%)';
			}, i * outStagger);
		});

		const widthDelay = Math.max(DURATION_MS * 0.45, 120);
		setTimeout(() => {
			el.style.width = `${nextWord.length}ch`;
		}, widthDelay);

		const inChars = buildChars(nextWord, '110%');
		inChars.forEach((c) => el.appendChild(c));
		const inStart = widthDelay + 40;

		requestAnimationFrame(() => {
			inChars.forEach((char, i) => {
				setTimeout(
					() => {
						char.style.transition = `transform ${DURATION_MS}ms ${EASING}`;
						char.style.transform = 'translateY(0)';
					},
					inStart + i * inStagger
				);
			});
		});

		setTimeout(() => {
			outChars.forEach((c) => c.remove());
		}, outTotal + 60);

		return inChars;
	}

	$effect(() => {
		const els = [slot0, slot1, slot2];
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		const timeoutIds: ReturnType<typeof setTimeout>[] = [];
		const intervalIds: ReturnType<typeof setInterval>[] = [];

		function startAnimations() {
			if (mq.matches) return;

			SLOTS.forEach((slotDef, i) => {
				const el = els[i];
				if (!el) return;

				el.innerHTML = '';
				el.style.width = `${slotDef.words[0].length}ch`;

				let currentIndex = 0;
				let currentChars = buildChars(slotDef.words[0], '0');
				currentChars.forEach((c) => el.appendChild(c));

				const tid = setTimeout(
					() => {
						const iid = setInterval(() => {
							currentIndex = (currentIndex + 1) % slotDef.words.length;
							currentChars = swapWord(el, slotDef.words[currentIndex], currentChars);
						}, CYCLE_MS);
						intervalIds.push(iid);
					},
					CYCLE_MS + i * 600
				);

				timeoutIds.push(tid);
			});
		}

		function cleanup() {
			timeoutIds.splice(0).forEach(clearTimeout);
			intervalIds.splice(0).forEach(clearInterval);
		}

		function handleMotionChange() {
			cleanup();
			SLOTS.forEach((slotDef, i) => {
				const el = els[i];
				if (!el) return;
				el.innerHTML = '';
				el.style.width = `${slotDef.words[0].length}ch`;
				el.textContent = slotDef.words[0];
			});
			startAnimations();
		}

		mq.addEventListener('change', handleMotionChange);
		startAnimations();

		return () => {
			cleanup();
			mq.removeEventListener('change', handleMotionChange);
		};
	});
</script>

<footer class="border-t border-paper-line pt-6 text-center">
	<div class="container">
		<div class="flex flex-col items-center gap-3">
			<a
				href="/"
				aria-label="Branden Builds"
				class="flex items-center gap-2 font-mono font-bold tracking-tight text-ink no-underline"
			>
				<svg
					class="h-5 w-auto fill-current"
					viewBox="0 0 178.565 291.148"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
					focusable="false"
				>
					<rect width="33.422" height="145.57"></rect>
					<rect width="78.641" height="78.641" transform="translate(67.079 34)"></rect>
					<path
						d="M5017.408,471.579H4905.343V617.148h145.486V471.579Zm0,112.147h-78.642V505h78.642Z"
						transform="translate(-4872.264 -326)"
					></path>
				</svg>
				<span>BrandenBuilds<span class="text-teal">.</span></span>
			</a>

			<p class="built-with flex items-center gap-1">
				<span>&gt; built with </span><span
					class="bw-slot"
					bind:this={slot0}
					aria-live="polite"
					style="width: {SLOTS[0].words[0].length}ch">{SLOTS[0].words[0]}</span
				><span
					class="bw-slot"
					bind:this={slot1}
					aria-live="polite"
					style="width: {SLOTS[1].words[0].length}ch">{SLOTS[1].words[0]}</span
				><span> and </span><span
					class="bw-slot"
					bind:this={slot2}
					aria-live="polite"
					style="width: {SLOTS[2].words[0].length}ch">{SLOTS[2].words[0]}</span
				>
			</p>

			<p class="meta">
				<a href="/sitemap.xml" class="sitemap-link">/sitemap.xml</a>
				<span aria-hidden="true"> · </span>
				<span>© 2026</span>
			</p>
		</div>
	</div>
</footer>

<style>
	footer {
		padding-bottom: 1.5rem;
	}

	@media (max-width: 47.9375rem) {
		footer {
			padding-bottom: calc(1.5rem + 4.5rem + env(safe-area-inset-bottom));
		}
	}

	.built-with {
		font-family: var(--mono);
		font-size: 0.8125rem;
		color: var(--muted);
		line-height: 1.6;
		margin: 0;
	}

	.bw-slot {
		display: inline-block;
		overflow: hidden;
		vertical-align: bottom;
		height: 1.6em;
		line-height: 1.6em;
		transition: width 360ms cubic-bezier(0.65, 0, 0.35, 1);
		white-space: nowrap;
	}

	@media (prefers-reduced-motion: reduce) {
		.bw-slot {
			transition: none;
		}
	}

	:global(.bw-char) {
		display: inline-block;
		will-change: transform;
	}

	.meta {
		font-size: 0.75rem;
		color: var(--muted);
		margin: 0;
	}

	.sitemap-link {
		color: var(--muted);
		text-decoration: none;
	}

	.sitemap-link:hover {
		color: var(--ink);
	}
</style>
