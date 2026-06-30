import { Vector2 } from 'three';

export const BOID_HEIGHT = 20;
export const BOID_WIDTH = BOID_HEIGHT * 0.9;
export const BOID_SIZE = new Vector2(BOID_WIDTH, BOID_HEIGHT);

export const BOID_FLOCK_DISTANCE = 80;
export const BOID_FLOCK_PERCEPTION = 200;
export const BOID_SPEED = 400;
export const BOID_STEER_FORCE = 0.1;

export const SEPARATION_MULTIPLIER = 1;
export const ALIGNMENT_MULTIPLIER = 0.8;
export const COHESION_MULTIPLIER = 0.5;

export const WALL_HIT_MULTIPLIER = 1;

export const POINTS = [
	new Vector2(0, -BOID_HEIGHT / 2),
	new Vector2(BOID_WIDTH / 2, BOID_HEIGHT / 2),
	new Vector2(-BOID_WIDTH / 2, BOID_HEIGHT / 2)
] as const;
