import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import FormField from './FormField.svelte';

describe('FormField', () => {
	it('renders label associated to input via for/id', async () => {
		render(FormField, { id: 'f-name', name: 'name', label: 'Name', value: '' });
		const label = document.querySelector('label[for="f-name"]');
		expect(label).not.toBeNull();
		expect(label?.textContent).toBe('Name');
		await expect.element(page.getByLabelText('Name')).toBeInTheDocument();
	});

	it('renders a textarea when type=textarea', async () => {
		const { container } = render(FormField, {
			id: 'f-msg',
			name: 'message',
			label: 'Message',
			type: 'textarea',
			value: ''
		});
		expect(container.querySelector('textarea')).not.toBeNull();
		expect(container.querySelector('input')).toBeNull();
	});

	it('renders an input with correct type for type=email', async () => {
		const { container } = render(FormField, {
			id: 'f-email',
			name: 'email',
			label: 'Email',
			type: 'email',
			value: ''
		});
		const input = container.querySelector('input');
		expect(input?.getAttribute('type')).toBe('email');
	});

	it('sets aria-invalid and renders error message when error prop is provided', async () => {
		render(FormField, {
			id: 'f-name',
			name: 'name',
			label: 'Name',
			value: '',
			error: 'Required'
		});
		const input = document.querySelector('input');
		expect(input?.getAttribute('aria-invalid')).toBe('true');
		expect(input?.getAttribute('aria-describedby')).toBe('f-name-error');
		await expect.element(page.getByText('Required')).toBeInTheDocument();
	});

	it('does not set aria-invalid when no error', async () => {
		render(FormField, { id: 'f-name', name: 'name', label: 'Name', value: '' });
		const input = document.querySelector('input');
		expect(input?.getAttribute('aria-invalid')).toBeNull();
	});

	it('calls onInput when input fires', async () => {
		const onInput = vi.fn();
		render(FormField, { id: 'f-name', name: 'name', label: 'Name', value: '', onInput });
		await page.getByLabelText('Name').fill('test');
		expect(onInput).toHaveBeenCalled();
	});

	it('calls onBlur when input loses focus', async () => {
		const onBlur = vi.fn();
		const { container } = render(FormField, {
			id: 'f-name',
			name: 'name',
			label: 'Name',
			value: '',
			onBlur
		});
		const input = container.querySelector('input') as HTMLInputElement;
		input.focus();
		input.blur();
		expect(onBlur).toHaveBeenCalled();
	});
});
