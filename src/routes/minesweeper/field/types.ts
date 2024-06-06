export type TileType = 'empty' | 'mine' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type TileProps = {
	index: number;
	type: TileType;
	size: [width: number, height: number, depth: number];
	position: [x: number, y: number, z: number];
};
