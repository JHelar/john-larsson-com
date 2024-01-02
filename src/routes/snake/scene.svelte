<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { Color, Vector3 } from 'three';
	import Input from './input.svelte';
	import { InputKey, inputStore } from './inputMap';
	import { get } from 'svelte/store';

	const headColor = new Color('hotpink');
	const tailColor = new Color('red');
	const PART_COUNT = 5;
	const PART_SIZE = 1;
	const PART_SPEED = 10;

	let moveVector = new Vector3(-1, 0, 0);

	const parts = Array(PART_COUNT)
		.fill(0)
		.map<{
			position: [x: number, y: number, z: number];
			size: [width: number, height: number, depth: number];
			color: Color;
		}>((_, i) => {
			const part = {
				position: [i * PART_SIZE, 0, 0],
				size: [PART_SIZE, PART_SIZE, PART_SIZE],
				color: headColor.clone().lerp(tailColor, i / PART_COUNT)
			};
			return part;
		});

	const { task: inputTask } = useTask(() => {
		const input = get(inputStore);
		switch (input) {
			case InputKey.Up:
				moveVector = new Vector3(0, 1, 0);
				break;
			case InputKey.Down:
				moveVector = new Vector3(0, -1, 0);
				break;
			case InputKey.Left:
				moveVector = new Vector3(1, 0, 0);
				break;
			case InputKey.Right:
				moveVector = new Vector3(-1, 0, 0);
				break;
			default:
				break;
		}
	});

	useTask(
		(delta) => {
			const oldPositions = parts.map(({ position }) => new Vector3(...position));
			for (let i = 1; i < parts.length; i++) {
				const vector = new Vector3(...parts[i].position);
				vector.lerp(oldPositions[i - 1], PART_SPEED * delta);

				parts[i].position[0] = vector.x;
				parts[i].position[1] = vector.y;
				parts[i].position[2] = vector.z;
			}

			const vector = moveVector.clone();
			vector.multiplyScalar(PART_SPEED * delta);

			parts[0].position[0] += vector.x;
			parts[0].position[1] += vector.y;
			parts[0].position[2] += vector.z;
		},
		{ after: inputTask }
	);
</script>

<Input />

<T.PerspectiveCamera
	makeDefault
	position={[0, 0, 50]}
	on:create={({ ref }) => {
		ref.lookAt(0, 0, 0);
	}}
/>
<T.DirectionalLight position={[0, 0, 10]} intensity={2} castShadow />

{#each parts as part}
	<T.Mesh position={part.position} castShadow>
		<T.BoxGeometry args={part.size} />
		<T.MeshStandardMaterial color={part.color} />
	</T.Mesh>
{/each}
