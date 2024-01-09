<script lang="ts">
	import { T, useTask, watch } from '@threlte/core';
	import {
		Color,
		Mesh,
		OrthographicCamera,
		Vector3,
		Group,
		ArrowHelper,
		Vector2,
		Object3D
	} from 'three';
	import Input from './input.svelte';
	import { InputKey, inputStore } from './inputMap';
	import Box from './box.svelte';
	import Food from './food.svelte';
	import { useRapier } from '@threlte/rapier';

	let headCollider;
	const headColor = new Color('hotpink');
	const tailColor = new Color('red');
	const PART_COUNT = 5;
	const PART_SIZE = 1;
	const PART_SPEED = 10;
	const ROTATION_SPEED = 0.02;
	const CAMERA_ZOOM = 50;

	const UP = new Vector3(0, 1, 0);
	const DOWN = new Vector3(0, -1, 0);
	const RIGHT = new Vector3(1, 0, 0);
	const LEFT = new Vector3(-1, 0, 0);

	const FLOOR_X = CAMERA_ZOOM / 8 + PART_SIZE / 2;

	let forwardVector = RIGHT;
	let perpendicularVector = DOWN;

	const camera = new OrthographicCamera();
	const body = new Group();
	const cameraPoint = new Object3D();

	const directionVectors = [
		new Vector3(0, 0, 1), // Front
		UP.clone(), // Top
		RIGHT.clone(), // Right
		DOWN.clone(), // Bottom
		LEFT.clone(), // Left
		new Vector3(0, 0, -1) // Back
	];
	let currentRotationY = 0;
	let toRotationY = 0;
	let currentRotationX = 0;
	let toRotationX = 0;
	let isRotating = false;

	const headArrows = [
		new ArrowHelper(forwardVector, new Vector3(), 5, '#41b6e6')
		// new ArrowHelper(new Vector3(0, 0, -1), new Vector3(), 5, '#41b6a6')
	];
	const worldArrows = directionVectors.map(
		(vec, i) =>
			new ArrowHelper(
				vec,
				new Vector3(),
				5 + i,
				new Color('red').lerp(new Color('blue'), (i + 1) / directionVectors.length)
			)
	);

	const parts = Array(PART_COUNT)
		.fill(0)
		.map((_, i) => {
			const part = {
				mesh: new Mesh(),
				position: new Vector3(i * PART_SIZE, 0, FLOOR_X),
				size: [PART_SIZE, PART_SIZE, PART_SIZE],
				color: headColor.clone().lerp(tailColor, i / PART_COUNT)
			};
			return part;
		});

	const { world, rapier } = useRapier();
	const colliderDesc = rapier.ColliderDesc.cuboid(
		PART_SIZE / 2,
		PART_SIZE / 2,
		PART_SIZE / 2
	).setSensor(true);
	const colliderHandle = world.createCollider(colliderDesc, undefined);

	function updateDirectionVectors(newRotation: Vector2) {
		if (isRotating) return false;

		if (newRotation.x > 0) {
			const temp = directionVectors[5].clone();
			directionVectors[5] = directionVectors[1].clone();
			directionVectors[1] = directionVectors[0].clone();
			directionVectors[0] = directionVectors[3].clone();
			directionVectors[3] = temp;
		} else if (newRotation.x < 0) {
			const temp = directionVectors[5].clone();
			directionVectors[5] = directionVectors[3].clone();
			directionVectors[3] = directionVectors[0].clone();
			directionVectors[0] = directionVectors[1].clone();
			directionVectors[1] = temp;
		} else if (newRotation.y > 0) {
			const temp = directionVectors[4].clone();
			directionVectors[4] = directionVectors[0].clone();
			directionVectors[0] = directionVectors[2].clone();
			directionVectors[2] = directionVectors[5].clone();
			directionVectors[5] = temp;
		} else if (newRotation.y < 0) {
			const temp = directionVectors[5].clone();
			directionVectors[5] = directionVectors[2].clone();
			directionVectors[2] = directionVectors[0].clone();
			directionVectors[0] = directionVectors[4].clone();
			directionVectors[4] = temp;
		}

		worldArrows.forEach((arrow, i) => arrow.setDirection(directionVectors[i]));
		toRotationX += newRotation.x;
		toRotationY += newRotation.y;
		isRotating = true;
	}

	function getFrontVector() {
		return directionVectors[0];
	}

	function getBackVector() {
		return directionVectors[5];
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

	watch(inputStore, (input) => {
		switch (input) {
			case InputKey.Up:
				perpendicularVector = getRightVector();
				if (forwardVector.equals(getFrontVector()) || forwardVector.equals(getBackVector())) {
					forwardVector = getBackVector();
				} else {
					forwardVector = getUpVector();
				}
				break;
			case InputKey.Down:
				{
					perpendicularVector = getLeftVector();
					if (forwardVector.equals(getFrontVector()) || forwardVector.equals(getBackVector())) {
						forwardVector = getFrontVector();
					} else {
						forwardVector = getDownVector();
					}
				}
				break;
			case InputKey.Left:
				{
					perpendicularVector = getUpVector();
					if (forwardVector.equals(getFrontVector()) || forwardVector.equals(getBackVector())) {
						forwardVector = getFrontVector();
					} else {
						forwardVector = getLeftVector();
					}
				}
				break;
			case InputKey.Right:
				{
					perpendicularVector = getDownVector();
					if (forwardVector.equals(getFrontVector()) || forwardVector.equals(getBackVector())) {
						forwardVector = getBackVector();
					} else {
						forwardVector = getRightVector();
					}
				}
				break;
			case InputKey.RotateLeft:
				updateDirectionVectors(new Vector2(0, -Math.PI / 2));
				break;
			case InputKey.RotateRight:
				updateDirectionVectors(new Vector2(0, Math.PI / 2));
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
		headArrows[0].setDirection(forwardVector);
	});

	useTask(() => {
		if (!isRotating) return;

		const remainingRotationX = toRotationX - currentRotationX;
		const remainingRotationY = toRotationY - currentRotationY;

		if (remainingRotationX !== 0) {
			if (Math.abs(remainingRotationX) > ROTATION_SPEED) {
				cameraPoint.rotateX(remainingRotationX > 0 ? ROTATION_SPEED : -ROTATION_SPEED);
				currentRotationX += remainingRotationX > 0 ? ROTATION_SPEED : -ROTATION_SPEED;
			} else {
				currentRotationX = toRotationX = Math.abs(toRotationX % (Math.PI * 2));
				cameraPoint.rotateX(remainingRotationX);
				isRotating = false;
			}
		}
		if (remainingRotationY !== 0) {
			if (Math.abs(remainingRotationY) > ROTATION_SPEED) {
				cameraPoint.rotateY(remainingRotationY > 0 ? ROTATION_SPEED : -ROTATION_SPEED);
				currentRotationY += remainingRotationY > 0 ? ROTATION_SPEED : -ROTATION_SPEED;
			} else {
				cameraPoint.rotateY(remainingRotationY);
				currentRotationY = toRotationY = Math.abs(toRotationY % (Math.PI * 2));
				isRotating = false;
			}
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
		colliderHandle.setTranslation(head.position);
	});

	useTask(
		() => {
			const head = parts[0];
			const maxX = FLOOR_X;
			const minX = -maxX;

			const forwardPos = Math.floor(forwardVector.clone().dot(head.position));
			if (forwardPos > maxX) {
				head.position.clampScalar(minX, maxX);
				forwardVector.cross(perpendicularVector);
				headArrows[0].setDirection(forwardVector);
			}
		},
		{ after: [bodyTask] }
	);
</script>

<Input />

<T is={cameraPoint}>
	<T is={camera} position={[0, 0, CAMERA_ZOOM]} makeDefault zoom={CAMERA_ZOOM} />
	<T.DirectionalLight position={[0, 0, CAMERA_ZOOM / 2]} intensity={2} castShadow />
</T>

{#each worldArrows as arrow}
	<T is={arrow} />
{/each}
<T is={body}>
	<Box args={[CAMERA_ZOOM / 4, CAMERA_ZOOM / 4, CAMERA_ZOOM / 4]} />
	<Food edgePoint={CAMERA_ZOOM / 8} />
	{#each parts as part, index}
		{#if index === 0}
			<T is={part.mesh} position={[part.position.x, part.position.y, part.position.z]}>
				<T.BoxGeometry args={part.size} />
				<T.MeshStandardMaterial color={part.color} />
				{#each headArrows as arrow}
					<T is={arrow} />
				{/each}
			</T>
		{:else}
			<T is={part.mesh} position={[part.position.x, part.position.y, part.position.z]}>
				<T.BoxGeometry args={part.size} />
				<T.MeshStandardMaterial color={part.color} />
				{#each headArrows as arrow}
					<T is={arrow} />
				{/each}
			</T>
		{/if}
	{/each}
</T>
