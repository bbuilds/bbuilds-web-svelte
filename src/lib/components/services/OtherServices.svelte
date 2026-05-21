<script lang="ts">
	import { SERVICES_INDEX, isLiveService } from '$lib/services';

	interface Props {
		currentSlug: string;
	}

	let { currentSlug }: Props = $props();

	const curIdx = $derived(SERVICES_INDEX.findIndex((s) => s.slug === currentSlug));
	const others = $derived(SERVICES_INDEX.filter((s) => s.slug !== currentSlug));
	const prev = $derived(
		SERVICES_INDEX[(curIdx - 1 + SERVICES_INDEX.length) % SERVICES_INDEX.length]
	);
	const next = $derived(SERVICES_INDEX[(curIdx + 1) % SERVICES_INDEX.length]);
</script>

<section class="other-svcs paper-bg">
	<div class="container">
		<div class="meta meta-dot other-svcs-eyebrow">// continue reading</div>
		<h2 class="other-svcs-title">
			The other <span class="scribble"
				>pillars
				<svg viewBox="0 0 200 22" preserveAspectRatio="none" aria-hidden="true">
					<path
						d="M2 14 C 40 4, 80 20, 120 10 S 180 16, 198 8"
						stroke="var(--yellow-bright)"
						stroke-width="8"
						fill="none"
						stroke-linecap="round"
					/>
				</svg>
			</span>.
		</h2>

		<ul class="other-svcs-list">
			{#each others as s (s.slug)}
				{@const live = isLiveService(s.slug)}
				<li>
					<a
						class="other-svc {!live ? 'other-svc--stub' : ''}"
						href={live ? `/services/${s.slug}` : undefined}
						aria-disabled={!live || undefined}
					>
						<span class="other-svc-n">{s.n}</span>
						<span class="other-svc-meta">
							<span class="other-svc-sub">{s.sub}</span>
							<span class="other-svc-title">{s.title}</span>
						</span>
						<span class="other-svc-arr" aria-hidden="true">→</span>
					</a>
				</li>
			{/each}
		</ul>

		<div class="other-svcs-pn">
			<a
				class="other-svcs-pn-link {!isLiveService(prev.slug) ? 'other-svcs-pn-link--stub' : ''}"
				href={isLiveService(prev.slug) ? `/services/${prev.slug}` : undefined}
				aria-disabled={!isLiveService(prev.slug) || undefined}
			>
				<span class="other-svcs-pn-label">← previous pillar</span>
				<span class="other-svcs-pn-title">{prev.n} · {prev.title}</span>
			</a>
			<a
				class="other-svcs-pn-link other-svcs-pn-link--right {!isLiveService(next.slug)
					? 'other-svcs-pn-link--stub'
					: ''}"
				href={isLiveService(next.slug) ? `/services/${next.slug}` : undefined}
				aria-disabled={!isLiveService(next.slug) || undefined}
			>
				<span class="other-svcs-pn-label">next pillar →</span>
				<span class="other-svcs-pn-title">{next.n} · {next.title}</span>
			</a>
		</div>
	</div>
</section>

<style>
	.other-svcs {
		padding: 5rem 0 6rem;
		position: relative;
		border-top: 1px solid var(--paper-line);
	}

	.meta {
		font-family: var(--mono);
		font-size: 0.8125rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--muted);
	}

	.meta-dot::before {
		content: '●';
		color: var(--yellow);
		margin-right: 0.5rem;
	}

	.other-svcs-eyebrow {
		margin-bottom: 1rem;
	}

	.other-svcs-title {
		margin-bottom: 3rem;
		font-size: clamp(2rem, 4vw, 3.25rem);
	}

	.scribble {
		position: relative;
		display: inline-block;
	}

	.scribble svg {
		position: absolute;
		left: -6%;
		right: -6%;
		bottom: -0.875rem;
		width: 112%;
		height: 0.875rem;
		overflow: visible;
	}

	.other-svcs-list {
		list-style: none;
		padding: 0;
		margin: 0 0 4rem;
		border-top: 1px solid var(--paper-line);
	}

	.other-svcs-list li {
		border-bottom: 1px solid var(--paper-line);
	}

	.other-svc {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: 1.25rem;
		padding: 1.5rem 0.5rem;
		text-decoration: none;
		color: var(--ink);
		transition:
			padding 0.3s ease,
			background 0.3s ease;
	}

	.other-svc:not(.other-svc--stub):hover {
		padding-left: 1.5rem;
		background: rgba(184, 130, 26, 0.08);
	}

	.other-svc--stub {
		opacity: 0.4;
		cursor: default;
		pointer-events: none;
	}

	.other-svc-n {
		font-family: var(--mono);
		font-size: 0.875rem;
		color: var(--muted);
		min-width: 2rem;
	}

	.other-svc:not(.other-svc--stub):hover .other-svc-n {
		color: var(--yellow);
	}

	.other-svc-meta {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.other-svc-sub {
		font-family: var(--mono);
		font-size: 0.6875rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--muted);
	}

	.other-svc-title {
		font-size: clamp(1.25rem, 2.4vw, 2rem);
		font-weight: 500;
		letter-spacing: -0.02em;
	}

	.other-svc-arr {
		font-family: var(--mono);
		font-size: 1.25rem;
		color: var(--muted);
		transition:
			transform 0.3s ease,
			color 0.3s ease;
	}

	.other-svc:not(.other-svc--stub):hover .other-svc-arr {
		color: var(--ink);
		transform: translateX(0.375rem);
	}

	.other-svcs-pn {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
		padding-top: 2rem;
		border-top: 1px dashed var(--paper-line);
	}

	@media (min-width: 48rem) {
		.other-svcs-pn {
			grid-template-columns: 1fr 1fr;
			gap: 2rem;
		}
	}

	.other-svcs-pn-link {
		text-decoration: none;
		color: inherit;
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
		padding: 1rem 0;
	}

	.other-svcs-pn-link--right {
		text-align: right;
		align-items: flex-end;
	}

	.other-svcs-pn-link--stub {
		opacity: 0.4;
		pointer-events: none;
		cursor: default;
	}

	.other-svcs-pn-label {
		font-family: var(--mono);
		font-size: 0.75rem;
		color: var(--muted);
		letter-spacing: 0.04em;
	}

	.other-svcs-pn-title {
		font-family: var(--sans);
		font-size: 1rem;
		font-weight: 500;
		color: var(--ink);
		transition: color 0.2s ease;
	}

	.other-svcs-pn-link:not(.other-svcs-pn-link--stub):hover .other-svcs-pn-title {
		color: var(--yellow);
	}
</style>
