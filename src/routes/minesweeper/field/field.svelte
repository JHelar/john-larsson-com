<script>
	import { T } from '@threlte/core';
	import { fieldSize, openTile, revealedTiles, tiles } from './fieldStore';
	import Tile from './tile.svelte';
</script>

<T.Mesh>
	<T.PlaneGeometry args={[$fieldSize, $fieldSize]} />
	<T.MeshBasicMaterial color="lightgray" />
</T.Mesh>

{#each $tiles as tile}
	<Tile
		position={tile.position}
		size={tile.size}
		type={tile.type}
		reveal={$revealedTiles.includes(tile.index)}
		on:click={() => openTile(tile.index)}
	/>
{/each}
