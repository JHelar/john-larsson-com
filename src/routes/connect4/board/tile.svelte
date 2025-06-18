<script lang="ts">
	import { MeshStandardMaterial, Vector3, CircleGeometry, Mesh } from 'three';
	import { T, useTask, type ThrelteUseTask } from '@threlte/core';
	import type { TileProps } from '../types';

	export let tileProps: TileProps;
	export let size: number;

	const TILE_GRAVITY = 10;
	const FALL_DIRECTION = new Vector3(0, -1, 0);

	const geometry = new CircleGeometry(size / 2);
	const material = new MeshStandardMaterial({ color: 'yellow' });
	const tileMesh = new Mesh(geometry, material);
	tileMesh.position.set(...tileProps.position.toArray());

	let tileTask: ThrelteUseTask;

	function updateTile(delta: number) {
		if (tileMesh.position.equals(tileProps.destination)) {
			tileTask.stop();
			return;
		}

		tileProps.velocity.add(FALL_DIRECTION.clone().multiplyScalar(TILE_GRAVITY * delta));
		tileMesh.position.add(tileProps.velocity);
		if (Math.abs(tileProps.destination.y - tileMesh.position.y) <= TILE_GRAVITY) {
			tileMesh.position.copy(tileProps.destination);
		}
	}

	tileTask = useTask((delta) => {
		updateTile(delta);
	});
</script>

<T is={tileMesh} />
