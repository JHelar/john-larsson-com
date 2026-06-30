import { Vector2 } from 'three';
import type { Boid } from './types';
import { getRotation } from './vector';

export function createBoid(index: number, position: Vector2): Boid {
	const boid = {
		index,
		rotation: 0,
		position,
		direction: new Vector2(-1 + Math.random() * 2, -1 + Math.random() * 2).normalize()
	};

	boid.rotation = getRotation(boid.direction);
	return boid;
}
