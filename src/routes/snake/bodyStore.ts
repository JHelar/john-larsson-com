import { derived, get, readonly, writable } from 'svelte/store';
import { BoxGeometry, BufferGeometry, Color, Mesh, MeshStandardMaterial, Vector3 } from 'three';

export const PART_SIZE = 1;
const HEAD_COLOR = new Color('pink');
const TAIL_COLOR = new Color('red');
const PART_SPEED = 10;

type BodyPart = Mesh<BufferGeometry, MeshStandardMaterial>;

let bodyParts: BodyPart[] = [];
export const bodyPartsStore = writable(bodyParts);
export const headPosition = derived(bodyPartsStore, ([head]) => head?.position ?? new Vector3());

export function addBodyPart(forwardVector: Vector3, edgePoint: number) {
	const newTailVector = forwardVector.clone().multiplyScalar(PART_SIZE);
	const tailPosition = bodyParts.at(-1)?.position ?? new Vector3(0, 0, edgePoint + PART_SIZE / 2);

	const newTailPosition = tailPosition.clone().add(newTailVector);
	const geometry = new BoxGeometry(PART_SIZE, PART_SIZE, PART_SIZE);
	const material = new MeshStandardMaterial();
	const newTailMesh = new Mesh(geometry, material);

	newTailMesh.position.set(newTailPosition.x, newTailPosition.y, newTailPosition.z);
	bodyParts.push(newTailMesh);

	bodyParts.forEach((part, i) => {
		part.material.color.set(HEAD_COLOR.clone().lerp(TAIL_COLOR, i / bodyParts.length));
	});
	bodyPartsStore.set(bodyParts);
}

function updateBodyPosition(delta: number, forwardVector: Vector3) {
	const oldPositions = bodyParts.map((mesh) => mesh.position);
	for (let i = 1; i < bodyParts.length; i++) {
		const oldPosition = oldPositions[i - 1];
		const a = oldPosition.clone().sub(bodyParts[i].position);
		const magnitude = Math.sqrt(Math.pow(a.x, 2) + Math.pow(a.y, 2) + Math.pow(a.z, 2));
		if (magnitude <= PART_SIZE || magnitude == 0) {
			continue;
		}
		bodyParts[i].position.add(a.divideScalar(magnitude).multiplyScalar(PART_SIZE));
	}

	const vector = forwardVector.clone();
	bodyParts[0].position.add(vector.multiplyScalar(PART_SPEED * delta));
}

function wrapBody(edgePoint: number, forwardVector: Vector3, perpendicularVector: Vector3) {
	const head = bodyParts[0];
	const maxX = edgePoint + PART_SIZE / 2;
	const minX = -maxX;

	const forwardPos = Math.floor(forwardVector.clone().dot(head.position));
	if (forwardPos > maxX) {
		head.position.clampScalar(minX, maxX);
		forwardVector.cross(perpendicularVector);
	}
}

export function updateBody(
	delta: number,
	edgePoint: number,
	forwardVector: Vector3,
	perpendicularVector: Vector3
) {
	updateBodyPosition(delta, forwardVector);
	wrapBody(edgePoint, forwardVector, perpendicularVector);
}
