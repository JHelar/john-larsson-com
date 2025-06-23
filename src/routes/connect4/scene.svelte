<script lang="ts">
	import { T, useThrelte } from '@threlte/core';
	import Board from './board.svelte';
	import { interactivity } from '@threlte/extras';
	import { newGame } from './gameLogic';
	import { Vector4 } from 'three';
	import { PlayerTile } from './PlayerTile';

	const { size } = useThrelte();

	const zoom = 100;
	const aspect = $size.width / $size.height;
	const cameraPosition = new Vector4(-aspect * zoom, aspect * zoom, zoom, -zoom);
	const game = newGame({ boardSize: $size.height });

	interactivity();
</script>

<!-- <T.OrthographicCamera args={[...cameraPosition.toArray(), 0.1, 1000]} position.z={10} makeDefault /> -->
<T.PerspectiveCamera
	makeDefault
	position={[-zoom * aspect, 0, zoom * aspect * 3]}
	fov={90}
	on:create={({ ref }) => {
		ref.lookAt(0, 0, 0);
	}}
/>
<T.DirectionalLight
	position={[-$size.height / 2, -$size.height / 2, zoom]}
	rotation={[Math.PI / 4, 0, Math.PI / 2]}
/>
<Board {game} />
