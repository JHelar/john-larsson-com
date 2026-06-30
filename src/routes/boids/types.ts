import type { Flock } from './boid';

export type RenderContext = {
	context: CanvasRenderingContext2D;
	deltaTime: number;
};

export type UpdateContext = {
	context: CanvasRenderingContext2D;
	deltaTime: number;
	flock: Flock;
};
