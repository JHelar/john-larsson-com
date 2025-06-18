<script>
	import Head from '$lib/components/Head.svelte';
	import { Canvas } from '@threlte/core';
	import { World } from '@threlte/rapier';
	import Scene from './scene.svelte';
</script>

<Head title="Connect 4" description="The classic game of connect 4" />
<div class="w-screen aspect-video">
	<Canvas>
		<World>
			<Scene />
		</World>
	</Canvas>
</div>
