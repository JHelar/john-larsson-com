type Branch = {
	length: number;
	goalLength: number;
	thickness: number;
	x: number;
	y: number;
	initialY: number;
	branches: Branch[];
	doneAnimating: boolean;
};

const ROOT_THICKNESS = 20;
const ROOT_LENGTH_RATIO = 0.3;
const BRANCH_LENGTH_RATIO = 0.6;
const BRANCH_THICKNESS_RATIO = 0.8;
const BRANCH_ANGLE = getRadians(45);
const GROWTH_SPEED = 350;
const MAX_BRANCH_DEPTH = 10;
let tree: Branch;

let prevTime = 0;

function startLoop(context: CanvasRenderingContext2D) {
	function runLoop(timeframe: number) {
		const deltaTime = (timeframe - prevTime) / 1000;
		prevTime = timeframe;

		update(deltaTime);
		render(context);
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

function renderBranch(
	branch: Branch,
	context: CanvasRenderingContext2D,
	currentBranchDepth: number
) {
	context.fillStyle = currentBranchDepth >= MAX_BRANCH_DEPTH * 0.6 ? '#034F1B' : '#6F371F';
	context.fillRect(branch.x, branch.y, branch.thickness, branch.length);

	if (branch.doneAnimating) {
		context.translate(branch.x + branch.thickness / 2, branch.y);
		context.rotate(BRANCH_ANGLE);
		context.translate(-(branch.x + branch.thickness / 2), -branch.y);

		renderBranch(branch.branches[0], context, currentBranchDepth + 1);

		context.translate(branch.x + branch.thickness / 2, branch.y);
		context.rotate(-BRANCH_ANGLE);
		context.translate(-(branch.x + branch.thickness / 2), -branch.y);

		context.translate(branch.x + branch.thickness / 2, branch.y);
		context.rotate(-BRANCH_ANGLE);
		context.translate(-(branch.x + branch.thickness / 2), -branch.y);

		renderBranch(branch.branches[1], context, currentBranchDepth + 1);

		context.translate(branch.x + branch.thickness / 2, branch.y);
		context.rotate(BRANCH_ANGLE);
		context.translate(-(branch.x + branch.thickness / 2), -branch.y);
	}
}

function updateBranch(branch: Branch, deltaTime: number, currentBranchDepth: number) {
	if (currentBranchDepth > MAX_BRANCH_DEPTH) return;

	const length = Math.min(branch.goalLength, branch.length + GROWTH_SPEED * deltaTime);
	branch.length = length;
	branch.y = branch.initialY - length;

	if (length === branch.goalLength) {
		branch.doneAnimating = true;
		if (branch.branches.length) {
			branch.branches.forEach((child) => updateBranch(child, deltaTime, currentBranchDepth + 1));
		} else {
			branch.branches.push({
				branches: [],
				doneAnimating: false,
				goalLength: length * BRANCH_LENGTH_RATIO,
				initialY: branch.y,
				length: 0,
				thickness: branch.thickness * BRANCH_THICKNESS_RATIO,
				x: branch.x,
				y: 0
			});
			branch.branches.push({
				branches: [],
				doneAnimating: false,
				goalLength: length * BRANCH_LENGTH_RATIO,
				initialY: branch.y,
				length: 0,
				thickness: branch.thickness * BRANCH_THICKNESS_RATIO,
				x: branch.x,
				y: 0
			});
		}
	}
}

function update(deltaTime: number) {
	updateBranch(tree, deltaTime, 0);
}

function render(context: CanvasRenderingContext2D) {
	context.clearRect(0, 0, context.canvas.width, context.canvas.height);
	renderBranch(tree, context, 0);
}

export function initialize(canvas: HTMLCanvasElement) {
	const context = canvas.getContext('2d');

	if (!context) {
		throw new Error('Unable to create context from node.');
	}

	context.canvas.width = context.canvas.parentElement?.clientWidth ?? 0;
	context.canvas.height = context.canvas.width * (9 / 16);

	const branchLength = context.canvas.height * ROOT_LENGTH_RATIO;
	tree = {
		goalLength: branchLength,
		length: 0,
		thickness: ROOT_THICKNESS,
		x: context.canvas.width / 2 - ROOT_THICKNESS / 2,
		y: 0,
		initialY: canvas.height,
		branches: [],
		doneAnimating: false
	};

	startLoop(context);
}
