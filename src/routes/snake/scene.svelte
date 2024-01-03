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
	const ROTATION_SPEED = 25 * MathUtils.DEG2RAD;
	const CAMERA_ZOOM = 50;

	const forwardVector = new Vector3(-1, 0, 0);
	let face = 0;
	let horizontalDirection = 1;

	const camera = new OrthographicCamera();
	let bodyRotation = 0;
	let toRotation = 0;
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
		console.log(input);
		switch (input) {
			case InputKey.Up:
				forwardVector.set(0, -1, 0);
				break;
			case InputKey.Down:
				forwardVector.set(0, 1, 0);
				break;
			case InputKey.Left:
				forwardVector.set(-1, 0, 0);
				horizontalDirection = 1;
				break;
			case InputKey.Right:
				forwardVector.set(1, 0, 0);
				horizontalDirection = -1;
				break;
			default:
				break;
		}
	});

	const {
		task: bodyTask,
		start: startBody,
		stop: stopBody
	} = useTask((delta) => {
		const oldPositions = parts.map(({ position }) => position);
		for (let i = 1; i < parts.length; i++) {
			parts[i].position.lerp(oldPositions[i - 1], PART_SPEED * delta);
		}

		const head = parts[0];
		const vector = forwardVector.clone();
		head.position.add(vector.multiplyScalar(PART_SPEED * delta));

		parts[0].position = head.position;
	});

	const {
		start: startRotation,
		stop: stopRotation,
		task: rotationTask
	} = useTask((delta) => {
		if (horizontalDirection < 0) {
			bodyRotation -= ROTATION_SPEED * delta;
		} else {
			bodyRotation += ROTATION_SPEED * delta;
		}
	});

	useTask(
		() => {
			const rotationDiff = Math.abs((bodyRotation - toRotation) * MathUtils.RAD2DEG);
			if (rotating && rotationDiff <= 0.1) {
				bodyRotation = toRotation;
				stopRotation();
				rotating = false;
				return;
			}

			const head = parts[0];
			const maxX = camera.right / camera.zoom;
			const minX = -maxX;

			const maxY = camera.top / camera.zoom;
			const minY = -maxY;

			const forwadPos = Math.floor(forwardVector.clone().dot(head.position));
			if (forwadPos > maxX) {
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
				toRotation = bodyRotation + 90 * horizontalDirection * MathUtils.DEG2RAD;
				rotating = true;
				startRotation();
			}
		},
		{ after: [bodyTask, rotationTask] }
	);
	stopRotation();
</script>

<Input />

<T is={camera} position={[0, 0, CAMERA_ZOOM]} makeDefault zoom={CAMERA_ZOOM} />
<!-- <T.PerspectiveCamera position={[0, 0, 50]} castShadow /> -->
<T.DirectionalLight position={[0, 0, 25]} intensity={2} castShadow />

<T.Group position={[0, 0, 0]} rotation.y={bodyRotation}>
	<T.Mesh>
		<T.BoxGeometry args={[CAMERA_ZOOM / 2, CAMERA_ZOOM / 2, CAMERA_ZOOM / 2]} />
		<T.MeshStandardMaterial color={'green'} />
	</T.Mesh>
	{#each parts as part}
		<T is={part.mesh} position={[part.position.x, part.position.y, part.position.z]}>
			<T.BoxGeometry args={part.size} />
			<T.MeshStandardMaterial color={part.color} />
		</T>
	{/each}
</T.Group>
