<script lang="ts">
	const SERVICES = [
		{
			n: '01',
			title: 'Discovery & Architecture',
			sub: 'The Foundation',
			items: [
				{
					b: 'AI Strategy & Roadmap Discovery',
					t: 'Auditing workflows to find high-impact AI integration points.'
				},
				{
					b: 'Systems Architecture & Audits',
					t: 'Mapping scalable infrastructure, fixing spaghetti codebases.'
				},
				{
					b: 'Database Design',
					t: 'Relational (PostgreSQL) and Vector (Pinecone / Milvus) modeling.'
				},
				{
					b: 'Security & Scalability Consulting',
					t: 'Building the foundation so the vision can scale.'
				}
			]
		},
		{
			n: '02',
			title: 'Product Engineering',
			sub: 'The Build',
			items: [
				{
					b: 'Frontend Development',
					t: 'High-performance React / Next.js apps with nerdy UX details.'
				},
				{
					b: 'Backend & API Development',
					t: 'Robust Node.js / Python services and third-party integrations.'
				},
				{
					b: 'Headless CMS Implementation',
					t: 'Flexible content modeling via Sanity, Contentful, Strapi.'
				},
				{ b: 'E-commerce & Point of Sale', t: 'Custom Stripe + unified POS / online systems.' },
				{ b: 'DevOps & Deployment', t: 'Automated CI/CD via Vercel, AWS, GitHub Actions.' }
			]
		},
		{
			n: '03',
			title: 'Applied Intelligence',
			sub: 'The Edge',
			items: [
				{
					b: 'Retrieval-Augmented Generation',
					t: 'Custom knowledge bases and model fine-tuning.'
				},
				{
					b: 'Agentic Workflows',
					t: 'Chatbots and support systems that actually perform tasks.'
				},
				{ b: 'Production-Ready AI', t: 'Hardening vibe-coded prototypes for enterprise use.' },
				{ b: 'Model Context Protocol', t: 'Custom tools that extend LLM capabilities.' },
				{ b: 'Semantic Search', t: 'Moving beyond keywords to intent-based discovery.' }
			]
		},
		{
			n: '04',
			title: 'Identity & Experience',
			sub: 'The Interface',
			items: [
				{
					b: 'Brand Strategy & Positioning',
					t: 'Market research and competitive differentiation.'
				},
				{ b: 'Visual Identity', t: 'Logos, typography, UX-first design systems.' },
				{
					b: 'High-Fidelity Prototyping',
					t: 'Validating ideas with interactive mocks first.'
				},
				{ b: 'Interactive Design', t: 'Micro-interactions and motion that enhance the UX.' }
			]
		},
		{
			n: '05',
			title: 'Continuity & Growth',
			sub: 'The Lifecycle',
			items: [
				{
					b: 'Generative Engine Optimization',
					t: 'Ensuring your brand is cited and surfaced by LLMs.'
				},
				{
					b: 'Technical SEO',
					t: 'Local, Maps, deep structured content + schema markup.'
				},
				{
					b: 'Core Web Vitals & Performance',
					t: 'Targeted optimization for speed and lighthouse.'
				},
				{
					b: 'Maintenance & Evolution',
					t: 'Ongoing support and iterative feature development.'
				}
			]
		}
	] as const;

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
			{#each SERVICES as s, i (s.n)}
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
