const NAME_REGEX = /^[a-zA-Z](?:[ '.\-a-zA-Z]*[a-zA-Z])?$/;
const NAME_MAX = 50;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MESSAGE_MIN = 10;
const MESSAGE_MAX = 1000;

export const validateName = (value: string): string | undefined => {
	const trimmed = value.trim();
	if (!trimmed) return 'Name is required';
	if (!NAME_REGEX.test(trimmed)) return 'Name contains invalid characters';
	if (trimmed.length > NAME_MAX) return `Name must be ${NAME_MAX} characters or fewer`;
	return undefined;
};

export const validateEmail = (value: string): string | undefined => {
	const trimmed = value.trim();
	if (!trimmed) return 'Email is required';
	if (!EMAIL_REGEX.test(trimmed)) return 'Please enter a valid email';
	return undefined;
};

export const validateMessage = (value: string): string | undefined => {
	const trimmed = value.trim();
	if (!trimmed) return 'Message is required';
	if (trimmed.length < MESSAGE_MIN) return `Message must be at least ${MESSAGE_MIN} characters`;
	if (trimmed.length > MESSAGE_MAX) return `Message must be ${MESSAGE_MAX} characters or fewer`;
	return undefined;
};
