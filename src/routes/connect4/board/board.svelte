<script lang="ts">
	import { T } from '@threlte/core';
	import Tile from './tile.svelte';
	import { Vector3, Vector2 } from 'three';

	export let canvasWidth: number;
	export let canvasHeight: number;

	const TILES_PER_ROW = 6;
	const TILES = TILES_PER_ROW ** 2;

	const boardSize = canvasHeight;
	const tileSize = boardSize / TILES_PER_ROW;

	let tileCount = 0;
	setInterval(() => {
		tileCount = tileCount % TILES;
		tileCount += 1;
	}, 500);

	$: tiles = Array.from(
		{ length: tileCount },
		(_, i) =>
			({
				size: new Vector2(tileSize, tileSize),
				position: new Vector3(
					-boardSize / 2 + tileSize / 2 + (i % TILES_PER_ROW) * tileSize,
					-boardSize / 2 + tileSize / 2 + Math.floor(i / TILES_PER_ROW) * tileSize,
					0
				),
				player: 1
			} as const)
	);
</script>

<T.Mesh>
	<T.PlaneGeometry args={[boardSize, boardSize]} />
	<T.MeshBasicMaterial color="lightgray" />
</T.Mesh>

{#each tiles as tile}
	<Tile position={tile.position} size={tile.size} player={tile.player} />
{/each}
