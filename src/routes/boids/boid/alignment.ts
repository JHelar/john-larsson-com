import type { UpdateContext } from '../types';
import { BOID_FLOCK_PERCEPTION } from './consts';
import type { Boid } from './types';
import { Vector } from './vector';

export function alignment(boid: Boid, { flock }: UpdateContext) {
	const averageDirection = Vector.Zero;
	let count = 0;
	for (const other of flock) {
		if (other.index === boid.index) continue;

		const distance = other.position.distanceTo(boid.position);
		if (distance > 0 && distance <= BOID_FLOCK_PERCEPTION) {
			averageDirection.add(other.direction);
			count++;
		}
	}
	if (count === 0) return Vector.Zero;

	averageDirection.divideScalar(count).normalize();
	return averageDirection.sub(boid.direction.clone().normalize());
}
