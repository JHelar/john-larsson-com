import { writable } from 'svelte/store';

const enum CellState {
	Alive,
	Dying,
	Dead
}

type Cell = {
	state: CellState;
	cx: number;
	cy: number;
	x: number;
	y: number;
	opacity: number;
};

let grid: Cell[][] = [];
let cellLookups = new Set<Cell>();
let prevTime = 0;
let run = false;
let deathAnimation = true;
let speed = 1;
let cellSize = 20;
let context: CanvasRenderingContext2D;
let birthRate = [3];
let survivalRate = [2, 3];
let deathRate: number[] = [];
const MIN_SPEED = 0.8;
const DEATH_SPEED = 0.8;

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
		opacity: 0,
		state: CellState.Dead
	} satisfies Cell;
}

function getCellNeighbours(cell: Cell): Cell[] {
	return NEIGHBOUR_DELTAS.map(([dx, dy]) => {
		const y = cell.y + dy;
		const row = grid[y];
		if (!row) {
			return;
		}
		const x = cell.x + dx;
		return row[x];
	}).filter<Cell>((cell): cell is Cell => cell !== undefined);
}

function updateCellState(cell: Cell): CellState {
	const aliveNeighbours = getCellNeighbours(cell).filter((cell) => cell.state === CellState.Alive);
	const dyingNeighbours = getCellNeighbours(cell).filter((cell) => cell.state === CellState.Dying);

	switch (cell.state) {
		case CellState.Alive:
			if (survivalRate.some((rate) => rate === aliveNeighbours.length)) {
				return CellState.Alive;
			}
			if (deathRate.some((rate) => rate === dyingNeighbours.length)) {
				return CellState.Alive;
			}
			return CellState.Dying;
		case CellState.Dying:
		case CellState.Dead:
			if (birthRate.some((rate) => rate === aliveNeighbours.length)) {
				return CellState.Alive;
			}
			return cell.state;
	}
}

function renderCell({ cx: x, cy: y, state, opacity }: Cell, context: CanvasRenderingContext2D) {
	switch (state) {
		case CellState.Alive:
			context.globalAlpha = 1;
			context.fillStyle = '#CEAC5C';

			context.beginPath();
			context.arc(x + cellSize / 2, y + cellSize / 2, cellSize / 2, 0, 2 * Math.PI);
			context.fill();
			break;
		case CellState.Dying:
			if (deathAnimation) {
				context.globalAlpha = opacity;
				context.fillStyle = '#731B19';

				context.beginPath();
				context.arc(x + cellSize / 2, y + cellSize / 2, cellSize / 2, 0, 2 * Math.PI);
				context.fill();
			}
			break;
		default:
			break;
	}
}

function renderGrid({ cx: x, cy: y }: Cell, context: CanvasRenderingContext2D) {
	context.globalAlpha = 0.5;
	context.strokeStyle = '#034F1B';
	context.strokeRect(x, y, cellSize, cellSize);
}

function startLoop(context: CanvasRenderingContext2D) {
	function runLoop(timeframe: number) {
		const delta = (timeframe - prevTime) / 1000;
		if (run && delta >= speed) {
			update(delta);
			prevTime = timeframe;
		}
		render(delta, context);
		requestAnimationFrame(runLoop);
	}

	render(0, context);
	requestAnimationFrame((timeframe) => {
		prevTime = timeframe;
		requestAnimationFrame(runLoop);
	});
}

function update(delta: number) {
	const gridCopy = [...grid.map((row) => [...row.map((cell) => ({ ...cell }))])];
	const newLookups = new Set<Cell>();

	for (const cell of cellLookups) {
		let newState = updateCellState(cell);

		if (newState == CellState.Dying) {
			const opacity = Math.max(0, cell.opacity - DEATH_SPEED * delta);
			if (opacity > 0) {
				gridCopy[cell.y][cell.x].opacity = opacity;
			} else {
				gridCopy[cell.y][cell.x].opacity = 1;
				newState = CellState.Dead;
			}
		}
		gridCopy[cell.y][cell.x].state = newState;

		if (newState == CellState.Alive || newState == CellState.Dying) {
			const neighbours = getCellNeighbours(cell);
			newLookups.add(gridCopy[cell.y][cell.x]);
			neighbours.forEach((cell) => newLookups.add(gridCopy[cell.y][cell.x]));
		}
	}
	grid = gridCopy;
	cellLookups = newLookups;
}

function render(delta: number, context: CanvasRenderingContext2D) {
	context.clearRect(0, 0, context.canvas.width, context.canvas.height);
	if (!run) {
		grid.forEach((row) => row.forEach((cell) => renderGrid(cell, context)));
	}
	grid.forEach((row) => row.forEach((cell) => renderCell(cell, context)));
}

function createAddCell(context: CanvasRenderingContext2D) {
	return function addCell(e: MouseEvent) {
		const canvas = e.target as HTMLCanvasElement;
		const rect = canvas.getBoundingClientRect();
		const offsetX = e.clientX - rect.left;
		const offsetY = e.clientY - rect.top;

		const x = Math.floor(offsetX / cellSize);
		const y = Math.floor(offsetY / cellSize);

		const cell = grid[y][x];
		if (cell.state === CellState.Alive) {
			cellLookups.delete(cell);
			cell.state = CellState.Dead;
		} else {
			cellLookups.add(cell);
			getCellNeighbours(cell).forEach((cell) => cellLookups.add(cell));
			cell.state = CellState.Alive;
		}
		renderCell(cell, context);
	};
}

function initializeGrid() {
	if (!context) {
		console.log('Missing context');
		return;
	}

	context.canvas.width = context.canvas.parentElement?.clientWidth ?? 0;
	context.canvas.height = context.canvas.width * (9 / 16);
	const horizontalCellCount = Math.floor(context.canvas.width / cellSize);
	const verticalCellCount = Math.floor(context.canvas.height / cellSize);

	grid = [];
	for (let y = 0; y < verticalCellCount; y++) {
		const row = [];
		for (let x = 0; x < horizontalCellCount; x++) {
			const cell = createCell({
				cx: x * cellSize,
				cy: y * cellSize,
				x,
				y
			});
			row.push(cell);
		}
		grid.push(row);
	}
	startLoop(context);
}

export function initialize(canvas: HTMLCanvasElement) {
	const canvasContext = canvas.getContext('2d');

	if (!canvasContext) {
		throw new Error('Unable to create context from node.');
	}

	canvas.addEventListener('click', createAddCell(canvasContext));
	context = canvasContext;
	initializeGrid();
}

export const runStore = writable(run);
runStore.subscribe((value) => (run = value));

export const speedStore = writable(50);
speedStore.subscribe((value) => (speed = ((100 - value - 0) * (MIN_SPEED - 0)) / (100 - 0) + 0));

export const cellSizeStore = writable(cellSize);
cellSizeStore.subscribe((value) => {
	cellSize = value;
	initializeGrid();
});

export const deathAnimationStore = writable(deathAnimation);
deathAnimationStore.subscribe((value) => (deathAnimation = value));

export const rulesStore = writable(`B${birthRate.join('')}S${survivalRate.join('')}`);
rulesStore.subscribe((value) => {
	const match = value.match(/B([\d]+)S([\d]+)(D)?([\d]+)?/);
	if (match) {
		const [, birthRateStr, survivalRateStr, , deathRateStr] = match;

		birthRate = birthRateStr
			.split('')
			.map(Number)
			.filter((number) => !isNaN(number));

		survivalRate = survivalRateStr
			.split('')
			.map(Number)
			.filter((number) => !isNaN(number));

		deathRate = (deathRateStr ?? '')
			.split('')
			.map(Number)
			.filter((number) => !isNaN(number));
	}
});

export function clear() {
	grid.forEach((row) => row.forEach((cell) => (cell.state = CellState.Dead)));
	cellLookups.clear();
}
