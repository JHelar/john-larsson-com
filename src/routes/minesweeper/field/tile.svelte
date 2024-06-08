<script lang="ts">
	import type { TileType } from './types';
	import { T } from '@threlte/core';
	import { Text } from '@threlte/extras';
	import { createEventDispatcher } from 'svelte';
	import { spring } from 'svelte/motion';

	export let type: TileType;
	export let reveal: { tileIndex: number; delay: number } | undefined;
	export let size: [width: number, height: number, depth: number];
	export let position: [x: number, y: number, z: number];

	const scale = spring(1);
	const rotate = spring(0);
	const z = spring(position[2]);
	const dispatch = createEventDispatcher();

	let revealed = false;

	function revealTile() {
		if (revealed) return;
		revealed = true;

		if (type === 'mine') {
			setTimeout(() => {
				z.set(size[2] / 2);
				scale.set(1.25);
			}, reveal?.delay);
		} else {
			setTimeout(() => {
				z.set(-size[2] / 2);
				scale.set(1);
			}, reveal?.delay);
		}
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

	$: if (reveal) {
		revealTile();
	}
</script>

<T.Mesh
	scale={$scale}
	position.x={position[0]}
	position.y={position[1]}
	position.z={$z}
	on:pointerenter={pointerEnter}
	on:pointerleave={pointerLeave}
	on:click={click}
>
	<T.BoxGeometry args={size} />
	<T.MeshStandardMaterial color={revealed ? (type === 'mine' ? 'red' : 'teal') : '#FF69B4'} />

	{#if revealed && typeof type === 'number' && type !== 0}
		<Text
			text={type.toString()}
			fontSize={0.25}
			position.z={size[2]}
			position.y={0.2}
			anchorX="center"
			anchorY="center"
			textAlign="center"
		/>
	{/if}
</T.Mesh>
