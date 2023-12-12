const SNOWFLAKE_MIN_SIZE = 5;
const SNOWFLAKE_DEVIATION_SIZE = 10;
const SNOWFLAKE_SPAWN_RATE = 0.3;
const SNOWFLAKE_AMPLITUDE = 0.2;
const SNOWFLAKE_FRQUENCY = 0.5;
const SNOWFLAKE_FALL_SPEED = 25;
const MAX_SNOWFLAKES = 800;
const MAX_SNOWFLAKE_BRANCHES = 5;

const snowflakes: Snowflake[] = [];

type Snowflake = ReturnType<typeof createSnowflake>;
function createSnowflake(context: CanvasRenderingContext2D) {
	const size = SNOWFLAKE_MIN_SIZE + Math.random() * SNOWFLAKE_DEVIATION_SIZE;
	return {
		x: Math.random() * context.canvas.width,
		y: -size,
		size,
		phase: Math.random() * 10,
		amplitude: Math.random() * SNOWFLAKE_AMPLITUDE,
		frequency: Math.random() * SNOWFLAKE_FRQUENCY,
		speed: SNOWFLAKE_FALL_SPEED + Math.random() * SNOWFLAKE_FALL_SPEED
	};
}

function renderSnowflake(snowflake: Snowflake, context: CanvasRenderingContext2D) {
	context.globalAlpha = 0.8;
	context.strokeStyle = '#fffafa';
	const angle = ((360 / MAX_SNOWFLAKE_BRANCHES) * Math.PI) / 180;
	for (let i = 0; i <= MAX_SNOWFLAKE_BRANCHES; i++) {
		context.translate(snowflake.x + snowflake.size / 2, snowflake.y);
		context.rotate(angle * i);
		context.translate(-(snowflake.x + snowflake.size / 2), -snowflake.y);

		context.beginPath();
		context.moveTo(snowflake.x, snowflake.y);
		context.lineTo(snowflake.x + snowflake.size, snowflake.y);
		context.stroke();

		context.translate(snowflake.x + snowflake.size / 2, snowflake.y);
		context.rotate(-angle * i);
		context.translate(-(snowflake.x + snowflake.size / 2), -snowflake.y);
	}
}

function startLoop(context: CanvasRenderingContext2D) {
	let prevTime: number;
	function runLoop(timeframe: number) {
		const deltaTime = (timeframe - prevTime) / 1000;
		prevTime = timeframe;

		update(deltaTime, context);
		render(context);
		requestAnimationFrame(runLoop);
	}

	render(context);
	requestAnimationFrame((timeframe) => {
		prevTime = timeframe;
		requestAnimationFrame(runLoop);
	});
}

function render(context: CanvasRenderingContext2D) {
	context.clearRect(0, 0, context.canvas.width, context.canvas.height);
	snowflakes.forEach((snowflake) => {
		renderSnowflake(snowflake, context);
	});
}

function update(deltaTime: number, context: CanvasRenderingContext2D) {
	if (Math.random() > SNOWFLAKE_SPAWN_RATE && snowflakes.length < MAX_SNOWFLAKES) {
		snowflakes.push(createSnowflake(context));
		console.log(snowflakes);
	}
	snowflakes.forEach((snowflake) => {
		snowflake.phase += snowflake.frequency * deltaTime;
		const sway = snowflake.amplitude * Math.sin(snowflake.phase);
		snowflake.x += sway;
		snowflake.y += snowflake.speed * deltaTime;

		if (snowflake.y > context.canvas.height + snowflake.size) {
			Object.assign(snowflake, createSnowflake(context));
		}
	});
}

export function initialize(canvas: HTMLCanvasElement) {
	const context = canvas.getContext('2d');

	if (!context) {
		throw new Error('Unable to create context from node.');
	}

	context.canvas.width = context.canvas.clientWidth ?? 0;
	context.canvas.height = context.canvas.width * (9 / 16);

	startLoop(context);
}
