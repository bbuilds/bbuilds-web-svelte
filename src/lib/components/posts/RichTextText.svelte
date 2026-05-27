<script lang="ts">
	import type { RichTextMark, RichTextNode } from '$lib/types/post';
	import RichTextText from './RichTextText.svelte';

	interface Props {
		node: RichTextNode;
	}

	let { node }: Props = $props();

	const text = $derived(node.text ?? '');
	const marks = $derived<RichTextMark[]>(node.marks ?? []);

	// Apply marks innermost-first by peeling off the last mark on each render pass.
	const outer = $derived(marks[marks.length - 1]);
	const inner = $derived<RichTextNode>({
		type: 'text',
		text,
		marks: marks.slice(0, -1)
	});
</script>

{#if !outer}
	{text}
{:else if outer.type === 'bold'}
	<strong class="font-bold text-ink"><RichTextText node={inner} /></strong>
{:else if outer.type === 'italic'}
	<em><RichTextText node={inner} /></em>
{:else if outer.type === 'underline'}
	<span class="underline underline-offset-[0.2em]"><RichTextText node={inner} /></span>
{:else if outer.type === 'strike'}
	<s><RichTextText node={inner} /></s>
{:else if outer.type === 'code'}
	<code class="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[0.875em] text-ink-soft"
		><RichTextText node={inner} /></code
	>
{:else if outer.type === 'textStyle'}
	<span style:color={outer.attrs?.color}><RichTextText node={inner} /></span>
{:else if outer.type === 'link'}
	<a
		href={outer.attrs.href}
		target={outer.attrs.target ?? undefined}
		rel={outer.attrs.target === '_blank' ? 'noopener noreferrer' : undefined}
		class="font-semibold text-ink underline decoration-yellow decoration-2 underline-offset-[0.2em] transition-colors hover:bg-yellow/12 hover:decoration-ink"
		><RichTextText node={inner} /></a
	>
{/if}
