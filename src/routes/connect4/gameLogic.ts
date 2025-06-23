import { Vector3 } from 'three';
import type { GameOptions } from './types';
import { Tile } from './Tile';
import { GridTile } from './GridTile';
import { Game } from './Game';

export function newGame({ boardSize }: GameOptions) {
	const tileSize = boardSize / Tile.TILES_PER_ROW;

	const gridTiles = Array.from(
		{ length: Tile.TOTAL_TILES },
		(_, tileIndex) => new GridTile(tileIndex, { boardSize, tileSize })
	);

	return new Game(gridTiles, { boardSize, tileSize });
}
