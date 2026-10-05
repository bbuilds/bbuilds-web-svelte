<script lang="ts">
	import type { RichTextNode } from '$lib/types/post';
	import RichTextTableRenderer from './RichTextTableRenderer.svelte';
	import RichTextText from './RichTextText.svelte';

	interface Props {
		nodes: RichTextNode[];
	}

	let { nodes }: Props = $props();

	const STRUCTURED = new Set(['bullet_list', 'ordered_list', 'hard_break', 'text']);

	// Paragraphs, and blocks with no cell markup of their own (heading, code_block, blockquote…),
	// flatten to inline content so a cell never loses text.
	const flattens = (n: RichTextNode | undefined): boolean =>
		n !== undefined && (n.type === 'paragraph' || (!!n.content && !STRUCTURED.has(n.type)));
</script>

<!-- Cell-scoped renderer: no <p> — paragraphs and other text blocks render inline, separated by
     <br>. Marks shared by the whole cell are hoisted onto it by RichTextTable. -->
{#each nodes as node, i (i)}
	{#if flattens(node)}
		{#if flattens(nodes[i - 1])}<br />{/if}<RichTextTableRenderer nodes={node.content ?? []} />
	{:else if node.type === 'bullet_list'}
		<ul class="flex flex-col gap-1">
			{#each node.content ?? [] as item, j (j)}
				<li
					class="bullet-item relative pl-5.5 before:absolute before:top-0.5 before:left-0 before:font-mono before:text-[0.875rem] before:text-yellow"
				>
					<RichTextTableRenderer nodes={item.content ?? []} />
				</li>
			{/each}
		</ul>
	{:else if node.type === 'ordered_list'}
		<ol class="flex list-decimal flex-col gap-1 pl-5.5">
			{#each node.content ?? [] as item, j (j)}
				<li>
					<RichTextTableRenderer nodes={item.content ?? []} />
				</li>
			{/each}
		</ol>
	{:else if node.type === 'hard_break'}
		<br />
	{:else if node.type === 'text'}
		<RichTextText {node} variant="table" />
	{/if}
{/each}

<style>
	.bullet-item::before {
		content: '—' / '';
	}
</style>
