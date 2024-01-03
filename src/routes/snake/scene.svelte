<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core';
	import { Color, Mesh, OrthographicCamera, Vector3 } from 'three';
	import Input from './input.svelte';
	import { InputKey, inputStore } from './inputMap';
	import { get } from 'svelte/store';

	const headColor = new Color('hotpink');
	const tailColor = new Color('red');
	const PART_COUNT = 10;
	const PART_SIZE = 1;
	const PART_SPEED = 10;

	let moveVector = new Vector3(-1, 0, 0);

	const parts = Array(PART_COUNT)
		.fill(0)
		.map((_, i) => {
			const part = {
				mesh: new Mesh(),
				position: new Vector3(i * PART_SIZE, 0, 0),
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
			const oldPositions = parts.map(({ position }) => position);
			for (let i = 1; i < parts.length; i++) {
				parts[i].position.lerp(oldPositions[i - 1], PART_SPEED * delta);
			}

			const head = parts[0];
			const vector = moveVector.clone();
			head.position.add(vector.multiplyScalar(PART_SPEED * delta));

			parts[0].position = head.position;
		},
		{ after: inputTask }
	);
</script>

<Input />

<T.OrthographicCamera makeDefault position={[0, 0, 1]} zoom={50} />
<T.PerspectiveCamera position={[0, 0, 50]} />
<T.AmbientLight position={[0, 0, 1]} intensity={2} />

{#each parts as part}
	<T is={part.mesh} position={[part.position.x, part.position.y, part.position.z]}>
		<T.BoxGeometry args={part.size} />
		<T.MeshStandardMaterial color={part.color} />
	</T>
{/each}
