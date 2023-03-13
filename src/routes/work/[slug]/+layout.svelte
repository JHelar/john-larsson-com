<script>
	import Head from '$lib/components/Head.svelte';
	import './layout.css';
	export let data;
</script>

<Head title={data.title} description={data.description} />

<article class="container pt-12">
	<slot />
</article>
