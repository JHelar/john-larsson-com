<script lang="ts">
	import { T } from '@threlte/core';
	import { Vector3, Shape, Path } from 'three';
	import type { TileProps } from '../types';
	import Tile from './tile.svelte';

	export let canvasWidth: number;
	export let canvasHeight: number;

	const TILES_PER_ROW = 6;
	const TILES = TILES_PER_ROW ** 2;

	const boardSize = canvasHeight;
	const tileSize = boardSize / TILES_PER_ROW;

	const TILE_COLUMN_PRESSED = 3; // 3rd column
	const TILE_DESTINATION_ROW = 0; // 1st row
	const tiles = [
		{
			position: new Vector3(
				-boardSize / 2 + tileSize / 2 + (TILE_COLUMN_PRESSED % TILES_PER_ROW) * tileSize,
				-boardSize / 2 + tileSize / 2 + (TILES_PER_ROW - 1) * tileSize,
				0
			),
			velocity: new Vector3(0, 0, 0),
			destination: new Vector3(
				-boardSize / 2 + tileSize / 2 + (TILE_COLUMN_PRESSED % TILES_PER_ROW) * tileSize,
				-boardSize / 2 + tileSize / 2 + TILE_DESTINATION_ROW * tileSize,
				0
			),
			player: 1 as 1 | 0
		} satisfies TileProps
	];

	const HOLE_RATIO = 0.85;
	const square = new Shape();
	square.moveTo(-tileSize / 2, -tileSize / 2);
	square.lineTo(-tileSize / 2, tileSize / 2);
	square.lineTo(tileSize / 2, tileSize / 2);
	square.lineTo(tileSize / 2, -tileSize / 2);
	square.lineTo(-tileSize / 2, -tileSize / 2); // close the path

	const tileHole = new Path();
	tileHole.absarc(0, 0, (tileSize * HOLE_RATIO) / 2, 0, Math.PI * 2, false);

	square.holes.push(tileHole);

	const boardTiles = Array.from(
		{ length: TILES },
		(_, i) =>
			new Vector3(
				-boardSize / 2 + tileSize / 2 + (i % TILES_PER_ROW) * tileSize,
				-boardSize / 2 + tileSize / 2 + Math.floor(i / TILES_PER_ROW) * tileSize,
				1
			)
	);

	function pointerEnter(event: { point: Vector3 }) {
		const point = event.point.clone().divideScalar(tileSize);
		console.log(point);
	}
</script>

<T.Mesh on:pointerenter={pointerEnter}>
	<T.PlaneGeometry args={[boardSize, boardSize]} />
	<T.MeshBasicMaterial color="lightgray" />
</T.Mesh>

{#each boardTiles as boardTile}
	<T.Mesh position={boardTile.toArray()}>
		<T.ShapeGeometry args={[square]} />
		<T.MeshBasicMaterial color="gray" />
	</T.Mesh>
{/each}

{#each tiles as tile}
	<Tile tileProps={tile} size={tileSize} />
{/each}
