import { derived, writable } from 'svelte/store';

type Branch = {
	length: number;
	goalLength: number;
	thickness: number;
	x: number;
	y: number;
	initialY: number;
	branches: Branch[];
	hasBranches: boolean;
	doneAnimating: boolean;
};
// Defaults
const ROOT_THICKNESS = 35;
const ROOT_LENGTH_RATIO = 0.35;
const BRANCH_LENGTH_RATIO = 0.65;
const BRANCH_THICKNESS_RATIO = 0.65;
const BRANCH_ANGLE = getRadians(50);
const GROWTH_SPEED = 350;
const MAX_BRANCH_DEPTH = 10;
const BRANCH_COUNT = 2;
const BONZAI_MODE = false;

// Constants
const CONSTANTS = {
	ROOT_THICKNESS,
	ROOT_LENGTH_RATIO,
	BRANCH_LENGTH_RATIO,
	BRANCH_THICKNESS_RATIO,
	BRANCH_ANGLE,
	GROWTH_SPEED,
	MAX_BRANCH_DEPTH,
	BRANCH_COUNT,
	BONZAI_MODE
};

let tree: Branch;
let runUpdate = true;
let invalidate = false;
let prevTime = 0;
let context: CanvasRenderingContext2D;

export const ROOT_THICKNESS_STORE = writable(CONSTANTS.ROOT_THICKNESS);
export const ROOT_LENGTH_RATIO_STORE = writable(CONSTANTS.ROOT_LENGTH_RATIO);
export const BRANCH_LENGTH_RATIO_STORE = writable(CONSTANTS.BRANCH_LENGTH_RATIO);
export const BRANCH_THICKNESS_RATIO_STORE = writable(CONSTANTS.BRANCH_THICKNESS_RATIO);
export const BRANCH_ANGLE_STORE = writable(CONSTANTS.BRANCH_ANGLE);
export const GROWTH_SPEED_STORE = writable(CONSTANTS.GROWTH_SPEED);
export const MAX_BRANCH_DEPTH_STORE = writable(CONSTANTS.MAX_BRANCH_DEPTH);
export const BRANCH_COUNT_STORE = writable(CONSTANTS.BRANCH_COUNT);
export const BONZAI_MODE_STORE = writable(CONSTANTS.BONZAI_MODE);
ROOT_THICKNESS_STORE.subscribe((value) => {
	if (tree) {
		tree.thickness = value;
		tree.branches = [];
		tree.hasBranches = false;
	}
	CONSTANTS.ROOT_THICKNESS = value;
});
ROOT_LENGTH_RATIO_STORE.subscribe((value) => {
	if (tree) {
		tree.goalLength = context.canvas.height * value;
		tree.length = Math.min(tree.length, tree.goalLength);
		tree.branches = [];
		tree.doneAnimating = false;
		tree.hasBranches = false;
	}
	CONSTANTS.ROOT_LENGTH_RATIO = value;
});
BRANCH_LENGTH_RATIO_STORE.subscribe((value) => (CONSTANTS.BRANCH_LENGTH_RATIO = value));
BRANCH_THICKNESS_RATIO_STORE.subscribe((value) => (CONSTANTS.BRANCH_THICKNESS_RATIO = value));
BRANCH_ANGLE_STORE.subscribe((value) => (CONSTANTS.BRANCH_ANGLE = value));
GROWTH_SPEED_STORE.subscribe((value) => (CONSTANTS.GROWTH_SPEED = value));
MAX_BRANCH_DEPTH_STORE.subscribe((value) => (CONSTANTS.MAX_BRANCH_DEPTH = value));
BRANCH_COUNT_STORE.subscribe((value) => (CONSTANTS.BRANCH_COUNT = value));
BONZAI_MODE_STORE.subscribe((value) => (CONSTANTS.BONZAI_MODE = value));
derived(
	[
		ROOT_THICKNESS_STORE,
		ROOT_LENGTH_RATIO_STORE,
		BRANCH_LENGTH_RATIO_STORE,
		BRANCH_THICKNESS_RATIO_STORE,
		BRANCH_ANGLE_STORE,
		GROWTH_SPEED_STORE,
		MAX_BRANCH_DEPTH_STORE,
		BRANCH_COUNT_STORE,
		BONZAI_MODE_STORE
	],
	() => {
		invalidate = true;
	}
	// eslint-disable-next-line @typescript-eslint/no-empty-function
).subscribe(() => {});

function startLoop(context: CanvasRenderingContext2D) {
	function runLoop(timeframe: number) {
		const deltaTime = (timeframe - prevTime) / 1000;
		prevTime = timeframe;

		if (runUpdate || invalidate) {
			update(deltaTime, invalidate);
			render(context);
			invalidate = false;
		}
		requestAnimationFrame(runLoop);
	}

	render(context);
	requestAnimationFrame((timeframe) => {
		prevTime = timeframe;
		requestAnimationFrame(runLoop);
	});
}

function getRadians(degrees: number) {
	return (degrees * Math.PI) / 180;
}
function translate(
	value: number,
	[oldMin, oldMax]: [number, number],
	[newMin, newMax]: [number, number]
) {
	return ((value - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin;
}

function renderBranch(root: Branch, context: CanvasRenderingContext2D, currentBranchDepth: number) {
	context.fillStyle =
		currentBranchDepth >= CONSTANTS.MAX_BRANCH_DEPTH * 0.6 ? '#034F1B' : '#6F371F';
	context.fillRect(root.x, root.y, root.thickness, root.length);

	if (root.doneAnimating) {
		root.branches.forEach((branch, i) => {
			const rotation = translate(
				i,
				[0, root.branches.length - 1],
				[CONSTANTS.BRANCH_ANGLE, -CONSTANTS.BRANCH_ANGLE]
			);

			context.translate(root.x + root.thickness / 2, root.y);
			context.rotate(rotation);
			context.translate(-(root.x + root.thickness / 2), -root.y);

			renderBranch(branch, context, currentBranchDepth + 1);

			context.translate(root.x + root.thickness / 2, root.y);
			context.rotate(-rotation);
			context.translate(-(root.x + root.thickness / 2), -root.y);
		});
	}
}

function updateBranch(
	root: Branch,
	deltaTime: number,
	currentBranchDepth: number,
	invalidate: boolean
): boolean {
	let depthReached = false;

	const length = Math.min(root.goalLength, root.length + CONSTANTS.GROWTH_SPEED * deltaTime);
	root.length = length;
	root.y = root.initialY - length;
	if (length === root.goalLength) {
		root.doneAnimating = true;
		if (root.hasBranches) {
			if (invalidate) {
				const branchDiff =
					(CONSTANTS.BONZAI_MODE
						? Math.max(1, Math.round(Math.random() * CONSTANTS.BRANCH_COUNT))
						: CONSTANTS.BRANCH_COUNT) - root.branches.length;
				// Cut branches
				if (branchDiff < 0) {
					root.branches.splice(0, Math.abs(branchDiff));
				} else if (branchDiff > 0) {
					Array(branchDiff)
						.fill(0)
						.forEach(() => {
							const thickness = root.thickness * CONSTANTS.BRANCH_THICKNESS_RATIO;
							root.branches.push({
								branches: [],
								hasBranches: false,
								doneAnimating: false,
								goalLength: length * CONSTANTS.BRANCH_LENGTH_RATIO,
								initialY: root.y,
								length: 0,
								thickness: root.thickness * CONSTANTS.BRANCH_THICKNESS_RATIO,
								x: root.x + root.thickness - thickness - (root.thickness - thickness) / 2,
								y: 0
							});
						});
				} else {
					root.branches.forEach((branch) => {
						const thickness = root.thickness * CONSTANTS.BRANCH_THICKNESS_RATIO;
						Object.assign(branch, {
							branches: [],
							hasBranches: false,
							doneAnimating: false,
							goalLength: length * CONSTANTS.BRANCH_LENGTH_RATIO,
							initialY: root.y,
							length: 0,
							thickness: root.thickness * CONSTANTS.BRANCH_THICKNESS_RATIO,
							x: root.x + root.thickness - thickness - (root.thickness - thickness) / 2,
							y: 0
						});
					});
				}
			}
			const nextBranchDepth = currentBranchDepth + 1;
			if (nextBranchDepth > CONSTANTS.MAX_BRANCH_DEPTH) {
				root.branches = [];
				root.hasBranches = false;
				depthReached = true;
			} else {
				depthReached = root.branches
					.map((child) => updateBranch(child, deltaTime, currentBranchDepth + 1, invalidate))
					.every((didReach) => didReach);
			}
		} else {
			root.hasBranches = true;
			const branchCount = CONSTANTS.BONZAI_MODE
				? Math.max(1, Math.round(Math.random() * CONSTANTS.BRANCH_COUNT))
				: CONSTANTS.BRANCH_COUNT;
			Array(branchCount)
				.fill(0)
				.forEach(() => {
					const thickness = root.thickness * CONSTANTS.BRANCH_THICKNESS_RATIO;
					root.branches.push({
						branches: [],
						hasBranches: false,
						doneAnimating: false,
						goalLength: length * CONSTANTS.BRANCH_LENGTH_RATIO,
						initialY: root.y,
						length: 0,
						thickness: root.thickness * CONSTANTS.BRANCH_THICKNESS_RATIO,
						x: root.x + root.thickness - thickness - (root.thickness - thickness) / 2,
						y: 0
					});
				});
		}
	}

	return depthReached;
}

function update(deltaTime: number, invalidate: boolean) {
	const depthReached = updateBranch(tree, deltaTime, 0, invalidate);
	runUpdate = !depthReached;
}

function render(context: CanvasRenderingContext2D) {
	context.clearRect(0, 0, context.canvas.width, context.canvas.height);
	renderBranch(tree, context, 0);
}

export function initialize(canvas: HTMLCanvasElement) {
	const canvasContext = canvas.getContext('2d');

	if (!canvasContext) {
		throw new Error('Unable to create context from node.');
	}

	canvasContext.canvas.width = canvasContext.canvas.parentElement?.clientWidth ?? 0;
	canvasContext.canvas.height = canvasContext.canvas.width * (9 / 16);
	context = canvasContext;
	const branchLength = canvasContext.canvas.height * CONSTANTS.ROOT_LENGTH_RATIO;
	tree = {
		goalLength: branchLength,
		length: 0,
		hasBranches: false,
		thickness: CONSTANTS.ROOT_THICKNESS,
		x: canvasContext.canvas.width / 2 - CONSTANTS.ROOT_THICKNESS / 2,
		y: 0,
		initialY: canvas.height,
		branches: [],
		doneAnimating: false
	};

	startLoop(canvasContext);
}
