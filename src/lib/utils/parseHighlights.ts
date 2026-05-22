export interface TextSegment {
	text: string;
	highlight: boolean;
}

export function parseHighlights(input: string): TextSegment[] {
	const segments: TextSegment[] = [];
	const regex = /<hl>(.*?)<\/hl>/g;
	let lastIndex = 0;
	let match;

	while ((match = regex.exec(input)) !== null) {
		if (match.index > lastIndex) {
			segments.push({ text: input.slice(lastIndex, match.index), highlight: false });
		}
		segments.push({ text: match[1], highlight: true });
		lastIndex = regex.lastIndex;
	}

	if (lastIndex < input.length) {
		segments.push({ text: input.slice(lastIndex), highlight: false });
	}

	return segments;
}
