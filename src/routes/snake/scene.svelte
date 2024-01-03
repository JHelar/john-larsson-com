<script lang="ts">
	import { T, useTask, useThrelte, watch } from '@threlte/core';
	import {
		Color,
		Group,
		Mesh,
		OrthographicCamera,
		Vector2,
		Vector3,
		MathUtils,
		PointLight
	} from 'three';
	import Input from './input.svelte';
	import { InputKey, inputStore } from './inputMap';
	import { get } from 'svelte/store';
	import Body from './body.svelte';

	const headColor = new Color('hotpink');
	const tailColor = new Color('red');
	const PART_COUNT = 5;
	const PART_SIZE = 1;
	const PART_SPEED = 10;
	const ROTATION_SPEED = 10;
	const CAMERA_ZOOM = 50;

	const forwardVector = new Vector3(-1, 0, 0);
	let face = 0;
	let horizontalDirection = 1;

	const camera = new OrthographicCamera();
	let bodyRotationY = 0;
	let toRotationY = 0;
	let bodyRotationX = 0;
	let toRotationX = 0;
	let rotating = false;

	const parts = Array(PART_COUNT)
		.fill(0)
		.map((_, i) => {
			const part = {
				mesh: new Mesh(),
				position: new Vector3(i * PART_SIZE, 0, CAMERA_ZOOM / 2),
				size: [PART_SIZE, PART_SIZE, PART_SIZE],
				color: headColor.clone().lerp(tailColor, i / PART_COUNT)
			};
			return part;
		});

	watch(inputStore, (input) => {
		switch (input) {
			case InputKey.Up:
				forwardVector.set(0, 1, 0);
				horizontalDirection = 0;
				break;
			case InputKey.Down:
				forwardVector.set(0, -1, 0);
				horizontalDirection = 0;
				break;
			case InputKey.Left:
				if (horizontalDirection === 1) {
					break;
				}
				if (Math.abs(forwardVector.x) === 1) {
					forwardVector.set(forwardVector.x * -1, 0, 0);
				} else if (Math.abs(forwardVector.z) === 1) {
					forwardVector.set(0, 0, forwardVector.z * -1);
				} else {
					if (face % 2 === 0) {
						forwardVector.set(face <= 1 ? -1 : 1, 0, 0);
					} else {
						forwardVector.set(0, 0, face <= 1 ? -1 : 1);
					}
				}
				horizontalDirection = 1;
				break;
			case InputKey.Right:
				if (horizontalDirection === -1) {
					break;
				}
				if (Math.abs(forwardVector.x) === 1) {
					forwardVector.set(forwardVector.x * -1, 0, 0);
				} else if (Math.abs(forwardVector.z) === 1) {
					forwardVector.set(0, 0, forwardVector.z * -1);
				} else {
					if (face % 0 === 2) {
						forwardVector.set(face <= 1 ? 1 : -1, 0, 0);
					} else {
						forwardVector.set(0, 0, face <= 1 ? 1 : -1);
					}
				}
				horizontalDirection = -1;
				break;
			case InputKey.RotateLeft:
				toRotationY = toRotationY + 90 * MathUtils.DEG2RAD;
				break;
			case InputKey.RotateRight:
				toRotationY = toRotationY - 90 * MathUtils.DEG2RAD;
				break;
			case InputKey.RotateUp:
				toRotationX = toRotationX - 90 * MathUtils.DEG2RAD;
				break;
			case InputKey.RotateDown:
				toRotationX = toRotationX + 90 * MathUtils.DEG2RAD;
				break;
			default:
				break;
		}
	});

	const { task: bodyTask } = useTask((delta) => {
		const oldPositions = parts.map(({ position }) => position);
		for (let i = 1; i < parts.length; i++) {
			parts[i].position.lerp(oldPositions[i - 1], PART_SPEED * delta);
		}

		const head = parts[0];
		const vector = forwardVector.clone();
		head.position.add(vector.multiplyScalar(PART_SPEED * delta));

		parts[0].position = head.position;
	});

	useTask((delta) => {
		bodyRotationY = MathUtils.lerp(bodyRotationY, toRotationY, ROTATION_SPEED * delta);
		bodyRotationX = MathUtils.lerp(bodyRotationX, toRotationX, ROTATION_SPEED * delta);
	});

	useTask(
		() => {
			const head = parts[0];
			const maxX = camera.right / camera.zoom / 2 - PART_SIZE;
			const minX = -maxX;

			const maxY = camera.top / camera.zoom / 2 - PART_SIZE;
			const minY = -maxY;

			const horizontalPos = Math.floor(
				forwardVector.clone().multiply(new Vector3(1, 0, 1)).dot(head.position)
			);
			if (horizontalPos > maxX) {
				face = (face + horizontalDirection) % 4;
				if (face < 0) {
					face = 3;
				}
				const faceDirection = face <= 1 ? -1 : 1;

				if (Math.abs(forwardVector.x) === 1) {
					forwardVector.set(0, 0, faceDirection);
					head.position.setX(MathUtils.clamp(head.position.x, minX, maxX));
				} else if (Math.abs(forwardVector.z) === 1) {
					forwardVector.set(faceDirection, 0, 0);
					head.position.setZ(MathUtils.clamp(head.position.z, minX, maxX));
				}
			}
			const verticalPos = Math.floor(
				forwardVector.clone().multiply(new Vector3(0, 1, 0)).dot(head.position)
			);
			if (verticalPos > maxY) {
			}
		},
		{ after: [bodyTask] }
	);
</script>

<Input />

<T is={camera} position={[0, 0, CAMERA_ZOOM]} makeDefault zoom={CAMERA_ZOOM} />
<!-- <T.PerspectiveCamera position={[0, 0, 50]} castShadow /> -->
<T.DirectionalLight position={[0, 0, 25]} intensity={2} castShadow />

<T.Group position={[0, 0, 0]} rotation.y={bodyRotationY} rotation.x={bodyRotationX}>
	<T.Mesh>
		<T.BoxGeometry args={[CAMERA_ZOOM / 4, CAMERA_ZOOM / 4, CAMERA_ZOOM / 4]} />
		<T.MeshStandardMaterial color={'green'} />
	</T.Mesh>
	{#each parts as part}
		<T is={part.mesh} position={[part.position.x, part.position.y, part.position.z]}>
			<T.BoxGeometry args={part.size} />
			<T.MeshStandardMaterial color={part.color} />
		</T>
	{/each}
</T.Group>
