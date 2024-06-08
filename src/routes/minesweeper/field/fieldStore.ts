import { writable, derived } from 'svelte/store';
import type { TileBase } from './types';

const MIN_FIELD_SIZE = 8;
const TILES_PER_ROW = 20;
const TILE_SPACING = 0.025;

export const fieldSize = writable(MIN_FIELD_SIZE);
export const tilesPerRow = writable(TILES_PER_ROW);

export const tiles = derived([fieldSize, tilesPerRow], ([fieldSize, tilesPerRow]) => {
	const tileFullSize = fieldSize / tilesPerRow;
	const tileSize = tileFullSize - (TILE_SPACING / 2) * 4;

	const minFieldX = -fieldSize / 2;
	const minFieldY = fieldSize / 2;

	const mintileX = minFieldX + tileFullSize / 2;
	const mintileY = minFieldY - tileFullSize / 2;

	const tiles = Array(tilesPerRow ** 2)
		.fill(0)
		.map((_, index) => {
			const tileX = mintileX + tileFullSize * (index % tilesPerRow);
			const tileY = mintileY - tileFullSize * Math.floor(index / tilesPerRow);

			return {
				index,
				position: [tileX, tileY, 0] satisfies [x: number, y: number, z: number],
				size: [tileSize, tileSize, 0.25] satisfies [width: number, height: number, depth: number]
			} satisfies TileBase;
		});

	return tiles;
});
