import type { UpdateContext } from '../types';
import { alignment } from './alignment';
import { cohesion } from './cohesion';
import {
	SEPARATION_MULTIPLIER,
	ALIGNMENT_MULTIPLIER,
	COHESION_MULTIPLIER,
	BOID_STEER_FORCE,
	BOID_SPEED
} from './consts';
import { separation } from './separation';
import type { Boid } from './types';
import { Vector, limit, getRotation } from './vector';
import { wallHit } from './wallHit';

export function updateBoid(boid: Boid, context: UpdateContext) {
	if (context.deltaTime === 0) return;

	const steer = Vector.Zero;
	steer.add(separation(boid, context).multiplyScalar(SEPARATION_MULTIPLIER));
	steer.add(alignment(boid, context).multiplyScalar(ALIGNMENT_MULTIPLIER));
	steer.add(cohesion(boid, context).multiplyScalar(COHESION_MULTIPLIER));
	boid.direction.add(limit(steer, BOID_STEER_FORCE)).normalize();

	boid.direction = wallHit(boid, context);
	boid.rotation = getRotation(boid.direction);

	const velocity = boid.direction.clone().multiplyScalar(BOID_SPEED * context.deltaTime);
	boid.position.add(velocity);
}
