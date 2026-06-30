<script>
	import Head from '$lib/components/Head.svelte';
	import { initialize } from './boids';
</script>

<Head title="Biods algorithm" description="Simulation of boids algorithm" />
<div class="w-screen m-auto">
	<canvas class="w-full" use:initialize />
</div>
