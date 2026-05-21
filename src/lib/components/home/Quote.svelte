<script lang="ts">
	const QUOTE = {
		body: "I've had the chance to work with Branden for 4+ years. Everything he touches is thoughtful, scalable, and intentionally set up to last. He's always thinking a few steps ahead, which means his work doesn't just solve the immediate need — it actually future-proofs whatever we're building so we're not backtracking later. Reliable, collaborative, and consistently raises the bar.",
		name: 'Kat Williams',
		role: 'Sr. Manager, Digital Experience at The Trade Desk',
		href: 'https://www.linkedin.com/in/branden-builds/details/recommendations/'
	} as const;
</script>

<section id="proof" class="paper-bg quote-section relative overflow-hidden pt-20 pb-18">
	<div class="container flex max-w-208 flex-col items-center text-center">
		<div
			class="mb-7 font-mono text-sm tracking-wider text-muted uppercase before:mr-2 before:text-yellow before:content-['●']"
		>
			// 04.proof
		</div>

		<figure class="m-0 flex flex-col items-center">
			<svg class="mb-2 block h-11 w-11" viewBox="0 0 60 60" aria-hidden="true">
				<path
					d="M 14 44 C 6 38, 6 26, 12 18 C 18 12, 26 10, 32 12 L 30 18 C 24 18, 18 22, 16 28 C 22 27, 28 32, 28 38 C 28 44, 22 48, 14 44 Z M 38 44 C 30 38, 30 26, 36 18 C 42 12, 50 10, 56 12 L 54 18 C 48 18, 42 22, 40 28 C 46 27, 52 32, 52 38 C 52 44, 46 48, 38 44 Z"
					fill="none"
					stroke="var(--color-ink)"
					stroke-width="1.4"
					stroke-linejoin="round"
					opacity="0.45"
				/>
			</svg>

			<blockquote
				cite={QUOTE.href}
				class="quote-body m-0 mx-auto max-w-184 p-0 font-mono text-[clamp(1rem,1.55vw,1.25rem)] leading-[1.7] text-ink-soft italic"
			>
				<p class="m-0">{QUOTE.body}</p>
			</blockquote>

			<figcaption
				class="mt-6 inline-flex flex-wrap items-center justify-center gap-2 font-mono text-[0.8125rem] text-charcoal"
			>
				<a
					class="quote-name font-semibold text-ink no-underline transition-opacity duration-200 ease-in-out hover:opacity-75 focus-visible:rounded-xs focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-yellow"
					href={QUOTE.href}
					target="_blank"
					rel="noopener noreferrer"
				>
					<span class="scribble">
						{QUOTE.name}
						<svg viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden="true">
							<path
								d="M2 9 C 40 2, 80 12, 120 6 S 180 10, 198 5"
								stroke="var(--color-yellow)"
								stroke-width="4"
								fill="none"
								stroke-linecap="round"
								opacity="0.9"
							/>
						</svg>
					</span>
				</a>
				<span class="opacity-50" aria-hidden="true">·</span>
				<cite class="not-italic">{QUOTE.role}</cite>
			</figcaption>
		</figure>
	</div>
</section>

<style>
	@keyframes quoteIn {
		from {
			opacity: 0;
			transform: translateY(0.5rem);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}

	.quote-body {
		animation: quoteIn 0.6s cubic-bezier(0.2, 0.7, 0.2, 1) both;
	}

	@media (prefers-reduced-motion: reduce) {
		.quote-body {
			animation: none;
		}
	}

	.quote-name :global(.scribble svg) {
		bottom: -0.5rem;
		height: 0.625rem;
	}
</style>
