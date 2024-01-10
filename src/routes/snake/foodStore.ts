import { readonly, writable } from 'svelte/store';
import { MathUtils, Vector3 } from 'three';

export const FOOD_SIZE = 1;
const DIRECTIONS = [
	[new Vector3(0, 1, 0), new Vector3(1, 0, 1)],
	[new Vector3(0, -1, 0), new Vector3(1, 0, 1)],
	[new Vector3(1, 0, 0), new Vector3(0, 1, 1)],
	[new Vector3(-1, 0, 0), new Vector3(0, 1, 1)],
	[new Vector3(0, 0, 1), new Vector3(1, 1, 0)],
	[new Vector3(0, 0, -1), new Vector3(1, 1, 0)]
];

const position = writable(new Vector3());

export function newFood(edgePoint: number) {
	const index = MathUtils.randInt(0, DIRECTIONS.length - 1);
	const [direction, face] = DIRECTIONS[index];
	const newPosition = face
		.clone()
		.multiplyScalar(MathUtils.randFloat(-edgePoint + FOOD_SIZE / 2, edgePoint - FOOD_SIZE / 2))
		.add(direction.clone().multiplyScalar(edgePoint + FOOD_SIZE / 2));
	position.set(newPosition);
}

export const foodPosition = readonly(position);
