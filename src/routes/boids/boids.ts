import { Vector2 } from 'three';
import { createBoid, renderBoid, updateBoid, type Boid } from './boid';

let context: CanvasRenderingContext2D;
let prevTime = 0;
let boids: Boid[] = [];
const BOID_COUNT = 50;

function startLoop(context: CanvasRenderingContext2D) {
	function runLoop(timeframe: number) {
		const deltaTime = (timeframe - prevTime) / 1000;
		prevTime = timeframe;

		update(context, deltaTime);
		render(context, deltaTime);
		requestAnimationFrame(runLoop);
	}

	requestAnimationFrame((timeframe) => {
		prevTime = timeframe;
		requestAnimationFrame(runLoop);
	});
}

function render(context: CanvasRenderingContext2D, dt: number) {
	context.clearRect(0, 0, context.canvas.width, context.canvas.height);

	for (const boid of boids) {
		renderBoid(boid, { context, deltaTime: dt });
	}
}

function update(context: CanvasRenderingContext2D, dt: number) {
	for (const boid of boids) {
		updateBoid(boid, { deltaTime: dt, context, flock: boids });
	}
}

export function initialize(canvas: HTMLCanvasElement) {
	const canvasContext = canvas.getContext('2d');

	if (!canvasContext) {
		throw new Error('Unable to create context from node.');
	}

	canvasContext.canvas.width = canvasContext.canvas.parentElement?.clientWidth ?? 0;
	canvasContext.canvas.height = canvasContext.canvas.width * (9 / 16);
	context = canvasContext;

	boids = Array.from({ length: BOID_COUNT }, (_, index) =>
		createBoid(
			index,
			new Vector2(
				(Math.random() * canvasContext.canvas.width) / 2,
				(Math.random() * canvasContext.canvas.height) / 2
			)
		)
	);
	startLoop(canvasContext);
}
