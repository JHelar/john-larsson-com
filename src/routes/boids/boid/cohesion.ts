import type { UpdateContext } from '../types';
import { BOID_FLOCK_PERCEPTION } from './consts';
import type { Boid } from './types';
import { Vector } from './vector';

export function cohesion(boid: Boid, { flock }: UpdateContext) {
	const averagePosition = Vector.Zero;
	let count = 0;
	for (const other of flock) {
		if (other.index === boid.index) continue;

		const distance = other.position.distanceTo(boid.position);
		if (distance > 0 && distance <= BOID_FLOCK_PERCEPTION) {
			averagePosition.add(other.position);
			count++;
		}
	}
	if (count === 0) return averagePosition;

	averagePosition.divideScalar(count);

	const desired = averagePosition.sub(boid.position.clone()).normalize();
	return desired;
}
