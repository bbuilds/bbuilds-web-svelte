<script lang="ts">
	import ScribbleUnderline from '$lib/components/svgs/illustrations/ScribbleUnderline.svelte';
	import QuoteMark from '$lib/components/svgs/icons/QuoteMark.svelte';
	import Eyebrow from '$lib/components/Eyebrow.svelte';

	const QUOTE = {
		body: "I've had the chance to work with Branden for 4+ years. Everything he touches is thoughtful, scalable, and intentionally set up to last. He's always thinking a few steps ahead, which means his work doesn't just solve the immediate need — it actually future-proofs whatever we're building so we're not backtracking later. Reliable, collaborative, and consistently raises the bar.",
		name: 'Kat Williams',
		role: 'Sr. Manager, Digital Experience at The Trade Desk',
		href: 'https://www.linkedin.com/in/branden-builds/details/recommendations/'
	} as const;
</script>

<section id="proof" class="paper-bg quote-section relative overflow-hidden pt-20 pb-18">
	<div class="container flex max-w-208 flex-col items-center text-center">
		<Eyebrow text="// 04.proof" class="mb-7 text-sm" />
		<h2 class="sr-only">What people are saying.</h2>

		<figure class="m-0 flex flex-col items-center">
			<QuoteMark class="mb-2 block h-11 w-11" />

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
						{QUOTE.name}<ScribbleUnderline />
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
