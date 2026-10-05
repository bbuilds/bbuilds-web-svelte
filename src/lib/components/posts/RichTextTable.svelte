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

	// A textStyle can carry only id/class, so take the first one that sets a color.
	const runColor = (run: RichTextNode): string | undefined =>
		(run.marks ?? [])
			.filter(isTextStyle)
			.map((m) => m.attrs?.color)
			.find(Boolean);

	type CellMarks = { bold: boolean; underline: boolean; color: string | undefined };

	// A mark carried by every text run in the cell is hoisted onto the <td>/<th> instead of wrapping
	// the text in <strong>/<span>. Partial marks stay inline so "**Note:** read-only" isn't all bold.
	const cellMarks = (cell: RichTextNode): CellMarks => {
		const runs = textNodes(cell);
		const shared = (type: RichTextMark['type']): boolean =>
			runs.length > 0 && runs.every((run) => run.marks?.some((m) => m.type === type));
		const [first] = runs;
		const color = first && runColor(first);
		return {
			bold: shared('bold'),
			underline: shared('underline'),
			color: color && runs.every((run) => runColor(run) === color) ? color : undefined
		};
	};

	const isHoisted = (mark: RichTextMark, hoisted: CellMarks): boolean =>
		(mark.type === 'bold' && hoisted.bold) ||
		(mark.type === 'underline' && hoisted.underline) ||
		(mark.type === 'textStyle' && hoisted.color !== undefined);

	// Drops the hoisted marks from the cell's content so they aren't rendered inline as well.
	const withoutHoisted = (n: RichTextNode, hoisted: CellMarks): RichTextNode => ({
		...n,
		marks: n.marks?.filter((m) => !isHoisted(m, hoisted)),
		content: n.content?.map((child) => withoutHoisted(child, hoisted))
	});
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
		<RichTextTableRenderer nodes={withoutHoisted(cell, marks).content ?? []} />
	</svelte:element>
{/snippet}

{#if rows.length}
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
{/if}

<style>
	/* The wrapper's border closes the table, so drop the bottom border on the last row — of
	   <tbody>, or of <thead> in a header-only table. */
	.rt-table > :global(:last-child > tr:last-child > *) {
		border-bottom: 0;
	}
</style>
