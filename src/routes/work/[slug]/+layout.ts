import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ params }) => {
	const post = await import(`../${params.slug}.md`);
	const title: string = post.metadata.title;
	const date: string = post.metadata.date;
	const description: string = post.metadata.description;
	const content = post.default;

	return {
		title,
		date,
		description,
		content
	};
};
