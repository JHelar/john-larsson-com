<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { Color, Vector3 } from 'three';
	import type { Game } from './Game';

	export let game: Game;

	function pointerMove(event: { point: Vector3 }) {
		game.pointerMove(event.point);
	}

	function onClick() {
		game.pointerPress();
	}
	const board = game.board;

	useTask((delta) => {
		game.update(delta);
	});
</script>

<T.Mesh on:pointermove={pointerMove} on:click={onClick}>
	<T.PlaneGeometry args={[game.options.boardSize, game.options.boardSize]} />
	<T.MeshBasicMaterial color={Color.NAMES.darkblue} />
</T.Mesh>

{#each game.gridTiles as gridTile}
	<T is={gridTile} />
{/each}

{#each $board as playerTile}
	{#if playerTile}
		<T is={playerTile} />
	{/if}
{/each}
