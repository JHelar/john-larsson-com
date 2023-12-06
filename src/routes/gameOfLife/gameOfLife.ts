import { writable } from 'svelte/store';

const enum CellState {
	Alive,
	Dead
}

type Cell = {
	state: CellState;
	cx: number;
	cy: number;
	x: number;
	y: number;
};

const grid: Cell[][] = [];
let prevTime = 0;
let run = false;

const CELL_COUNT = 100;

const NEIGHBOUR_DELTAS = [
	[0, 1],
	[0, -1],

	[1, 0],
	[-1, 0],

	[-1, 1],
	[-1, -1],

	[1, 1],
	[1, -1]
] as const;

type CreateCell = {
	cx: number;
	cy: number;
	x: number;
	y: number;
};

function createCell({ cx, cy, x, y }: CreateCell) {
	return {
		cx,
		cy,
		x,
		y,
		state: CellState.Dead
	} satisfies Cell;
}

function updateCellState(cell: Cell, grid: Cell[][]): CellState {
	const aliveNeighbours = NEIGHBOUR_DELTAS.map(([dx, dy]) => {
		const y = cell.y + dy;
		const row = grid[y];
		if (!row) {
			return;
		}
		const x = cell.x + dx;
		return row[x];
	}).filter((cell) => cell && cell.state === CellState.Alive);

	switch (cell.state) {
		case CellState.Alive:
			if (aliveNeighbours.length === 2 || aliveNeighbours.length === 3) {
				return CellState.Alive;
			}
			return CellState.Dead;
		case CellState.Dead:
			if (aliveNeighbours.length === 3) {
				return CellState.Alive;
			}
			return CellState.Dead;
	}
}

function renderCell({ cx: x, cy: y, state }: Cell, context: CanvasRenderingContext2D) {
	const cellSize = Math.round(context.canvas.width / (CELL_COUNT / 2));
	if (!run) {
		context.globalAlpha = 0.3;
		context.fillStyle = '#CEAC5C';
		context.strokeRect(x, y, cellSize, cellSize);
	}

	switch (state) {
		case CellState.Alive:
			context.globalAlpha = 1;
			context.strokeStyle = '#034F1B';
			context.fillRect(x, y, cellSize, cellSize);
			break;
		default:
			break;
	}
}

function startLoop(context: CanvasRenderingContext2D) {
	function runUpdates(delta: number) {
		if (run) {
			cycle(delta, context);
		}
		render(delta, context);
	}

	function runLoop(timeframe: number) {
		const delta = (timeframe - prevTime) / 1000;
		if (delta >= 0.2) {
			prevTime = timeframe;
			runUpdates(delta);
		}
		requestAnimationFrame(runLoop);
	}

	render(0, context);
	requestAnimationFrame((timeframe) => {
		prevTime = timeframe;
		requestAnimationFrame(runLoop);
	});
}

function cycle(delta: number, context: CanvasRenderingContext2D) {
	const gridCopy = [...grid.map((row) => [...row.map((cell) => ({ ...cell }))])];

	grid.forEach((row, y) =>
		row.forEach((cell, x) => {
			const cellState = updateCellState(cell, gridCopy);
			grid[y][x].state = cellState;
		})
	);
}

function render(delta: number, context: CanvasRenderingContext2D) {
	context.clearRect(0, 0, context.canvas.width, context.canvas.height);
	grid.forEach((row) => row.forEach((cell) => renderCell(cell, context)));
}

function addCell(e: MouseEvent) {
	const canvas = e.target as HTMLCanvasElement;
	const rect = canvas.getBoundingClientRect();
	const offsetX = e.clientX - rect.left;
	const offsetY = e.clientY - rect.top;

	const cellSize = Math.round(rect.width / (CELL_COUNT / 2));
	const x = Math.floor(offsetX / cellSize);
	const y = Math.floor(offsetY / cellSize);
	console.log(x, y);
	grid[y][x].state = grid[y][x].state === CellState.Alive ? CellState.Dead : CellState.Alive;
}

export function initialize(canvas: HTMLCanvasElement) {
	const context = canvas.getContext('2d');
	canvas.addEventListener('click', addCell);

	canvas.height = canvas.width;

	if (!context) {
		throw new Error('Unable to create context from node.');
	}

	let x = 0;
	let y = 0;
	for (let cy = 0; cy < canvas.height; cy += Math.round(canvas.height / (CELL_COUNT / 2))) {
		x = 0;
		const row = [];
		for (let cx = 0; cx < canvas.width; cx += Math.round(canvas.width / (CELL_COUNT / 2))) {
			const cell = createCell({
				cx,
				cy,
				x,
				y
			});
			row.push(cell);
			x++;
		}
		grid.push(row);
		y++;
	}
	startLoop(context);
}

export const runStore = writable(run);
runStore.subscribe((value) => (run = value));
