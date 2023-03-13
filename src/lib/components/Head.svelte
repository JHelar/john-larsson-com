<script lang="ts">
	export let title: string = '';
	export let description: string = 'Fullstack developer from Sweden';

	const pageTitle = `J.H.E.L${title ? ` | ${title}` : ''}`;
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={description} />
	<meta name="robots" content="index,follow" />
</svelte:head>
