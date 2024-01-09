<script lang="ts">
	import { T } from '@threlte/core';
	import { BoxGeometry, EdgesGeometry, LineBasicMaterial, LineSegments } from 'three';

	export let args: ConstructorParameters<typeof BoxGeometry>;

	const geometry = new BoxGeometry(...args);
	const edges = new EdgesGeometry(geometry);
	const lineMaterial = new LineBasicMaterial({
		color: 'red'
	});
	const lines = new LineSegments(edges, lineMaterial);
</script>

<T.Group>
	<T.Mesh>
		<T is={geometry} />
		<T.MeshStandardMaterial color="blue" opacity={0.4} transparent />
	</T.Mesh>
	<T is={lines} />
</T.Group>
