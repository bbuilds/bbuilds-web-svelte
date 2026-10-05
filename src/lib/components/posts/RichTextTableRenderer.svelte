<script lang="ts">
	import type { RichTextNode } from '$lib/types/post';
	import RichTextTableRenderer from './RichTextTableRenderer.svelte';
	import RichTextTableText from './RichTextTableText.svelte';

	interface Props {
		nodes: RichTextNode[];
	}

	let { nodes }: Props = $props();
</script>

<!-- Cell-scoped renderer: no <p>, <span> or <strong> — paragraphs render inline and the
     styling of bold/underline/textStyle marks is hoisted onto the cell by RichTextTable. -->
{#each nodes as node, i (i)}
	{#if node.type === 'paragraph'}
		{#if nodes[i - 1]?.type === 'paragraph'}<br />{/if}<RichTextTableRenderer
			nodes={node.content ?? []}
		/>
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
		<RichTextTableText {node} />
	{/if}
{/each}

<style>
	.bullet-item::before {
		content: '—' / '';
	}
</style>
