<script lang="ts">
	import { T, useThrelte } from '@threlte/core';
	import Board from './board.svelte';
	import { interactivity } from '@threlte/extras';
	import { newGame } from './gameLogic';
	import { Vector4 } from 'three';

	const { size } = useThrelte();

	const zoom = 100;
	const aspect = $size.width / $size.height;
	const cameraPosition = new Vector4(-aspect * zoom, aspect * zoom, zoom, -zoom);
	const game = newGame({ boardSize: $size.height });

	interactivity();
</script>

<T.OrthographicCamera args={[...cameraPosition.toArray(), 0.1, 1000]} position.z={10} makeDefault />
<T.DirectionalLight position={[0, 0, 10]} />
<Board {game} />
