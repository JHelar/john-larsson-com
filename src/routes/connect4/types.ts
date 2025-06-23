import type { Vector3 } from 'three';

export type TileProps = {
	position: Vector3;
	velocity: Vector3;
	destination: Vector3;
	player: 1 | 0;
};

export type GameOptions = {
	boardSize: number;
};
