import type { UpdateContext } from '../types';
import { BOID_FLOCK_DISTANCE, BOID_SIZE } from './consts';
import type { Boid } from './types';
import { Vector } from './vector';

export function separation(boid: Boid, { flock }: UpdateContext) {
	const steer = Vector.Zero;
	let count = 0;

	for (let index = 0; index < flock.length; index++) {
		if (index === boid.index) continue;
		const other = flock[index];

		const distance = other.position.distanceTo(boid.position);
		if (distance > 0 && distance < BOID_FLOCK_DISTANCE + BOID_SIZE.x) {
			const diff = boid.position.clone().sub(other.position);
			diff.divideScalar(distance); // weight closer boids more
			steer.add(diff);
			count++;
		}
	}

	if (count > 0) {
		steer.divideScalar(count);
		steer.normalize();
		steer.sub(boid.direction.clone().normalize());
	}
	return steer;
}
