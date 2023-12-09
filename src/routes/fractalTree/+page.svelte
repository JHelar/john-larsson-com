<script lang="ts">
	import { initialize } from './fractalTree';
	import Head from '$lib/components/Head.svelte';
</script>

<Head title="Fractal tree" description="An interactive simulation of a fractral tree" />

<div class="container mb-4 flex flex-col">
	<div class="mb-4">
		<h1 class="text-2xl font-semibold mb-2">Fractal tree</h1>
	</div>
</div>
<div class="w-screen m-auto">
	<canvas class="w-full" use:initialize />
</div>
