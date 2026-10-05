<script lang="ts">
	import type { RichTextMark, RichTextNode } from '$lib/types/post';
	import RichTextText from './RichTextText.svelte';

	interface Props {
		node: RichTextNode;
		// 'table' drops the semibold link weight so links don't compete with cell text.
		variant?: 'prose' | 'table';
	}

	let { node, variant = 'prose' }: Props = $props();

	const text = $derived(node.text ?? '');
	const marks = $derived<RichTextMark[]>(node.marks ?? []);

	// Apply marks innermost-first by peeling off the last mark on each render pass.
	const outer = $derived(marks[marks.length - 1]);
	const inner = $derived<RichTextNode>({
		type: 'text',
		text,
		marks: marks.slice(0, -1)
	});

	// Script-level narrowing for discriminated union variants — ESLint can't narrow in template blocks.
	const textStyleAttrs = $derived(outer?.type === 'textStyle' ? outer.attrs : undefined);
	const linkAttrs = $derived(outer?.type === 'link' ? outer.attrs : undefined);
</script>

{#if !outer}
	{text}
{:else if outer.type === 'bold'}
	<strong class="font-bold text-ink"><RichTextText node={inner} {variant} /></strong>
{:else if outer.type === 'italic'}
	<em><RichTextText node={inner} {variant} /></em>
{:else if outer.type === 'underline'}
	<span class="underline underline-offset-[0.2em]"><RichTextText node={inner} {variant} /></span>
{:else if outer.type === 'strike'}
	<s><RichTextText node={inner} {variant} /></s>
{:else if outer.type === 'code'}
	<code class="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[0.875em] text-ink-soft"
		><RichTextText node={inner} {variant} /></code
	>
{:else if outer.type === 'textStyle'}
	<span style:color={textStyleAttrs?.color}><RichTextText node={inner} {variant} /></span>
{:else if outer.type === 'link'}
	<a
		href={linkAttrs?.href ?? ''}
		target={linkAttrs?.target ?? undefined}
		rel={linkAttrs?.target === '_blank' ? 'noopener noreferrer' : undefined}
		class={[
			'text-ink underline decoration-yellow decoration-2 underline-offset-[0.2em] transition-colors hover:bg-yellow/12 hover:decoration-ink',
			variant === 'prose' && 'font-semibold'
		]}><RichTextText node={inner} {variant} /></a
	>
{:else}
	<!-- Marks RichTextMark doesn't model (superscript, highlight…) still arrive from Storyblok;
	     render the text unwrapped rather than dropping it. -->
	<RichTextText node={inner} {variant} />
{/if}
