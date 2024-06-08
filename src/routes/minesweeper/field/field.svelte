<script>
	import { T } from '@threlte/core';
	import { fieldSize, tiles } from './fieldStore';
	import Tile from './tile.svelte';
	import { gameTileTypes, openTile, revealedTiles } from '../gameLogic';
</script>

<T.Mesh>
	<T.PlaneGeometry args={[$fieldSize, $fieldSize]} />
	<T.MeshBasicMaterial color="lightgray" />
</T.Mesh>

{#each $tiles as tile}
	<Tile
		position={tile.position}
		size={tile.size}
		type={$gameTileTypes.at(tile.index) ?? 0}
		reveal={$revealedTiles.find(({ tileIndex }) => tile.index === tileIndex)}
		on:click={() => openTile(tile.index)}
	/>
{/each}
