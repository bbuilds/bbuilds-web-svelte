<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props {
		id: string;
		name: string;
		label: string;
		type?: 'text' | 'email' | 'textarea';
		value: string;
		error?: string;
		placeholder?: string;
		autocomplete?: HTMLInputAttributes['autocomplete'];
		rows?: number;
		onInput?: () => void;
		onBlur?: () => void;
	}

	let {
		id,
		name,
		label,
		type = 'text',
		value = $bindable(),
		error,
		placeholder,
		autocomplete,
		rows = 5,
		onInput,
		onBlur
	}: Props = $props();

	const errorId = $derived(`${id}-error`);
	const inputClass = $derived(
		`w-full rounded-lg border bg-paper px-3 py-2.5 text-sm leading-normal text-ink transition-colors placeholder:text-charcoal focus:outline-none focus:ring-2 ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-black/10 focus:border-pale-fire focus:ring-pale-fire/20'}`
	);
</script>

<div class="flex flex-col gap-1.5">
	<label for={id} class="font-mono text-sm text-white">{label}</label>
	{#if type === 'textarea'}
		<textarea
			{id}
			{name}
			{rows}
			{placeholder}
			bind:value
			oninput={onInput}
			onblur={onBlur}
			aria-invalid={error ? 'true' : undefined}
			aria-describedby={error ? errorId : undefined}
			class="resize-y {inputClass}"></textarea>
	{:else}
		<input
			{id}
			{name}
			{type}
			{placeholder}
			{autocomplete}
			bind:value
			oninput={onInput}
			onblur={onBlur}
			aria-invalid={error ? 'true' : undefined}
			aria-describedby={error ? errorId : undefined}
			class={inputClass}
		/>
	{/if}
	{#if error}
		<p id={errorId} class="font-mono text-xs text-red-400">{error}</p>
	{/if}
</div>
