import { describe, expect, it } from 'vitest';
import { validateName, validateEmail, validateMessage } from './validation';

describe('validateName', () => {
	it('returns an error for an empty string', () => {
		expect(validateName('')).toBe('Name is required');
	});

	it('returns an error for whitespace-only input', () => {
		expect(validateName('   ')).toBe('Name is required');
	});

	it('returns undefined for a valid single name', () => {
		expect(validateName('Alice')).toBeUndefined();
	});

	it('returns undefined for a name with a hyphen', () => {
		expect(validateName('Mary-Jane')).toBeUndefined();
	});

	it('returns undefined for a name with an apostrophe', () => {
		expect(validateName("O'Brien")).toBeUndefined();
	});

	it('returns undefined for a name with a space', () => {
		expect(validateName('Jean Paul')).toBeUndefined();
	});

	it('returns an error for a name with digits', () => {
		expect(validateName('Alice1')).toBe('Name contains invalid characters');
	});

	it('returns an error for a name with special characters', () => {
		expect(validateName('Alice!')).toBe('Name contains invalid characters');
	});

	it('returns undefined for a name exactly 50 characters', () => {
		expect(validateName('A'.repeat(50))).toBeUndefined();
	});

	it('returns an error for a name exceeding 50 characters', () => {
		expect(validateName('A'.repeat(51))).toBe('Name must be 50 characters or fewer');
	});
});

describe('validateEmail', () => {
	it('returns an error for an empty string', () => {
		expect(validateEmail('')).toBe('Email is required');
	});

	it('returns an error for whitespace-only input', () => {
		expect(validateEmail('   ')).toBe('Email is required');
	});

	it('returns undefined for a valid email', () => {
		expect(validateEmail('user@example.com')).toBeUndefined();
	});

	it('returns undefined for an email with subdomain', () => {
		expect(validateEmail('user@mail.example.co')).toBeUndefined();
	});

	it('returns an error when @ is missing', () => {
		expect(validateEmail('notanemail')).toBe('Please enter a valid email');
	});

	it('returns an error when TLD is missing', () => {
		expect(validateEmail('user@domain')).toBe('Please enter a valid email');
	});

	it('returns an error for leading/trailing spaces around an otherwise invalid value', () => {
		expect(validateEmail('  notanemail  ')).toBe('Please enter a valid email');
	});
});

describe('validateMessage', () => {
	it('returns an error for an empty string', () => {
		expect(validateMessage('')).toBe('Message is required');
	});

	it('returns an error for whitespace-only input', () => {
		expect(validateMessage('   ')).toBe('Message is required');
	});

	it('returns an error for a message shorter than 10 characters', () => {
		expect(validateMessage('Hi there!')).toBe('Message must be at least 10 characters');
	});

	it('returns undefined for a message exactly 10 characters', () => {
		expect(validateMessage('Hello!!!!!')).toBeUndefined();
	});

	it('returns undefined for a valid message', () => {
		expect(validateMessage('This is a valid contact message.')).toBeUndefined();
	});

	it('returns undefined for a message exactly 1000 characters', () => {
		expect(validateMessage('a'.repeat(1000))).toBeUndefined();
	});

	it('returns an error for a message exceeding 1000 characters', () => {
		expect(validateMessage('a'.repeat(1001))).toBe('Message must be 1000 characters or fewer');
	});
});
