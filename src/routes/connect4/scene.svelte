<script lang="ts">
	import { T, useThrelte } from '@threlte/core';
	import Board from './board/board.svelte';
	import { interactivity } from '@threlte/extras';
	import { onMount } from 'svelte';
	import { newGame } from './gameLogic';
	import { Vector4 } from 'three';

	const { size } = useThrelte();

	const zoom = 100;
	const aspect = $size.width / $size.height;
	const cameraPosition = new Vector4(-aspect * zoom, aspect * zoom, zoom, -zoom);

	interactivity();

	onMount(() => {
		newGame();
	});
</script>

<T.OrthographicCamera args={[...cameraPosition.toArray(), 0.1, 1000]} position.z={10} makeDefault />
<T.DirectionalLight position={[0, 0, 10]} />
<Board canvasWidth={$size.width} canvasHeight={$size.height} />
