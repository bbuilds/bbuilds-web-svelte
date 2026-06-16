<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import { prefersReducedMotion } from '$lib/utils/motion';

	const spawnLeaves: Attachment<HTMLElement> = (el) => {
		if (prefersReducedMotion()) return;

		const greens = ['#7ba87b', '#6f9c6e', '#8ab98a', '#b8821a'] as const;
		const intervalIds: ReturnType<typeof setInterval>[] = [];
		const timeoutIds: ReturnType<typeof setTimeout>[] = [];

		function leafSVG(fill: string, rot: number): string {
			return `<svg viewBox="0 0 100 140" width="100%" style="transform:rotate(${rot}deg)" aria-hidden="true">
				<path d="M50 6 C 78 22, 90 70, 60 128 C 52 132, 44 132, 38 128 C 12 90, 18 36, 50 6 Z" fill="${fill}" stroke="#1a1a1a" stroke-width="1.4" stroke-linejoin="round"/>
				<path d="M50 14 C 50 60, 50 100, 50 128" stroke="#1a1a1a" stroke-width="0.9" fill="none" opacity="0.55"/>
			</svg>`;
		}

		function spawn() {
			if (document.hidden) return;
			const size = (18 + Math.random() * 26) / 16;
			const fall = document.createElement('div');
			fall.className = 'falling-leaf';
			fall.style.left = `${Math.random() * 100}%`;
			fall.style.width = `${size}rem`;
			fall.style.setProperty('--fall-dur', `${9 + Math.random() * 6}s`);

			const sway = document.createElement('div');
			sway.className = 'leaf-sway';
			sway.style.setProperty('--sway-dur', `${2.6 + Math.random() * 2.4}s`);

			const tumble = document.createElement('div');
			tumble.className = 'leaf-tumble';
			tumble.style.setProperty('--tumble-dur', `${5 + Math.random() * 5}s`);
			tumble.innerHTML = leafSVG(
				greens[Math.floor(Math.random() * greens.length)] ?? greens[0],
				Math.floor(Math.random() * 360)
			);

			sway.appendChild(tumble);
			fall.appendChild(sway);
			el.appendChild(fall);

			const tid = setTimeout(() => fall.remove(), 16000);
			timeoutIds.push(tid);
		}

		for (let k = 0; k < 3; k++) {
			const tid = setTimeout(spawn, k * 900);
			timeoutIds.push(tid);
		}

		const iid = setInterval(spawn, 1700);
		intervalIds.push(iid);

		return () => {
			timeoutIds.forEach(clearTimeout);
			intervalIds.forEach(clearInterval);
		};
	};
</script>

<div
	class="absolute inset-0 z-0 overflow-hidden opacity-50 pointer-events-none"
	aria-hidden="true"
	{@attach spawnLeaves}
></div>

<style>
	:global(.falling-leaf) {
		position: absolute;
		top: -4rem;
		will-change: transform;
		animation: leafFall var(--fall-dur, 11s) linear forwards;
	}

	@keyframes leafFall {
		0% {
			transform: translateY(0);
		}
		100% {
			transform: translateY(115vh);
		}
	}

	:global(.leaf-sway) {
		will-change: transform;
		animation: leafSway var(--sway-dur, 3.5s) ease-in-out infinite;
	}

	@keyframes leafSway {
		0%,
		100% {
			transform: translateX(-1.875rem);
		}
		50% {
			transform: translateX(1.875rem);
		}
	}

	:global(.leaf-tumble) {
		will-change: transform;
		animation: leafTumble var(--tumble-dur, 8s) linear infinite;
	}

	@keyframes leafTumble {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
