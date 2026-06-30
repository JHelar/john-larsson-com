import type { Vector2 } from 'three';

export type Boid = {
	index: number;
	position: Vector2;
	direction: Vector2;
	rotation: number;
};

export type Flock = Boid[];
