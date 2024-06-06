import { writable, derived, get } from 'svelte/store';
import type { TileProps } from './types';

const MIN_FIELD_SIZE = 5;
const TILES_PER_ROW = 3;
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
				type: 'empty',
				position: [tileX, tileY, 0] satisfies [x: number, y: number, z: number],
				size: [tileSize, tileSize, 0.25] satisfies [width: number, height: number, depth: number]
			} satisfies TileProps;
		});

	return tiles;
});

export const revealedTiles = writable<number[]>([]);

export function openTile(tileIndex: number) {
	const allTiles = get(tiles);
	const allreadyRevealedTiles = get(revealedTiles);
	const tilesPerRow = Math.floor(Math.sqrt(allTiles.length));

	const rightIndex = (tileIndex + 1) % tilesPerRow === 0 ? undefined : tileIndex + 1;
	const leftIndex =
		tileIndex === 0
			? undefined
			: (tileIndex - 1) % tilesPerRow === tilesPerRow - 1
			? undefined
			: tileIndex - 1;
	const topIndex = tileIndex - tilesPerRow < 0 ? undefined : tileIndex - tilesPerRow;
	const bottomIndex =
		tileIndex + tilesPerRow > allTiles.length - 1 ? undefined : tileIndex + tilesPerRow;
	const topRightIndex = rightIndex !== undefined ? rightIndex - tilesPerRow : undefined;
	const topLeftIndex = leftIndex !== undefined ? leftIndex - tilesPerRow : undefined;
	const bottomRightIndex = rightIndex !== undefined ? rightIndex + tilesPerRow : undefined;
	const bottomLeftIndex = leftIndex !== undefined ? leftIndex + tilesPerRow : undefined;

	const adjacentTiles = [
		tileIndex,
		topIndex,
		rightIndex,
		bottomIndex,
		leftIndex,
		topRightIndex,
		topLeftIndex,
		bottomRightIndex,
		bottomLeftIndex
	]
		.filter((index): index is number => index !== undefined)
		.filter((index) => allTiles.at(index) !== undefined)
		.filter((index) => !allreadyRevealedTiles.includes(index));

	revealedTiles.update((tiles) => [...tiles, ...adjacentTiles]);
}
