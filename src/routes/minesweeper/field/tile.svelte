<script lang="ts">
	import type { TileType } from './types';
	import { T } from '@threlte/core';
	import { createEventDispatcher } from 'svelte';
	import { spring } from 'svelte/motion';

	const scale = spring(1);
	const rotate = spring(0);
	const dispatch = createEventDispatcher();

	let revealed = false;

	function revealTile() {
		if (revealed) return;
		revealed = true;
		rotate.set(Math.PI);
		scale.set(1);
	}

	function click() {
		if (revealed) return;
		dispatch('click');
	}

	function pointerEnter() {
		if (revealed) return;
		scale.set(1.025);
	}

	function pointerLeave() {
		if (revealed) return;
		scale.set(1);
	}

	export let type: TileType;
	export let reveal: boolean;
	export let size: [width: number, height: number, depth: number];
	export let position: [x: number, y: number, z: number];

	$: if (reveal) {
		revealTile();
	}
</script>

<T.Mesh
	scale={$scale}
	{position}
	rotation.y={$rotate}
	on:pointerenter={pointerEnter}
	on:pointerleave={pointerLeave}
	on:click={click}
>
	<T.BoxGeometry args={size} />
	<T.MeshStandardMaterial color={revealed ? 'purple' : 'hotpink'} />
</T.Mesh>
