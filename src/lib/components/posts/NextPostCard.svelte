<script lang="ts">
	interface PrevPost {
		tag: string;
		date: string;
		title: string;
		href: string;
	}

	interface Props {
		prev?: PrevPost;
	}

	let { prev }: Props = $props();
</script>

{#if prev}
	<div class="mt-14 border-t border-paper-line pt-10">
		<div class="mb-4 font-mono text-[0.6875rem] tracking-widest text-muted uppercase">
			continue reading
		</div>
		<a
			href={prev.href}
			class="group flex items-center gap-5 rounded-2xl border border-paper-line p-4.5 no-underline transition-[transform,border-color] duration-300 hover:translate-x-1.5 hover:border-ink"
		>
			<div class="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-ink"></div>
			<div class="min-w-0">
				<div class="mb-1 font-mono text-[0.625rem] tracking-[0.08em] text-muted uppercase">
					{prev.tag} · {prev.date}
				</div>
				<div class="text-[0.9375rem] leading-tight font-semibold tracking-[-0.015em] text-ink">
					{prev.title}
				</div>
			</div>
			<span
				class="ml-auto shrink-0 text-base text-muted transition-transform group-hover:translate-x-1"
				>→</span
			>
		</a>
	</div>
{/if}
