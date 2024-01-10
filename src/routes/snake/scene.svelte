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
		Object3D,
		MathUtils
	} from 'three';
	import Input from './input.svelte';
	import { InputKey, inputStore } from './inputMap';
	import Box from './box.svelte';
	import Food from './food.svelte';
	import { foodPosition, newFood } from './foodStore';
	import Body from './body.svelte';
	import { onMount } from 'svelte';
	import { PART_SIZE, addBodyPart, headPosition, updateBody } from './bodyStore';

	const ROTATION_SPEED = 0.02;
	const CAMERA_ZOOM = 50;

	const UP = new Vector3(0, 1, 0);
	const DOWN = new Vector3(0, -1, 0);
	const RIGHT = new Vector3(1, 0, 0);
	const LEFT = new Vector3(-1, 0, 0);

	const FLOOR_X = CAMERA_ZOOM / 8;

	let forwardVector = RIGHT;
	let perpendicularVector = DOWN;

	const camera = new OrthographicCamera();
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

		toRotationX += newRotation.x;
		toRotationY += newRotation.y;
		isRotating = true;
	}

	function getFrontVector() {
		return directionVectors[0].clone();
	}

	function getBackVector() {
		return directionVectors[5].clone();
	}

	function getUpVector() {
		return directionVectors[1].clone();
	}

	function getRightVector() {
		return directionVectors[2].clone();
	}

	function getLeftVector() {
		return directionVectors[4].clone();
	}

	function getDownVector() {
		return directionVectors[3].clone();
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
		updateBody(delta, FLOOR_X, forwardVector, perpendicularVector);
	});

	useTask(
		() => {
			const headMax = $headPosition.clone().addScalar(PART_SIZE / 2);
			const headMin = $headPosition.clone().subScalar(PART_SIZE / 2);
			const foodMax = $foodPosition.clone().addScalar(PART_SIZE / 2);
			const foodMin = $foodPosition.clone().subScalar(PART_SIZE / 2);

			const intersectX = headMax.x >= foodMin.x && headMin.x <= foodMax.x;
			const intersectY = headMax.y >= foodMin.y && headMin.y <= foodMax.y;
			const intersectZ = headMax.z >= foodMin.z && headMin.z <= foodMax.z;

			const intersect = intersectX && intersectY && intersectZ;
			if (intersect) {
				newFood(FLOOR_X);
				addBodyPart(forwardVector, FLOOR_X);
			}
		},
		{ after: bodyTask }
	);

	onMount(() => {
		newFood(CAMERA_ZOOM / 8);
		addBodyPart(forwardVector, CAMERA_ZOOM / 8);
	});
</script>

<Input />

<T is={cameraPoint}>
	<T is={camera} position={[0, 0, CAMERA_ZOOM]} makeDefault zoom={CAMERA_ZOOM} />
	<T.DirectionalLight position={[0, 0, CAMERA_ZOOM / 2]} intensity={2} castShadow />
</T>

<T.Group>
	<Box args={[CAMERA_ZOOM / 4, CAMERA_ZOOM / 4, CAMERA_ZOOM / 4]} />
	<Food />
	<Body />
</T.Group>
