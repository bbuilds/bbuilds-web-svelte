import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Contact from './Contact.svelte';
import type { StoryblokGlobals } from '$lib/types/storyblok';

const mockContent: StoryblokGlobals = {
	component: 'Globals',
	_uid: 'test-uid',
	contact_eyebrow: '// 06.contact',
	contact_title: 'Bring your <un>vision</un> into <ha>focus.</ha>',
	contact_copy: 'Drop a brief, a deck, or an open problem.',
	contact_cta: [
		{
			component: 'CTA',
			_uid: 'cta-uid',
			label: 'hello@brandenbuilds.com',
			link: {
				fieldtype: 'multilink',
				id: '',
				url: 'hello@brandenbuilds.com',
				cached_url: 'hello@brandenbuilds.com',
				linktype: 'email',
				email: 'hello@brandenbuilds.com'
			}
		}
	]
};

describe('Contact', () => {
	it('renders the eyebrow text', async () => {
		await render(Contact, { content: mockContent });
		await expect.element(page.getByText('// 06.contact')).toBeInTheDocument();
	});

	it('renders the copy', async () => {
		await render(Contact, { content: mockContent });
		await expect.element(page.getByText(/drop a brief/i)).toBeInTheDocument();
	});

	it('renders the email button as a mailto link', async () => {
		await render(Contact, { content: mockContent });
		const link = page.getByRole('link', { name: /hello@brandenbuilds\.com/i });
		await expect.element(link).toHaveAttribute('href', 'mailto:hello@brandenbuilds.com');
	});

	it('wraps the underline segment in .scribble', async () => {
		const { container } = await render(Contact, { content: mockContent });
		const scribble = container.querySelector('.scribble');
		expect(scribble).not.toBeNull();
		expect(scribble?.textContent).toContain('vision');
	});

	it('wraps the hand segment in .font-hand', async () => {
		const { container } = await render(Contact, { content: mockContent });
		const hand = container.querySelector('.font-hand');
		expect(hand).not.toBeNull();
		expect(hand?.textContent).toContain('focus.');
	});

	it('section has id="contact" for anchor navigation', async () => {
		const { container } = await render(Contact, { content: mockContent });
		expect(container.querySelector('section#contact')).not.toBeNull();
	});

	it('renders nothing when content is not provided', async () => {
		const { container } = await render(Contact);
		expect(container.querySelector('section#contact')).toBeNull();
	});

	it('omits the eyebrow div when contact_eyebrow is empty', async () => {
		const { container } = await render(Contact, {
			content: { ...mockContent, contact_eyebrow: '' }
		});
		expect(container.querySelector('[class*="tracking-wider"]')).toBeNull();
	});
});
