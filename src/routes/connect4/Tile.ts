import {
	BufferGeometry,
	Mesh,
	MeshBasicMaterial,
	Vector2,
	Vector3,
	type Object3DEventMap
} from 'three';

export type TileOptions = {
	tileSize: number;
	boardSize: number;
	row: number;
	column: number;
};

export class Tile extends Mesh<BufferGeometry, MeshBasicMaterial, Object3DEventMap> {
	public static TILES_PER_ROW = 6;
	public static TOTAL_TILES = Tile.TILES_PER_ROW ** 2;

	private static COUNT = 0;

	protected tileSize: number;
	protected boardSize: number;

	public tileId: string;

	protected _boardPosition: Vector2;

	constructor(options: TileOptions) {
		super();
		this.tileSize = options.tileSize;
		this.boardSize = options.boardSize;
		this.tileId = `tile-${Tile.COUNT++}`;
		this._boardPosition = new Vector2(options.column, options.row);
	}

	protected updatePosition() {
		const position = new Vector3(
			this.toCanvasCoordinate(this._boardPosition.x),
			this.toCanvasCoordinate(this._boardPosition.y),
			0
		);
		this.position.set(...position.toArray());
	}

	protected toCanvasCoordinate(coordinate: number) {
		return -this.boardSize / 2 + this.tileSize / 2 + coordinate * this.tileSize;
	}

	public get boardIndex() {
		return this._boardPosition.x + this._boardPosition.y * Tile.TILES_PER_ROW;
	}

	public get boardPosition() {
		return this._boardPosition;
	}

	public static boardIndexFromPosition(position: Vector2) {
		const row = position.y;
		const column = position.x;

		if (row >= Tile.TILES_PER_ROW) return null;
		if (row < 0) return null;
		if (column >= Tile.TILES_PER_ROW) return null;
		if (column < 0) return null;

		return column + row * Tile.TILES_PER_ROW;
	}
}
