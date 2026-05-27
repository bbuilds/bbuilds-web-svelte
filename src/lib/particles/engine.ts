import { tsParticles } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';
import { loadEmittersPlugin } from '@tsparticles/plugin-emitters';
import { loadEmittersShapeSquare } from '@tsparticles/plugin-emitters-shape-square';

let enginePromise: Promise<typeof tsParticles> | undefined;

export function initParticleEngine(): Promise<typeof tsParticles> {
	enginePromise ??= (async () => {
		await loadSlim(tsParticles);
		await loadEmittersPlugin(tsParticles);
		await loadEmittersShapeSquare(tsParticles);
		return tsParticles;
	})();
	return enginePromise;
}
