<script lang="ts">
	import type { TocHeading } from '$lib/utils/format';

	interface Props {
		headings: TocHeading[];
	}

	let { headings }: Props = $props();

	let scrollY = $state(0);
	let innerHeight = $state(0);

	const active = $derived.by(() => {
		if (headings.length === 0) return null;
		const threshold = innerHeight * 0.3;
		let current: string | null = null;
		for (const { id } of headings) {
			const el = document.getElementById(id);
			if (el && el.offsetTop <= scrollY + threshold) {
				current = id;
			}
		}
		return current ?? headings[0]?.id ?? null;
	});
</script>

<svelte:window bind:scrollY bind:innerHeight />

{#if headings.length > 0}
	<nav aria-label="Table of contents">
		<div
			class="mb-3 font-mono text-[0.625rem] font-semibold tracking-widest text-ink-soft uppercase"
		>
			on this page
		</div>
		<ul
			class="relative before:absolute before:top-1.5 before:bottom-1.5 before:left-0 before:w-px before:bg-paper-line before:content-['']"
		>
			{#each headings as { id, text } (id)}
				<li>
					<a
						href="#{id}"
						class="-ml-px block border-l-2 py-1.75 pl-3.5 text-[0.8125rem] leading-snug no-underline transition-colors hover:text-ink {active ===
						id
							? 'border-yellow font-semibold text-ink'
							: 'border-transparent text-charcoal'}"
					>
						{text}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
{/if}
