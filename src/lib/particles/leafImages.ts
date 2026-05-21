const LEAF_COLORS = ['#7ba87b', '#6f9c6e', '#8fb88c', '#9bc198', '#5e8a5a', '#c9b674', '#a89a4e'];

const LEAF_WIDTH = 100;
const LEAF_HEIGHT = 140;

function makeLeafSvg(fill: string): string {
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${LEAF_WIDTH} ${LEAF_HEIGHT}"><path d="M50 6 C 78 22, 90 70, 60 128 C 52 132, 44 132, 38 128 C 12 90, 18 36, 50 6 Z" fill="${fill}" stroke="#1a1a1a" stroke-width="1.4" stroke-linejoin="round"/><path d="M50 14 C 50 60, 50 100, 50 128" stroke="#1a1a1a" stroke-width="0.9" fill="none" opacity="0.55"/><path d="M50 38 Q66 50, 72 70" stroke="#1a1a1a" stroke-width="0.6" fill="none" opacity="0.4"/><path d="M50 38 Q34 50, 28 70" stroke="#1a1a1a" stroke-width="0.6" fill="none" opacity="0.4"/><path d="M50 70 Q68 82, 70 100" stroke="#1a1a1a" stroke-width="0.6" fill="none" opacity="0.4"/><path d="M50 70 Q32 82, 30 100" stroke="#1a1a1a" stroke-width="0.6" fill="none" opacity="0.4"/></svg>`;
}

function toDataUri(svg: string): string {
	return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const LEAF_IMAGES = LEAF_COLORS.map((color) => ({
	src: toDataUri(makeLeafSvg(color)),
	width: LEAF_WIDTH,
	height: LEAF_HEIGHT
}));
