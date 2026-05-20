import type { Post } from '$lib/types/post';
import detectingMemoryLeaks from '../../posts/detecting-memory-leaks';

const posts: Record<string, Post> = {
	'detecting-memory-leaks': detectingMemoryLeaks
};

export const getPost = (slug: string): Post | undefined => posts[slug];

export const listPosts = (): Post[] => Object.values(posts);
