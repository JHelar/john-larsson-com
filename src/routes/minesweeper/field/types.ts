export type TileType = 'mine' | number;
export type TileBase = {
	index: number;
	position: [x: number, y: number, z: number];
	size: [width: number, height: number, depth: number];
};
export type Tile = TileBase & {
	type: TileType;
};
