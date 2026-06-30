import { Vector2 } from 'three';
import { BOID_FLOCK_DISTANCE, POINTS } from './consts';

export const Vector = {
	get Up() {
		return new Vector2(0, -1);
	},
	get Down() {
		return new Vector2(0, 1);
	},
	get Left() {
		return new Vector2(-1, 0);
	},
	get Right() {
		return new Vector2(1, 0);
	},
	get Zero() {
		return new Vector2(0, 0);
	},
	get One() {
		return new Vector2(1, 1);
	}
} as const;

export function limit(vec: Vector2, max: number): Vector2 {
	const len = vec.length();
	if (len > max && len > 0) {
		const scale = max / len;
		vec.x *= scale;
		vec.y *= scale;
	}
	return vec;
}

export function reflect(bodyDirection: Vector2, hitVector: Vector2) {
	const n = hitVector.clone().normalize();
	const v = bodyDirection.clone();

	const dot = v.dot(n);
	const reflection = v.sub(n.multiplyScalar(dot * 2));

	return reflection.normalize();
}

export function getRotation(direction: Vector2) {
	let rotation = POINTS[0].clone().normalize().angleTo(direction);
	if (direction.x < 0) rotation = rotation * -1;
	return rotation;
}

export function getRayPoint(
	pointIndex: number,
	position: Vector2,
	direction: Vector2,
	rotation: number
) {
	const from = POINTS[pointIndex].clone().add(position).rotateAround(position, rotation);
	return from.clone().add(direction.clone().multiplyScalar(BOID_FLOCK_DISTANCE));
}
