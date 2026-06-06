<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import { prefersReducedMotion } from '$lib/utils/motion';

	interface Props {
		path: string;
		status: number;
	}

	let { path, status }: Props = $props();

	const typeRows: Attachment<HTMLElement> = (el) => {
		const timeoutIds: ReturnType<typeof setTimeout>[] = [];

		const safePath = path.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

		const lines = [
			{
				h: `<span class="text-teal">branden@builds</span> <span class="t-path">~/site</span> $ open <span class="t-path">${safePath}</span>`
			},
			{ h: `<span class="text-muted-dark">resolving route…</span>` },
			{
				h: `<span class="t-err">✖ Error: HTTP ${status} — ${status === 404 ? 'page not found' : 'internal server error'}</span>`
			},
			{
				h: `<span class="text-muted-dark">  at Router.resolve (<span class="t-path">${safePath}</span>)</span>`
			},
			{ h: `<span class="text-muted-dark">  at Server.handle (request.js:42)</span>` },
			{
				h:
					status === 404
						? `<span class="text-pale-fire">⚠ this route was never built — or has since been torn down.</span>`
						: `<span class="text-pale-fire">⚠ an unexpected error occurred during request handling.</span>`
			},
			{ h: `&nbsp;` },
			{
				h: `<span class="text-teal">branden@builds</span> <span class="t-path">~/site</span> $ suggest --next`
			},
			{
				h: `<span class="text-green">✔ try:</span> <span class="t-path">/</span> <span class="text-muted-dark">(home)</span> · <span class="t-path">/blog</span> · <span class="t-path">/#contact</span>`
			},
			{
				h: `<span class="text-teal">branden@builds</span> <span class="t-path">~/site</span> $ <span class="t-caret"></span>`,
				last: true
			}
		];

		if (prefersReducedMotion()) {
			for (const line of lines) {
				const span = document.createElement('span');
				span.className = 't-row';
				span.style.opacity = '1';
				span.innerHTML = line.h;
				el.appendChild(span);
			}
			return;
		}

		let i = 0;
		function next() {
			if (i >= lines.length) return;
			const span = document.createElement('span');
			span.className = 't-row';
			span.innerHTML = lines[i].h;
			el.appendChild(span);
			i++;
			if (i < lines.length) {
				const id = setTimeout(next, lines[i - 1].last ? 0 : 240 + Math.random() * 220);
				timeoutIds.push(id);
			}
		}
		next();

		return () => {
			timeoutIds.forEach(clearTimeout);
		};
	};
</script>

<div class="relative">
	<div
		class="bg-ink text-paper rounded-[0.875rem] overflow-hidden border border-black/50 font-mono rotate-[-1.2deg] max-[60rem]:rotate-[-0.8deg] [box-shadow:0_2.5rem_5rem_-2rem_var(--ink-50),0_1rem_2rem_-1.5rem_var(--ink-60)]"
		role="img"
		aria-label="Terminal showing a {status} error"
	>
		<div class="flex items-center gap-2 px-4 py-3 bg-white/4 border-b border-white/8">
			<span class="w-2.75 h-2.75 rounded-full bg-[#e06b56]"></span>
			<span class="w-2.75 h-2.75 rounded-full bg-[#e0b756]"></span>
			<span class="w-2.75 h-2.75 rounded-full bg-green"></span>
			<span
				class="ml-3 text-[0.6875rem] tracking-[0.04em] text-muted-dark inline-flex items-center gap-[0.4rem]"
				>zsh — branden@builds — ~/site</span
			>
		</div>
		<div
			class="px-5 pt-5 pb-6 text-[0.78125rem] leading-[1.85] whitespace-pre-wrap wrap-break-word"
			{@attach typeRows}
		></div>
	</div>
</div>

<style>
	:global(.t-path) {
		color: #cfc4ad;
	}

	:global(.t-err) {
		color: #e87f6b;
		font-weight: 500;
	}

	:global(.t-row) {
		display: block;
		opacity: 0;
		animation: tRow 0.01s linear forwards;
	}

	:global(.t-caret)::after {
		content: '▋';
		color: var(--teal);
		animation: blink 1s step-end infinite;
		margin-left: 0.15rem;
	}

	@keyframes tRow {
		to {
			opacity: 1;
		}
	}

	@keyframes blink {
		50% {
			opacity: 0;
		}
	}
</style>
