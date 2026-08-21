import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { parseTitleSegments } from '$lib/utils/format';
import SectionHeader from './SectionHeader.svelte';

describe('SectionHeader', () => {
	it('renders eyebrow with // prefix by default', async () => {
		await render(SectionHeader, { eyebrow: 'services' });
		await expect.element(page.getByText('// services')).toBeInTheDocument();
	});

	it('renders eyebrow without // prefix when eyebrowPrefix=false', async () => {
		await render(SectionHeader, { eyebrow: 'contact', eyebrowPrefix: false });
		await expect.element(page.getByText('contact')).toBeInTheDocument();
		const text = document.body.textContent ?? '';
		expect(text).not.toContain('// contact');
	});

	it('renders plain title segments as text', async () => {
		const titleSegments = parseTitleSegments('Hello world');
		await render(SectionHeader, { titleSegments });
		await expect
			.element(page.getByRole('heading', { level: 2, name: /hello world/i }))
			.toBeInTheDocument();
	});

	it('renders underline segments with a scribble span and inner svg', async () => {
		const titleSegments = parseTitleSegments('<un>digital</un>');
		const { container } = await render(SectionHeader, { titleSegments });
		const scribble = container.querySelector('.scribble');
		expect(scribble).not.toBeNull();
		expect(scribble?.querySelector('svg')).not.toBeNull();
	});

	it('renders hand segments with font-hand class', async () => {
		const titleSegments = parseTitleSegments('<ha>handwritten</ha>');
		const { container } = await render(SectionHeader, { titleSegments });
		const span = container.querySelector('.font-hand');
		expect(span).not.toBeNull();
		expect(span?.textContent).toContain('handwritten');
	});

	it('renders copy paragraph', async () => {
		await render(SectionHeader, { copy: 'Some description text' });
		await expect.element(page.getByText('Some description text')).toBeInTheDocument();
	});

	it('does not render CTA when only cta is provided (no ctaLink)', async () => {
		await render(SectionHeader, { cta: { label: 'Click me' } });
		const links = document.querySelectorAll('a');
		expect([...links].some((a) => a.textContent?.includes('Click me'))).toBe(false);
	});

	it('renders CTA button when both cta and ctaLink are provided', async () => {
		await render(SectionHeader, {
			cta: { label: 'View all' },
			ctaLink: { href: '/posts' }
		});
		await expect.element(page.getByRole('link', { name: /view all/i })).toBeInTheDocument();
	});

	it('align=center adds mx-auto to the h2', async () => {
		const titleSegments = parseTitleSegments('Centered title');
		const { container } = await render(SectionHeader, { titleSegments, align: 'center' });
		const h2 = container.querySelector('h2');
		expect(h2?.className).toContain('mx-auto');
	});
});
