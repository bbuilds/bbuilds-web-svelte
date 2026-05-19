import type { Post, RichTextNode } from '$lib/types/post';

const p = (...content: RichTextNode[]): RichTextNode => ({ type: 'paragraph', content });

const t = (text: string): RichTextNode => ({ type: 'text', text });

const bold = (text: string): RichTextNode => ({
	type: 'text',
	text,
	marks: [{ type: 'bold' }]
});

const code = (text: string): RichTextNode => ({
	type: 'text',
	text,
	marks: [{ type: 'code' }]
});

const link = (text: string, href: string, external = true): RichTextNode => ({
	type: 'text',
	text,
	marks: [
		{
			type: 'link',
			attrs: {
				href,
				target: external ? '_blank' : null,
				linktype: 'url',
				anchor: null,
				uuid: null
			}
		}
	]
});

const h2 = (text: string): RichTextNode => ({
	type: 'heading',
	attrs: { level: 2 },
	content: [t(text)]
});

const h3 = (text: string): RichTextNode => ({
	type: 'heading',
	attrs: { level: 3 },
	content: [t(text)]
});

const li = (...content: RichTextNode[]): RichTextNode => ({
	type: 'list_item',
	content: [p(...content)]
});

const ul = (...items: RichTextNode[]): RichTextNode => ({
	type: 'bullet_list',
	content: items
});

const codeBlock = (language: string, text: string): RichTextNode => ({
	type: 'code_block',
	attrs: { language },
	content: [t(text)]
});

const FUITE_OUTPUT = `URL       : http://localhost:8000/
Scenario  : Default
Iterations: 7 (Default)

TEST RESULTS
--------------------

Test         : Go to /category/adventure-journal/ and back
Memory change: +1.23 MB
Leak detected: Yes

Leaking objects:
  Detached CanvasRenderingContext2D    1      +804 B
  Detached HTMLCanvasElement           1      +1.22 kB
  Detached IntersectionObserver        1      +324 B
  MutationObserver                     2      +439 B
  URL                                  2      +376 B

Leaking event listeners (+51.71 total):
  scroll              42     Window
  load                3.86   Window, link
  orientationchange   2      Window
  resize              2      Window

Leaking DOM nodes (+1.86 total):
  link                1.86`;

const AFTER_FIX_OUTPUT = `URL       : http://localhost:8000/
Scenario  : Default
Iterations: 7 (Default)

TEST RESULTS
--------------------

Test         : Go to /category/adventure-journal/ and back
Memory change: +165 kB
Leak detected: Yes`;

const post: Post = {
	slug: 'detecting-memory-leaks',
	name: 'Detecting Memory Leaks',
	first_published_at: '2022-01-17T00:00:00.000Z',
	tag_list: ['fuite', 'memory leaks', 'dev tools'],
	content: {
		summary:
			'Recently came across a tool Fuite to detect memory leaks in your web apps and gave it a run.',
		featured_image: {
			filename: 'https://picsum.photos/seed/detecting-memory-leaks/1280/560',
			alt: 'Detecting memory leaks in web apps'
		},
		Category: ['Performance'],
		content: {
			type: 'doc',
			content: [
				p(
					t('I saw Fuite, '),
					link(
						'a tool for detecting memory leaks in web applications',
						'https://github.com/nolanlawson/fuite'
					),
					t(
						', come across my screen a few times from various newsletters I subscribe to. I wanted to run a check on my '
					),
					link('digital nomad blog', 'https://byoungz.com/'),
					t(
						' to see if I could find some memory leaks. I quickly put my headless WordPress and Gatsby blog together and admittedly didn’t spend a ton of time checking some more advanced things I should, like memory leaks.'
					)
				),

				h2('Memory Leaks Recap'),
				p(
					t(
						'This blog post isn’t meant to be an in-depth education on memory leaks or how to solve them, but I want to give a general definition and the problems I was looking to solve.'
					)
				),
				p(
					bold('TLDR:'),
					t(
						' A JavaScript memory leak is an object in memory that persists after it’s no longer in use. JavaScript has an automatic trash collector, but neglectful coding can prevent objects in memory from completing the last lifecycle method of memory, '
					),
					bold('releasing it.')
				),
				p(t('The memory life cycle works as follows:')),
				p(bold('Allocate Memory ⇒ Use Memory ⇒ Release Memory.')),

				h2('Finding Memory Leaks'),
				p(
					t(
						'This is where Fuite comes in. Finding memory leaks in your code is tedious and requires digging through Chrome developer tools. Fuite automates this process and points in the right direction so I could easily track the leaks down.'
					)
				),
				p(
					t(
						'The initial run on my digital nomad blog was brutal. Here’s a trimmed snippet of the output from a local development build:'
					)
				),
				codeBlock('bash', FUITE_OUTPUT),
				p(t('So as you can see, I was not in good shape. A few things stuck out to me:')),
				ul(
					li(t('I had 51 scroll events leaking (big yikes).')),
					li(
						t(
							'TsParticles seemed to be causing some issues. I used it for a cool banner effect on category pages.'
						)
					),
					li(
						t('Another library, '),
						bold('Animate on Scroll'),
						t(', I had a feeling was causing the event leaks.')
					)
				),

				h2('Fixing Memory Leaks'),
				p(t('Fuite captures three types of memory leaks, as shown above:')),
				ul(li(t('Event leaks')), li(t('Collection / DOM node leaks')), li(t('Object leaks'))),

				h3('My Process'),
				p(
					t(
						'A brief overview of how I tackled these leaks. I’m not going into depth — the creator of Fuite wrote a great article on '
					),
					link(
						'fixing memory leaks in web applications',
						'https://nolanlawson.com/2020/02/19/fixing-memory-leaks-in-web-applications/'
					),
					t(' that will do a much better job than I can.')
				),
				ul(
					li(t('Spun up the local development site.')),
					li(t('Ran Fuite on local development.')),
					li(
						t(
							'Removed TsParticles from the banner to see how many leaks that fixed. It didn’t drop as much as I expected, but it helped.'
						)
					),
					li(
						t('Opened Chrome dev tools and fixed the event leaks. The big discovery was that '),
						link('Animate on Scroll', 'https://michalsnik.github.io/aos/'),
						t(' was creating the large amount of scroll event leaks. I swapped it for '),
						link('ScrollReveal', 'https://scrollrevealjs.org/'),
						t(
							' and made sure to destroy the instance when a component unmounted. I also fixed a few custom '
						),
						code('orientationchange'),
						t(' and '),
						code('resize'),
						t(' handlers.')
					),
					li(
						bold(
							'Not removing event handlers when a component unmounts is a very common memory leak and easily avoidable.'
						)
					),
					li(
						t(
							'After clearing the event leaks, I fixed the collections and node lists — removing AOS and TsParticles cleaned most of these up.'
						)
					),
					li(
						t(
							'I added TsParticles back in using the JS-only version, then destroyed the instance and cleared the DOM list on unmount.'
						)
					),
					li(
						t(
							'Finally, I tackled the object leaks. Some looked to come from Gatsby plugins, and I still have heap stacks to dig through.'
						)
					)
				),
				p(t('After cleaning up the event leaks and removing AOS, the result was dramatic:')),
				codeBlock('bash', AFTER_FIX_OUTPUT),
				p(t('I went from +1.23 MB to +165 kB.')),

				h2('Conclusion'),
				p(
					t(
						'Thanks to Fuite, I lost my weekend diving into memory leaks on my blog. I learned a lot — especially how to implement better code patterns around event handlers inside components.'
					)
				)
			]
		}
	}
};

export default post;
