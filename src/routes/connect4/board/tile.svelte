<script lang="ts">
	import type { CircleGeometry, MeshStandardMaterial, Vector3, Vector2 } from 'three';
	import { T } from '@threlte/core';

	export let position: Vector3;
	export let size: Vector2;
	export let player: 1 | 0;
</script>

<T.Mesh position={position.toArray()}>
	<T.CircleGeometry args={[size.divideScalar(2).x]} />
	<T.MeshStandardMaterial color={'yellow'} />
</T.Mesh>
