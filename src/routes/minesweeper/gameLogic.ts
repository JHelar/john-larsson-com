import { get, writable } from 'svelte/store';
import type { TileBase, TileType } from './field/types';
import { tiles } from './field/fieldStore';

type RevealedTile = { tileIndex: number; delay: number };
export const gameTileTypes = writable<TileType[]>([]);
export const revealedTiles = writable<RevealedTile[]>([]);

const MINE_RATIO = 0.1;

const createCanRevealTileIndex = (allTiles: TileBase[], allreadyRevealedTiles: number[]) =>
	function isValidTileIndex(index?: number): index is number {
		if (index === undefined) return false;
		if (allreadyRevealedTiles.includes(index)) return false;

		const tile = allTiles.at(index);
		if (tile === undefined) return false;
		if (get(gameTileTypes).at(index) === 'mine') return false;

		return true;
	};

function getAdjacentTileIndex(tileIndex: number, tilesPerRow: number, tileCount: number) {
	const rightIndex = (tileIndex + 1) % tilesPerRow === 0 ? undefined : tileIndex + 1;
	const leftIndex =
		tileIndex === 0
			? undefined
			: (tileIndex - 1) % tilesPerRow === tilesPerRow - 1
			? undefined
			: tileIndex - 1;
	const topIndex = tileIndex - tilesPerRow < 0 ? undefined : tileIndex - tilesPerRow;
	const bottomIndex = tileIndex + tilesPerRow > tileCount - 1 ? undefined : tileIndex + tilesPerRow;
	const topRightIndex = rightIndex !== undefined ? rightIndex - tilesPerRow : undefined;
	const topLeftIndex = leftIndex !== undefined ? leftIndex - tilesPerRow : undefined;
	const bottomRightIndex = rightIndex !== undefined ? rightIndex + tilesPerRow : undefined;
	const bottomLeftIndex = leftIndex !== undefined ? leftIndex + tilesPerRow : undefined;

	return [
		topIndex,
		rightIndex,
		bottomIndex,
		leftIndex,
		topRightIndex,
		topLeftIndex,
		bottomRightIndex,
		bottomLeftIndex
	];
}

function getAdjacentTilesToOpen(tileIndex: number) {
	const allGameTileTypes = get(gameTileTypes);
	if (allGameTileTypes.at(tileIndex) === 'mine') {
		return [];
	}
	if (allGameTileTypes.at(tileIndex) !== 0) {
		return [
			{
				tileIndex,
				delay: 0
			}
		];
	}

	const allTiles = get(tiles);
	const allreadyRevealedTiles = get(revealedTiles).map(({ tileIndex }) => tileIndex);
	const tilesPerRow = Math.floor(Math.sqrt(allTiles.length));
	const canRevealTile = createCanRevealTileIndex(allTiles, allreadyRevealedTiles);

	const adjacentTiles = getAdjacentTileIndex(tileIndex, tilesPerRow, allTiles.length).filter(
		canRevealTile
	);

	const tilesToOpen: RevealedTile[] = [];
	const lookupTiles = adjacentTiles
		.filter((index) => allGameTileTypes.at(index) === 0)
		.map((tileIndex) => ({ tileIndex, delay: 0 }));
	let emptyRevealedTile: RevealedTile | undefined;
	while ((emptyRevealedTile = lookupTiles.pop()) !== undefined) {
		tilesToOpen.push(emptyRevealedTile);
		const tiles = getAdjacentTileIndex(
			emptyRevealedTile.tileIndex,
			tilesPerRow,
			allTiles.length
		).filter(canRevealTile);

		tiles.forEach((tIndex) => {
			const tileType = allGameTileTypes.at(tIndex);
			const hasBeenOpened = tilesToOpen.some(({ tileIndex }) => tileIndex === tIndex);
			const isConsidered = lookupTiles.some(({ tileIndex }) => tileIndex === tIndex);
			// Continue lookup tiles that are empty
			if (tileType === 0 && !isConsidered && !hasBeenOpened) {
				lookupTiles.push({ tileIndex: tIndex, delay: emptyRevealedTile!.delay + 25 });
			}
			// If tile is not mine but not empty add to open but do not continue
			else if (tileType !== 'mine' && !hasBeenOpened) {
				tilesToOpen.push({ tileIndex: tIndex, delay: emptyRevealedTile!.delay });
			}
		});
	}

	return tilesToOpen;
}

export function openTile(tileIndex: number) {
	if (get(gameTileTypes).at(tileIndex) === 'mine') {
		// BOOOM
		const mines: RevealedTile[] = [];
		let delay = 25;
		for (const [index, type] of get(gameTileTypes).entries()) {
			if (type === 'mine') {
				mines.push({
					tileIndex: index,
					delay: index === tileIndex ? 0 : delay
				});
				delay += 25;
			}
		}
		revealedTiles.update((tiles) => [...tiles, ...mines]);
		return;
	}

	const adjacentTiles = getAdjacentTilesToOpen(tileIndex);
	revealedTiles.update((tiles) => [...tiles, { tileIndex, delay: 0 }, ...adjacentTiles]);
}

export function newGame() {
	const allTiles = get(tiles);
	let mineCount = Math.ceil(allTiles.length * MINE_RATIO);

	// Clear tiles
	const newTileTypes = allTiles.map<TileType>(() => 0);

	// Assign mines
	while (mineCount > 0) {
		const mineIndex = Math.floor(Math.random() * allTiles.length - 1);
		if (newTileTypes.at(mineIndex) !== 'mine') {
			newTileTypes[mineIndex] = 'mine';
			mineCount--;
		}
	}

	// Assign neighbour counters
	const tilesPerRow = Math.floor(Math.sqrt(allTiles.length));
	for (const [tileIndex, gameTile] of newTileTypes.entries()) {
		if (gameTile === 'mine') {
			const neighbours = getAdjacentTileIndex(tileIndex, tilesPerRow, allTiles.length);
			for (const neighbour of neighbours) {
				if (neighbour === undefined) continue;

				const neighbourType = newTileTypes.at(neighbour);
				if (neighbourType === undefined) continue;
				if (neighbourType === 'mine') continue;

				newTileTypes[neighbour] = neighbourType + 1;
			}
		}
	}

	gameTileTypes.set(newTileTypes);
}
