<script lang="ts">
	import type { RichTextDoc, RichTextNode } from '$lib/types/post';
	import RichTextRenderer from './RichTextRenderer.svelte';
	import RichTextText from './RichTextText.svelte';

	interface Props {
		doc?: RichTextDoc;
		nodes?: RichTextNode[];
	}

	let { doc, nodes }: Props = $props();

	const list = $derived<RichTextNode[]>(nodes ?? doc?.content ?? []);

	const headingLevel = (node: RichTextNode): 2 | 3 => ((node.attrs?.level as number) === 3 ? 3 : 2);

	const codeText = (node: RichTextNode): string =>
		(node.content ?? []).map((c) => c.text ?? '').join('');

	const listItemNodes = (node: RichTextNode): RichTextNode[] => {
		const first = node.content?.[0];
		if (first?.type === 'paragraph') return first.content ?? [];
		return node.content ?? [];
	};

	const imgAttrs = (node: RichTextNode) => ({
		src: String(node.attrs?.src ?? ''),
		alt: String(node.attrs?.alt ?? ''),
		caption: node.attrs?.caption as string | undefined
	});
</script>

{#each list as node, i (i)}
	{#if node.type === 'paragraph'}
		<p class="mb-[1.375rem] font-sans text-[1.0625rem] leading-[1.78] text-pretty text-body">
			<RichTextRenderer nodes={node.content ?? []} />
		</p>
	{:else if node.type === 'heading' && headingLevel(node) === 2}
		<h2
			class="mt-12 mb-4 inline-block border-b-2 border-[#ffcd67] pb-2 text-2xl font-bold tracking-[-0.025em] text-ink md:text-3xl"
		>
			<RichTextRenderer nodes={node.content ?? []} />
		</h2>
	{:else if node.type === 'heading'}
		<h3 class="mt-8 mb-2.5 text-lg font-semibold tracking-[-0.015em] text-ink">
			<RichTextRenderer nodes={node.content ?? []} />
		</h3>
	{:else if node.type === 'bullet_list'}
		<ul class="mb-[1.375rem] flex flex-col gap-2">
			{#each node.content ?? [] as item, j (j)}
				<li
					class="relative pl-[1.375rem] font-sans text-base leading-[1.72] text-body before:absolute before:top-0.5 before:left-0 before:font-mono before:text-[0.875rem] before:text-yellow before:content-['—']"
				>
					<RichTextRenderer nodes={listItemNodes(item)} />
				</li>
			{/each}
		</ul>
	{:else if node.type === 'ordered_list'}
		<ol class="mb-[1.375rem] flex list-decimal flex-col gap-2 pl-[1.375rem]">
			{#each node.content ?? [] as item, j (j)}
				<li class="font-sans text-base leading-[1.72] text-body">
					<RichTextRenderer nodes={listItemNodes(item)} />
				</li>
			{/each}
		</ol>
	{:else if node.type === 'code_block'}
		<pre
			class="my-6 overflow-x-auto rounded-lg border border-paper-line bg-paper-2 p-4 font-mono text-[0.8125rem] leading-[1.55]"
			data-language={node.attrs?.language as string | undefined}><code>{codeText(node)}</code></pre>
	{:else if node.type === 'blockquote'}
		<blockquote
			class="my-8 rounded-r-lg border-l-[3px] border-[#ffcd67] bg-yellow/5 px-6 py-[1.125rem] font-mono text-[0.9375rem] leading-[1.65] text-body italic"
		>
			<RichTextRenderer nodes={node.content ?? []} />
		</blockquote>
	{:else if node.type === 'image'}
		{@const a = imgAttrs(node)}
		<figure class="my-6">
			<img src={a.src} alt={a.alt} class="w-full rounded-lg" />
			{#if a.caption}
				<figcaption class="mt-2 text-center font-mono text-xs text-muted">{a.caption}</figcaption>
			{/if}
		</figure>
	{:else if node.type === 'horizontal_rule'}
		<hr class="my-8 border-paper-line" />
	{:else if node.type === 'hard_break'}
		<br />
	{:else if node.type === 'text'}
		<RichTextText {node} />
	{/if}
{/each}
