<script lang="ts">
	import type { ISourceOptions } from '@tsparticles/engine';
	import type { Attachment } from 'svelte/attachments';

	interface Props {
		options: ISourceOptions;
	}
	let { options }: Props = $props();

	const renderParticles: Attachment<HTMLDivElement> = (el) => {
		let destroyed = false;
		let container: { destroy: () => void } | undefined;

		(async () => {
			const { initParticleEngine } = await import('$lib/particles/engine');
			const tsParticles = await initParticleEngine();
			const loaded = await tsParticles.load({ element: el, options });
			if (destroyed) {
				loaded?.destroy();
			} else {
				container = loaded;
			}
		})().catch(() => {
			/* decorative effect — fail silently, no unhandled rejection */
		});

		return () => {
			destroyed = true;
			container?.destroy();
		};
	};
</script>

<div {@attach renderParticles}></div>
