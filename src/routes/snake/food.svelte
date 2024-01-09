<script lang="ts">
	import { T } from '@threlte/core';
	import { AutoColliders, RigidBody } from '@threlte/rapier';
	import { Group, MathUtils, Vector3 } from 'three';
	const FOOD_SIZE = 1;
	const DIRECTIONS = [
		[new Vector3(0, 1, 0), new Vector3(1, 0, 1)],
		[new Vector3(0, -1, 0), new Vector3(1, 0, 1)],
		[new Vector3(1, 0, 0), new Vector3(0, 1, 1)],
		[new Vector3(-1, 0, 0), new Vector3(0, 1, 1)],
		[new Vector3(0, 0, 1), new Vector3(1, 1, 0)],
		[new Vector3(0, 0, -1), new Vector3(1, 1, 0)]
	];

	export let edgePoint: number;
	const index = MathUtils.randInt(0, DIRECTIONS.length - 1);
	const [direction, face] = DIRECTIONS[index];
	const position = face
		.clone()
		.multiplyScalar(MathUtils.randFloat(-edgePoint + FOOD_SIZE / 2, edgePoint - FOOD_SIZE / 2))
		.add(direction.clone().multiplyScalar(edgePoint + FOOD_SIZE / 2));
</script>

<T.Group position.x={position.x} position.y={position.y} position.z={position.z}>
	<RigidBody type="fixed">
		<AutoColliders
			shape="cuboid"
			on:collisionenter={console.log}
			on:contact={console.log}
			on:sensorenter={console.log}
		>
			<T.Mesh>
				<T.BoxGeometry args={[FOOD_SIZE, FOOD_SIZE, FOOD_SIZE]} />
				<T.MeshBasicMaterial color="red" />
			</T.Mesh>
		</AutoColliders>
	</RigidBody>
</T.Group>
