const NAME_REGEX = /^[a-zA-Z](?:[ '.\-a-zA-Z]*[a-zA-Z])?$/;
const NAME_MAX = 50;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MESSAGE_MIN = 10;
const MESSAGE_MAX = 1000;

/** Optional copy (e.g. from Storyblok) that overrides the default error messages. */
export interface ValidationMessages {
	required?: string;
	invalid?: string;
}

export const validateName = (
	value: string,
	messages: ValidationMessages = {}
): string | undefined => {
	const trimmed = value.trim();
	if (!trimmed) return messages.required ?? 'Name is required';
	if (!NAME_REGEX.test(trimmed)) return messages.invalid ?? 'Name contains invalid characters';
	if (trimmed.length > NAME_MAX)
		return messages.invalid ?? `Name must be ${NAME_MAX} characters or fewer`;
	return undefined;
};

export const validateEmail = (
	value: string,
	messages: ValidationMessages = {}
): string | undefined => {
	const trimmed = value.trim();
	if (!trimmed) return messages.required ?? 'Email is required';
	if (!EMAIL_REGEX.test(trimmed)) return messages.invalid ?? 'Please enter a valid email';
	return undefined;
};

export const validateMessage = (
	value: string,
	messages: ValidationMessages = {}
): string | undefined => {
	const trimmed = value.trim();
	if (!trimmed) return messages.required ?? 'Message is required';
	if (trimmed.length < MESSAGE_MIN)
		return messages.invalid ?? `Message must be at least ${MESSAGE_MIN} characters`;
	if (trimmed.length > MESSAGE_MAX)
		return messages.invalid ?? `Message must be ${MESSAGE_MAX} characters or fewer`;
	return undefined;
};
