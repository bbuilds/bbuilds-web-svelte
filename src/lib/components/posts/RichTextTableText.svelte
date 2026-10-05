<script lang="ts">
	import type { RichTextMark, RichTextNode } from '$lib/types/post';
	import RichTextTableText from './RichTextTableText.svelte';

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

	// Script-level narrowing for discriminated union variants — ESLint can't narrow in template blocks.
	const linkAttrs = $derived(outer?.type === 'link' ? outer.attrs : undefined);
</script>

<!-- bold, underline and textStyle are hoisted onto the enclosing <td>/<th> by RichTextTable,
     so they render their text bare instead of wrapping it in <strong>/<span>. -->
{#if !outer}
	{text}
{:else if outer.type === 'italic'}
	<em><RichTextTableText node={inner} /></em>
{:else if outer.type === 'strike'}
	<s><RichTextTableText node={inner} /></s>
{:else if outer.type === 'code'}
	<code class="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[0.875em] text-ink-soft"
		><RichTextTableText node={inner} /></code
	>
{:else if outer.type === 'link'}
	<a
		href={linkAttrs?.href ?? ''}
		target={linkAttrs?.target ?? undefined}
		rel={linkAttrs?.target === '_blank' ? 'noopener noreferrer' : undefined}
		class="text-ink underline decoration-yellow decoration-2 underline-offset-[0.2em] transition-colors hover:bg-yellow/12 hover:decoration-ink"
		><RichTextTableText node={inner} /></a
	>
{:else}
	<RichTextTableText node={inner} />
{/if}
