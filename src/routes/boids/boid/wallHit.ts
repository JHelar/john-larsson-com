import { Vector2 } from 'three';
import type { UpdateContext } from '../types';
import { BOID_SIZE } from './consts';
import type { Boid } from './types';
import { getRayPoint, getRotation, reflect, Vector } from './vector';

export function wallHit(boid: Boid, { context }: UpdateContext) {
	const rp = getRayPoint(0, boid.position, boid.direction, getRotation(boid.direction));
	const canvas = new Vector2(context.canvas.width, context.canvas.height).sub(BOID_SIZE);
	let hitNormal: Vector2 | undefined;
	if (rp.x <= 0) hitNormal = Vector.Right;
	else if (rp.x >= canvas.x) hitNormal = Vector.Left;
	else if (rp.y <= 0) hitNormal = Vector.Down;
	else if (rp.y >= canvas.y) hitNormal = Vector.Up;

	if (hitNormal) {
		return reflect(boid.direction, hitNormal);
	}
	return boid.direction;
}
