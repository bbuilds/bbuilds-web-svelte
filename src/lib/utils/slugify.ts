/**
 * Convert an arbitrary label into a URL/attribute-safe slug:
 * lowercase, with each run of non-alphanumeric characters collapsed to a
 * single hyphen and leading/trailing hyphens stripped.
 *
 * e.g. "Full Name" -> "full-name", "  E-mail!! " -> "e-mail"
 */
export function slugify(value: string): string {
	return value
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}
