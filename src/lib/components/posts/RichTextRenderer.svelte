<script lang="ts">
	import type { RichTextDoc, RichTextNode } from '$lib/types/post';
	import RichTextRenderer from './RichTextRenderer.svelte';
	import RichTextText from './RichTextText.svelte';
	import { headingSlugs } from '$lib/utils/format';
	import { storyblokImageUrl } from '$lib/utils/storyblokImage';

	interface Props {
		doc?: RichTextDoc;
		nodes?: RichTextNode[];
	}

	let { doc, nodes }: Props = $props();

	const list = $derived<RichTextNode[]>(nodes ?? doc?.content ?? []);
	const anchors = $derived(headingSlugs(list));

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
		caption: node.attrs?.caption as string | undefined,
		width: node.attrs?.width != null ? Number(node.attrs.width) : undefined,
		height: node.attrs?.height != null ? Number(node.attrs.height) : undefined
	});
</script>

{#each list as node, i (i)}
	{#if node.type === 'paragraph'}
		<p class="mb-5.5 font-sans text-base leading-[1.78] text-pretty text-body md:text-[1.0625rem]">
			<RichTextRenderer nodes={node.content ?? []} />
		</p>
	{:else if node.type === 'heading' && headingLevel(node) === 2}
		{@const id = anchors[i]}
		<h2
			id={id ?? undefined}
			class="group relative mt-12 mb-4 inline-block scroll-mt-20 border-b-2 border-pale-fire pb-2 text-[1.25rem] font-bold tracking-tight text-ink md:text-[clamp(1.375rem,2.4vw,1.875rem)]"
		>
			{#if id}
				<a
					href="#{id}"
					aria-label="Permalink to this section"
					class="pointer-events-none absolute top-0 right-full hidden -translate-x-1 pr-1.5 text-yellow no-underline opacity-0 transition duration-200 group-hover:pointer-events-auto group-hover:translate-x-0 group-hover:opacity-100 focus-visible:pointer-events-auto focus-visible:translate-x-0 focus-visible:opacity-100 md:block"
					>#</a
				>
			{/if}
			<RichTextRenderer nodes={node.content ?? []} />
		</h2>
	{:else if node.type === 'heading'}
		<h3 class="mt-8 mb-2.5 text-lg font-semibold tracking-[-0.015em] text-ink">
			<RichTextRenderer nodes={node.content ?? []} />
		</h3>
	{:else if node.type === 'bullet_list'}
		<ul class="mb-5.5 flex flex-col gap-2">
			{#each node.content ?? [] as item, j (j)}
				<li
					class="relative pl-5.5 font-sans text-base leading-[1.72] text-body before:absolute before:top-0.5 before:left-0 before:font-mono before:text-[0.875rem] before:text-yellow before:content-['—']"
				>
					<RichTextRenderer nodes={listItemNodes(item)} />
				</li>
			{/each}
		</ul>
	{:else if node.type === 'ordered_list'}
		<ol class="mb-5.5 flex list-decimal flex-col gap-2 pl-5.5">
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
			class="my-8 rounded-r-lg border-l-[3px] border-pale-fire bg-yellow/5 px-6 py-4.5 font-mono text-[0.9375rem] leading-[1.65] text-body italic"
		>
			<RichTextRenderer nodes={node.content ?? []} />
		</blockquote>
	{:else if node.type === 'image'}
		{@const a = imgAttrs(node)}
		<figure class="my-6">
			<img
				src={storyblokImageUrl(a.src, { width: a.width ?? 1200, height: a.height })}
				alt={a.alt}
				width={a.width}
				height={a.height}
				loading="lazy"
				decoding="async"
				class="w-full rounded-lg"
			/>
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
