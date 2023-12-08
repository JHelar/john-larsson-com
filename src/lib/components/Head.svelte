<script lang="ts">
	import defaultImage from '$lib/assets/logo.png';
	export let title: string = '';
	export let description: string = 'Fullstack developer from Sweden';
	export const imageUrl: string = defaultImage;

	const pageTitle = `J.H.E.L${title ? ` | ${title}` : ''}`;
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={description} />
	<meta name="robots" content="index,follow" />
	<meta name="og:title" content={title} />
	<meta name="og:description" content={description} />
	<meta name="og:image" content={imageUrl} />
</svelte:head>
