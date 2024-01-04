<script lang="ts">
	import { T, useTask, watch } from '@threlte/core';
	import {
		Color,
		Mesh,
		OrthographicCamera,
		Vector3,
		MathUtils,
		Group,
		AxesHelper,
		ArrowHelper,
		Quaternion,
		Matrix4,
		Vector2
	} from 'three';
	import Input from './input.svelte';
	import { InputKey, inputStore } from './inputMap';

	const headColor = new Color('hotpink');
	const tailColor = new Color('red');
	const PART_COUNT = 5;
	const PART_SIZE = 1;
	const PART_SPEED = 10;
	const ROTATION_SPEED = 0.02;
	const CAMERA_ZOOM = 50;

	let forwardVector = new Vector3(-1, 0, 0);
	const camera = new OrthographicCamera();
	const body = new Group();

	const directionVectors = [
		new Vector3(0, 0, 1), // Front
		new Vector3(0, 1, 0), // Top
		new Vector3(1, 0, 0), // Right
		new Vector3(0, -1, 0), // Bottom
		new Vector3(-1, 0, 0), // Left
		new Vector3(0, 0, -1) // Back
	];
	let currentRotationY = 0;
	let toRotationY = 0;
	let currentRotationX = 0;
	let toRotationX = 0;
	let isRotating = false;

	const arrow = new ArrowHelper(forwardVector, new Vector3(), 5, '#41b6e6');
	const upVector = new Vector3(0, 0, 0);
	const worldQuaternion = new Quaternion();
	const cubeArrow = new ArrowHelper(forwardVector, new Vector3(), 10, '#fce300');
	// const cubeArrowLeft = new ArrowHelper(new Vector3(-1, 0, 0), new Vector3(), 10, '#ff5fa2');
	// const cubeArrowRight = new ArrowHelper(new Vector3(1, 0, 0), new Vector3(), 10, '#a9431e');

	const parts = Array(PART_COUNT)
		.fill(0)
		.map((_, i) => {
			const part = {
				mesh: new Mesh(),
				position: new Vector3(i * PART_SIZE, 0, CAMERA_ZOOM / 4),
				size: [PART_SIZE, PART_SIZE, PART_SIZE],
				color: headColor.clone().lerp(tailColor, i / PART_COUNT)
			};
			return part;
		});

	function updateDirectionVectors(newRotation: Vector2) {
		if (isRotating) return;

		if (newRotation.x < 0) {
			const temp = directionVectors[5].clone();
			directionVectors[5] = directionVectors[1];
			directionVectors[1] = directionVectors[0];
			directionVectors[0] = directionVectors[3];
			directionVectors[3] = temp;
		} else if (newRotation.x > 0) {
			const temp = directionVectors[5].clone();
			directionVectors[5] = directionVectors[3];
			directionVectors[3] = directionVectors[0];
			directionVectors[0] = directionVectors[1];
			directionVectors[1] = temp;
		} else if (newRotation.y < 0) {
			const temp = directionVectors[5].clone();
			directionVectors[5] = directionVectors[2];
			directionVectors[2] = directionVectors[0];
			directionVectors[0] = directionVectors[4];
			directionVectors[4] = temp;
		} else if (newRotation.y > 0) {
			const temp = directionVectors[5].clone();
			directionVectors[5] = directionVectors[2];
			directionVectors[2] = directionVectors[0];
			directionVectors[0] = directionVectors[4];
			directionVectors[4] = temp;
		}

		toRotationX += newRotation.x;
		toRotationY += newRotation.y;
		isRotating = true;
	}

	function getUpVector() {
		return directionVectors[1];
	}

	function getRightVector() {
		return directionVectors[2];
	}

	function getLeftVector() {
		return directionVectors[4];
	}

	function getDownVector() {
		return directionVectors[3];
	}

	function getFrontVector() {
		return directionVectors[0];
	}

	function getBackVector() {
		return directionVectors[5];
	}

	watch(inputStore, (input) => {
		switch (input) {
			case InputKey.Up:
				forwardVector = getUpVector();
				break;
			case InputKey.Down:
				forwardVector = getDownVector();
				break;
			case InputKey.Left:
				forwardVector = getLeftVector();
				break;
			case InputKey.Right:
				forwardVector = getRightVector();
				break;
			case InputKey.RotateLeft:
				updateDirectionVectors(new Vector2(0, Math.PI / 2));
				break;
			case InputKey.RotateRight:
				updateDirectionVectors(new Vector2(0, -Math.PI / 2));
				break;
			case InputKey.RotateUp:
				updateDirectionVectors(new Vector2(-Math.PI / 2, 0));
				break;
			case InputKey.RotateDown:
				updateDirectionVectors(new Vector2(Math.PI / 2, 0));
				break;
			default:
				break;
		}
		arrow.setDirection(forwardVector);
		cubeArrow.setDirection(getUpVector());
	});

	useTask(() => {
		if (!isRotating) return;

		const remainingRotationX = toRotationX - currentRotationX;
		const remainingRotationY = toRotationY - currentRotationY;

		if (remainingRotationX !== 0) {
			if (Math.abs(remainingRotationX) > ROTATION_SPEED) {
				body.rotateOnWorldAxis(
					getRightVector(),
					remainingRotationX > 0 ? ROTATION_SPEED : -ROTATION_SPEED
				);
				currentRotationX += remainingRotationX > 0 ? ROTATION_SPEED : -ROTATION_SPEED;
			} else {
				body.setRotationFromAxisAngle(getRightVector(), toRotationX);
				currentRotationX = toRotationX;
				isRotating = false;
			}
		} else if (remainingRotationY !== 0) {
			if (Math.abs(remainingRotationY) > ROTATION_SPEED) {
				body.rotateOnWorldAxis(
					getUpVector(),
					remainingRotationY > 0 ? ROTATION_SPEED : -ROTATION_SPEED
				);
				currentRotationY += remainingRotationY > 0 ? ROTATION_SPEED : -ROTATION_SPEED;
			} else {
				body.setRotationFromAxisAngle(getUpVector(), toRotationY);
				currentRotationY = toRotationY;
				isRotating = false;
			}
		}
	});

	const { task: bodyTask, stop } = useTask((delta) => {
		const oldPositions = parts.map(({ position }) => position);
		for (let i = 1; i < parts.length; i++) {
			parts[i].position.lerp(oldPositions[i - 1], PART_SPEED * delta);
		}

		const head = parts[0];
		const vector = forwardVector.clone();
		head.position.add(vector.multiplyScalar(PART_SPEED * delta));

		parts[0].position = head.position;
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
				if (forwardVector.x !== 0) {
					forwardVector.set(0, 0, head.position.z < 0 ? 1 : -1);
					head.position.setX(MathUtils.clamp(head.position.x, minX, maxX));
				} else if (forwardVector.z !== 0) {
					forwardVector.set(head.position.x < 0 ? 1 : -1, 0, 0);
					head.position.setZ(MathUtils.clamp(head.position.z, minX, maxX));
				}
				arrow.setDirection(forwardVector);
				return;
			}
			// const verticalPos = Math.floor(
			// 	forwardVector.clone().multiply(new Vector3(0, 1, 1)).dot(head.position)
			// );
			// if (verticalPos > maxY) {
			// 	if (forwardVector.y !== 0) {
			// 		forwardVector.set(0, 0, head.position.z < 0 ? 1 : -1);
			// 		head.position.setY(MathUtils.clamp(head.position.y, minY, maxY));
			// 	} else if (forwardVector.z !== 0) {
			// 		forwardVector.set(0, head.position.y < 0 ? 1 : -1, 0);
			// 		head.position.setZ(MathUtils.clamp(head.position.z, minY, maxY));
			// 	}
			// 	arrow.setDirection(forwardVector);
			// }
		},
		{ after: [bodyTask] }
	);
</script>

<Input />

<T is={camera} position={[0, 0, CAMERA_ZOOM]} makeDefault zoom={CAMERA_ZOOM} />
<!-- <T.PerspectiveCamera position={[0, 0, 50]} castShadow /> -->
<T.DirectionalLight position={[0, 0, 25]} intensity={2} castShadow />

<T is={body} position={[0, 0, 0]}>
	<T.Mesh>
		<T.BoxGeometry args={[CAMERA_ZOOM / 4, CAMERA_ZOOM / 4, CAMERA_ZOOM / 4]} />
		<T.MeshStandardMaterial color={'green'} />
	</T.Mesh>
	{#each parts as part, index}
		<T is={part.mesh} position={[part.position.x, part.position.y, part.position.z]}>
			<T.BoxGeometry args={part.size} />
			<T.MeshStandardMaterial color={part.color} />
			<T.AxesHelper scale={5} />
			{#if index === 0}
				<T is={arrow} />
				<T is={cubeArrow} />
			{/if}
		</T>
	{/each}
</T>
