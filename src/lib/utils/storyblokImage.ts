interface ImageUrlOpts {
	width: number;
	height?: number;
	format?: 'webp' | 'jpeg' | 'png' | 'auto';
	quality?: number;
	fitIn?: boolean;
	fill?: string;
}

export function storyblokImageUrl(filename: string, opts: ImageUrlOpts): string {
	const { width, height = 0, format = 'webp', quality = 80, fitIn = false, fill } = opts;
	const dimensions = fitIn ? `fit-in/${width}x${height}` : `${width}x${height}`;
	const fillFilter = fitIn && fill ? `:fill(${fill})` : '';
	return `${filename}/m/${dimensions}/filters:format(${format}):quality(${quality})${fillFilter}`;
}

interface SrcsetOpts {
	aspectRatio?: number;
	format?: 'webp' | 'jpeg' | 'png' | 'auto';
	quality?: number;
	fitIn?: boolean;
	fill?: string;
}

export function storyblokImageSrcset(
	filename: string,
	widths: number[],
	opts: SrcsetOpts = {}
): string {
	const { aspectRatio, format, quality, fitIn, fill } = opts;
	return widths
		.map((w) => {
			const height = aspectRatio ? Math.round(w / aspectRatio) : undefined;
			return `${storyblokImageUrl(filename, { width: w, height, format, quality, fitIn, fill })} ${w}w`;
		})
		.join(', ');
}
