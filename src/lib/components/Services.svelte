<script lang="ts">
	import type { ISbStoryData } from '@storyblok/js';
	import type {
		StoryblokHomePage,
		StoryblokRichtext,
		StoryblokServicesTemplate
	} from '$lib/types/storyblok';

	interface Props {
		content?: StoryblokHomePage;
	}
	let { content }: Props = $props();

	type Item = { b: string; t: string };
	type Chapter = {
		n: string;
		title: string;
		items: ReadonlyArray<Item>;
	};

	function parseListItems(doc: StoryblokRichtext | undefined): Item[] {
		const list = doc?.content?.find((n: StoryblokRichtext) => n.type === 'bullet_list');
		if (!list?.content) return [];
		return list.content
			.filter((li: StoryblokRichtext) => li.type === 'list_item')
			.map((li: StoryblokRichtext): Item => {
				const paragraph = li.content?.find((n: StoryblokRichtext) => n.type === 'paragraph');
				let bold = '';
				let plain = '';
				for (const node of paragraph?.content ?? []) {
					if (node.type !== 'text' || !node.text) continue;
					if (node.marks?.some((m: StoryblokRichtext) => m.type === 'bold')) bold += node.text;
					else plain += node.text;
				}
				return { b: bold.replace(/\.\s*$/, '').trim(), t: plain.trim() };
			})
			.filter((it: Item) => it.b || it.t);
	}

	const SERVICES = [
		{
			n: '01',
			title: 'Discovery & Transformation',
			items: [
				{
					b: 'AI Strategy & Roadmap Discovery',
					t: 'Precision auditing to identify high-leverage AI integration points. We skip the hype and map out the technical path from manual friction to intelligent automation.'
				},
				{
					b: 'Systems Architecture & Audits',
					t: "Whether untangling legacy spaghetti or architecting greenfield infrastructure, we build for the scale you're headed toward. Structural integrity is non-negotiable."
				},
				{
					b: 'Mixed-methods research',
					t: 'Merging quantitative data with qualitative insights to reveal high-fidelity opportunities. We find the "why" behind the metrics to inform every engineering decision.'
				},
				{
					b: 'Product innovation',
					t: 'Breathing production-grade life into experimental ideas. We blend technical foresight with business logic to carve out your niche in the digital era.'
				}
			]
		},
		{
			n: '02',
			title: 'Product Engineering',
			items: [
				{
					b: 'Frontend Development',
					t: 'High-performance TypeScript applications built with "nerdy" UX precision. We deliver lag-free, visually stunning interfaces across React, Next.js, and beyond.'
				},
				{
					b: 'Backend & API Development',
					t: 'Hardened Node.js and PHP services with clean separation of concerns. Robust, well-documented APIs that your frontend—and your AI agents—can actually depend on.'
				},
				{
					b: 'Headless CMS Implementation',
					t: 'Modular content infrastructure via Sanity, Contentful, or Strapi. We build flexible modeling systems that empower creators without compromising the engineering.'
				},
				{
					b: 'E-commerce & Point of Sale',
					t: 'Custom Stripe-powered engines and unified POS systems. We close the loop between digital and physical commerce, engineered to handle every edge case.'
				},
				{
					b: 'Mobile Deployment',
					t: 'Cross-platform iOS and Android with native-level polish. We build mobile products that feel like high-performance hardware, not a web app in a costume.'
				}
			]
		},
		{
			n: '03',
			title: 'Applied Intelligence',
			items: [
				{
					b: 'AI Strategy & Integration',
					t: 'We audit your stack to find genuine leverage, not pitch-deck fluff. You get a concrete execution plan for deploying intelligence where it moves the needle.'
				},
				{
					b: 'Retrieval-Augmented Generation (RAG) & Knowledge Systems',
					t: 'Transforming institutional data into a grounded intelligence layer. Your models stop hallucinating and start answering with cited, queryable precision.'
				},
				{
					b: 'Agentic Workflows',
					t: 'Moving beyond chatbots to autonomous systems. We build agents that execute multi-step tasks, interact with your APIs, and fail gracefully when necessary.'
				},
				{
					b: 'Model Context Protocol',
					t: 'Custom MCP servers that give your AI systems live, proprietary context. We extend what language models can do without the overhead of retraining.'
				},
				{
					b: 'Fix AI Slop',
					t: 'Hardening "vibe-coded" prototypes into enterprise-grade reality. We audit the architecture, close security gaps, and add the observability needed to survive real users.'
				}
			]
		},
		{
			n: '04',
			title: 'Identity & Experience',
			items: [
				{
					b: 'Brand Strategy & Positioning',
					t: 'Clarity before creativity. We engineer a memorable position in the market that is honest enough to hold up and specific enough to scale.'
				},
				{
					b: 'Visual Identity',
					t: 'A coherent system of typography, motion, and design resolved for the digital-first context. We build brand assets that live in code, not just in PDFs.'
				},
				{
					b: 'Content strategy and information architecture (IA)',
					t: 'Organizing the digital landscape for clear wayfinding. We treat information architecture as the foundational infrastructure of the user experience.'
				},
				{
					b: 'User Experience (UX)',
					t: "High-fidelity design meets technical precision. To us, UX is a cross-disciplinary commitment to making the interface feel 'clean and sexy' at every touchpoint."
				},
				{
					b: 'Design Systems & Component Libraries',
					t: 'Atomized design as infrastructure. We deliver tokens, components, and documentation that allow your engineering team to build with total confidence.'
				}
			]
		},
		{
			n: '05',
			title: 'Continuity & Growth',
			items: [
				{
					b: 'Generative Engine Optimization (GEO)',
					t: 'Structuring your brand signals so that AI systems—ChatGPT, Perplexity, Gemini—surface you as the definitive authority in the next era of search.'
				},
				{
					b: 'Technical SEO',
					t: 'Deep indexability work and schema markup that most agencies skip. We make your content legible to both the LLMs and the humans they direct to you.'
				},
				{
					b: 'Core Web Vitals & Performance',
					t: 'Targeted engineering for speed and efficiency. We treat Lighthouse scores as a performance metric and a core part of the user experience.'
				},
				{
					b: 'Maintenance & Evolution',
					t: 'Strategic partnership over help-desk support. We keep your product performant, secure, and evolving alongside your business goals.'
				}
			]
		}
	] as const satisfies ReadonlyArray<Chapter>;

	const chapters = $derived.by<ReadonlyArray<Chapter>>(() => {
		const resolved = (content?.featured_services ?? []).filter(
			(s): s is ISbStoryData<StoryblokServicesTemplate> => typeof s !== 'string'
		);
		if (resolved.length === 0) return SERVICES;
		return resolved.map((story, i) => ({
			n: String(i + 1).padStart(2, '0'),
			title: story.content.card_title ?? '',
			items: parseListItems(story.content.card_list_items)
		}));
	});

	let openIdx = $state(0);

	function toggle(i: number) {
		openIdx = openIdx === i ? -1 : i;
	}
</script>

<section id="services" class="paper-bg relative pt-30 pb-25">
	<div class="container">
		<div class="mb-12">
			<div
				class="font-mono text-sm tracking-wider text-muted uppercase before:mr-2 before:text-yellow before:content-['●']"
			>
				// 02.services
			</div>
			<h2 class="mt-2">Diving deep into digital.</h2>
			<p class="mt-3.5 max-w-140 font-mono text-[0.8125rem] leading-[1.7] text-charcoal">
				Together, we bridge the gap between creative discovery and high-performance engineering to
				scale your vision. Whether we're hardening a single pillar or architecting your entire
				stack, we ensure every detail is hardened, polished, and resilient.
			</p>
		</div>

		<div class="border-t border-ink">
			{#each chapters as s, i (s.n)}
				{@const isOpen = openIdx === i}
				{@const bodyId = `chapter-body-${s.n}`}
				{@const titleId = `chapter-title-${s.n}`}
				<div class="relative overflow-hidden border-b border-ink">
					<button
						type="button"
						onclick={() => toggle(i)}
						aria-expanded={isOpen}
						aria-controls={bodyId}
						class="grid w-full cursor-pointer grid-cols-[3.75rem_1fr_auto] items-center gap-6 px-1 py-4.5 text-left transition-[padding,background] duration-350 ease-in-out hover:bg-yellow/12 hover:pl-7 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ink aria-expanded:pb-2 md:grid-cols-[5rem_1fr_auto] md:px-2 md:py-6.5 md:aria-expanded:pb-2"
					>
						<span class="font-mono text-[0.875rem] text-muted">{s.n}</span>
						<h3 id={titleId} class="text-[clamp(1.75rem,3vw,3rem)] font-medium tracking-[-0.02em]">
							{s.title}
						</h3>
						<span aria-hidden="true" class="font-mono text-[0.75rem] text-muted">
							[{isOpen ? '-' : '+'}]
						</span>
					</button>

					<div
						id={bodyId}
						role="region"
						aria-labelledby={titleId}
						data-open={isOpen}
						class="chapter-body px-2"
					>
						<div>
							<div class="grid grid-cols-1 gap-4.5 pt-2 pb-8 md:grid-cols-2 md:pl-26">
								{#each s.items as it (it.b)}
									<div
										class="grid grid-cols-[1.125rem_1fr] gap-2.5 font-mono text-[0.78125rem] leading-[1.6] text-body"
									>
										<svg
											aria-hidden="true"
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
											class="mt-px h-4.5 w-4.5 shrink-0 text-charcoal"
										>
											<path
												d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"
											/>
											<path
												d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"
											/>
											<path
												d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"
											/>
										</svg>
										<span><strong class="text-ink">{it.b}.</strong> {it.t}</span>
									</div>
								{/each}
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.chapter-body {
		display: grid;
		grid-template-rows: 0fr;
		transition:
			grid-template-rows 0.5s ease,
			opacity 0.35s ease;
		opacity: 0;
	}
	.chapter-body[data-open='true'] {
		grid-template-rows: 1fr;
		opacity: 1;
	}
	.chapter-body > div {
		overflow: hidden;
		min-height: 0;
	}
</style>
