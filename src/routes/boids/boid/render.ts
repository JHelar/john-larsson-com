import type { RenderContext } from '../types';
import { POINTS } from './consts';
import type { Boid } from './types';
import { getRayPoint } from './vector';

export function renderBoid(boid: Boid, { context }: RenderContext) {
	const body = new Path2D();
	// Upper line
	for (let index = 0; index < POINTS.length; index++) {
		const point = POINTS[index]
			.clone()
			.add(boid.position)
			.rotateAround(boid.position, boid.rotation)
			.toArray();

		if (index === 0) {
			body.moveTo(...point);
		} else {
			body.lineTo(...point);
		}
	}

	body.closePath();

	context.fillStyle = 'rgb(239, 68, 68)';
	context.fill(body);

	context.lineWidth = 2;
	context.strokeStyle = 'green';
	context.stroke(body);

	// Ray
	/**
	const ray = new Path2D();
	const rp = getRayPoint(0, boid.position, boid.direction, boid.rotation);
	ray.moveTo(
		...POINTS[0].clone().add(boid.position).rotateAround(boid.position, boid.rotation).toArray()
	);
	ray.lineTo(...rp.toArray());

	context.lineWidth = 1;
	context.strokeStyle = 'yellow';
	context.stroke(ray);
	 */
}
