<script lang="ts">
	import type { RichTextNode } from '$lib/types/post';
	import RichTextRenderer from './RichTextRenderer.svelte';

	interface Props {
		node: RichTextNode;
	}

	let { node }: Props = $props();

	// Mirrors Storyblok's splitTableRows: only leading rows made entirely of tableHeader cells
	// belong in <thead>.
	const isHeaderRow = (row: RichTextNode): boolean =>
		!!row.content?.length && row.content.every((cell) => cell.type === 'tableHeader');

	const rows = $derived(node.content ?? []);
	const headerEnd = $derived.by(() => {
		const firstBody = rows.findIndex((row) => !isHeaderRow(row));
		return firstBody === -1 ? rows.length : firstBody;
	});
	const headerRows = $derived(rows.slice(0, headerEnd));
	const bodyRows = $derived(rows.slice(headerEnd));

	// Storyblok omits span attrs at their default of 1.
	const span = (value: unknown): number | undefined =>
		typeof value === 'number' && value > 1 ? value : undefined;

	const bg = (cell: RichTextNode): string | undefined => {
		const value = cell.attrs?.backgroundColor;
		return typeof value === 'string' && value ? value : undefined;
	};

	const isHeader = (cell: RichTextNode): boolean => cell.type === 'tableHeader';
</script>

{#snippet tableCell(cell: RichTextNode, scope: 'col' | 'row')}
	<svelte:element
		this={isHeader(cell) ? 'th' : 'td'}
		scope={isHeader(cell) ? scope : undefined}
		colspan={span(cell.attrs?.colspan)}
		rowspan={span(cell.attrs?.rowspan)}
		style:background-color={bg(cell)}
		class={[
			'border-b border-paper-line px-4 py-3 align-top',
			isHeader(cell) &&
				'font-mono text-[0.75rem] font-semibold tracking-[0.06em] text-ink uppercase'
		]}
	>
		<RichTextRenderer nodes={cell.content ?? []} />
	</svelte:element>
{/snippet}

<div class="rt-table my-8 overflow-x-auto rounded-lg border border-paper-line">
	<table
		class="min-w-full border-collapse text-left font-sans text-[0.9375rem] leading-[1.6] text-body"
	>
		{#if headerRows.length}
			<thead class="bg-paper-2">
				{#each headerRows as row, r (r)}
					<tr>
						{#each row.content ?? [] as cell, c (c)}
							{@render tableCell(cell, 'col')}
						{/each}
					</tr>
				{/each}
			</thead>
		{/if}
		{#if bodyRows.length}
			<tbody>
				{#each bodyRows as row, r (r)}
					<tr>
						{#each row.content ?? [] as cell, c (c)}
							{@render tableCell(cell, 'row')}
						{/each}
					</tr>
				{/each}
			</tbody>
		{/if}
	</table>
</div>

<style>
	/* Compact the renderer's article-sized block styles inside cells. */
	.rt-table :global(tbody tr:last-child > *) {
		border-bottom: 0;
	}

	.rt-table :global(p) {
		margin: 0 0 0.5rem;
		font-size: inherit;
		line-height: inherit;
	}

	.rt-table :global(:is(th, td) > :last-child) {
		margin-bottom: 0;
	}

	.rt-table :global(ul),
	.rt-table :global(ol) {
		margin-bottom: 0;
		gap: 0.25rem;
	}

	.rt-table :global(li) {
		font-size: inherit;
		line-height: inherit;
	}
</style>
