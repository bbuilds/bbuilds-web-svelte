import type { ISourceOptions } from '@tsparticles/engine';
import { LEAF_IMAGES } from '$lib/particles/leafImages';

export const leafParticleOptions = {
	fullScreen: { enable: true },
	background: { color: 'transparent' },
	fpsLimit: 60,
	detectRetina: true,
	particles: {
		number: { value: 0 },
		shape: {
			type: 'image',
			options: { image: LEAF_IMAGES }
		},
		opacity: { value: 0.9 },
		size: { value: { min: 16, max: 38 } },
		rotate: {
			value: { min: 0, max: 360 },
			direction: 'random',
			animation: { enable: true, speed: { min: 5, max: 25 }, sync: false }
		},
		move: {
			enable: true,
			direction: 'bottom',
			speed: { min: 0.4, max: 0.9 },
			straight: false,
			gravity: { enable: true, acceleration: 0.3, maxSpeed: 2 },
			wobble: { enable: true, distance: 30, speed: { min: -8, max: 8 } },
			outModes: { default: 'destroy', top: 'none' }
		}
	},
	emitters: {
		direction: 'bottom',
		position: { x: 50, y: -5 },
		size: { width: 100, height: 0, mode: 'percent' },
		rate: { delay: 1.4, quantity: 1 }
	},
	interactivity: {
		detectsOn: 'window',
		events: { onHover: { enable: true, mode: 'repulse' } },
		modes: {
			repulse: { distance: 90, duration: 0.4, factor: 100, speed: 1, easing: 'ease-out-quad' }
		}
	}
} as ISourceOptions;
