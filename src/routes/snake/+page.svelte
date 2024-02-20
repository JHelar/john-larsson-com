<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { Debug, World } from '@threlte/rapier';
	import Scene from './scene.svelte';
</script>

<div class="w-screen aspect-video">
	<Canvas>
		<World>
			<Debug />
			<Scene />
		</World>
	</Canvas>
</div>
