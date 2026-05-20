interface ImageUrlOpts {
	width: number;
	height?: number;
	format?: 'webp' | 'jpeg' | 'png' | 'auto';
	quality?: number;
}

export function storyblokImageUrl(filename: string, opts: ImageUrlOpts): string {
	const { width, height = 0, format = 'webp', quality = 80 } = opts;
	return `${filename}/m/${width}x${height}/filters:format(${format}):quality(${quality})`;
}

interface SrcsetOpts {
	aspectRatio?: number;
	format?: 'webp' | 'jpeg' | 'png' | 'auto';
	quality?: number;
}

export function storyblokImageSrcset(
	filename: string,
	widths: number[],
	opts: SrcsetOpts = {}
): string {
	const { aspectRatio, format, quality } = opts;
	return widths
		.map((w) => {
			const height = aspectRatio ? Math.round(w / aspectRatio) : undefined;
			return `${storyblokImageUrl(filename, { width: w, height, format, quality })} ${w}w`;
		})
		.join(', ');
}
