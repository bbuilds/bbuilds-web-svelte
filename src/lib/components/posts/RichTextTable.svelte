<script lang="ts">
	import type { RichTextMark, RichTextNode } from '$lib/types/post';
	import RichTextTableRenderer from './RichTextTableRenderer.svelte';

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

	const textNodes = (n: RichTextNode): RichTextNode[] =>
		n.type === 'text' ? [n] : (n.content ?? []).flatMap(textNodes);

	const isTextStyle = (mark: RichTextMark): mark is Extract<RichTextMark, { type: 'textStyle' }> =>
		mark.type === 'textStyle';

	// RichTextTableRenderer drops the <strong>/<span> wrappers for these marks, so their styling
	// lands on the cell instead: if any text in the cell carries the mark, the whole cell gets it.
	const cellMarks = (cell: RichTextNode) => {
		const marks = textNodes(cell).flatMap((n) => n.marks ?? []);
		return {
			bold: marks.some((m) => m.type === 'bold'),
			underline: marks.some((m) => m.type === 'underline'),
			color: marks.find(isTextStyle)?.attrs?.color || undefined
		};
	};
</script>

{#snippet tableCell(cell: RichTextNode, scope: 'col' | 'row')}
	{@const marks = cellMarks(cell)}
	<svelte:element
		this={isHeader(cell) ? 'th' : 'td'}
		scope={isHeader(cell) ? scope : undefined}
		colspan={span(cell.attrs?.colspan)}
		rowspan={span(cell.attrs?.rowspan)}
		style:background-color={bg(cell)}
		style:color={marks.color}
		class={[
			'border-b border-paper-line px-4 py-3 align-top',
			isHeader(cell) && 'font-mono text-[0.75rem] tracking-[0.06em] text-ink uppercase',
			marks.bold ? 'font-bold text-ink' : isHeader(cell) && 'font-semibold',
			marks.underline && 'underline underline-offset-[0.2em]'
		]}
	>
		<RichTextTableRenderer nodes={cell.content ?? []} />
	</svelte:element>
{/snippet}

<div class="my-8 overflow-x-auto rounded-lg border border-paper-line">
	<table
		class="rt-table w-full min-w-xl border-collapse text-left font-sans text-[0.9375rem] leading-[1.6] text-body"
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
	.rt-table :global(tbody tr:last-child > *) {
		border-bottom: 0;
	}
</style>
