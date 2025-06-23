import { Color, ExtrudeGeometry, MeshBasicMaterial, Path, Shape, ShapeGeometry } from 'three';
import { Tile } from './Tile';
import { PlayerTile } from './PlayerTile';

const HOLE_RATIO = 0.85;

type GridTileOptions = {
	boardSize: number;
	tileSize: number;
};

export class GridTile extends Tile {
	public static DEPTH = 10;
	private static SHAPE: Shape;
	private static HIGHLIGHT_COLOR = new Color(Color.NAMES.lightblue);
	private static REGULAR_COLOR = new Color(Color.NAMES.blue);

	constructor(tileIndex: number, options: GridTileOptions) {
		super({
			...options,
			column: tileIndex % Tile.TILES_PER_ROW,
			row: Math.floor(tileIndex / Tile.TILES_PER_ROW)
		});

		this.updatePosition();
		this.position.setZ(PlayerTile.DEPTH + GridTile.DEPTH);

		this.initializeGeometry();
		this.initializeMaterial();
	}

	private initializeMaterial() {
		this.material = new MeshBasicMaterial();
		this.material.color = GridTile.REGULAR_COLOR;
	}

	private initializeGeometry() {
		if (!GridTile.SHAPE) {
			const square = new Shape();
			square.moveTo(-this.tileSize / 2, -this.tileSize / 2);
			square.lineTo(-this.tileSize / 2, this.tileSize / 2);
			square.lineTo(this.tileSize / 2, this.tileSize / 2);
			square.lineTo(this.tileSize / 2, -this.tileSize / 2);
			square.lineTo(-this.tileSize / 2, -this.tileSize / 2); // close the path

			const tileHole = new Path();
			tileHole.absarc(0, 0, (this.tileSize * HOLE_RATIO) / 2, 0, Math.PI * 2, false);
			square.holes.push(tileHole);

			GridTile.SHAPE = square;
		}

		this.geometry = new ExtrudeGeometry(GridTile.SHAPE, {
			depth: GridTile.DEPTH,
			bevelEnabled: true,
			bevelSize: 1
		});
	}

	public highlight(column: number) {
		if (column === this.boardPosition.x) {
			this.material.color = GridTile.HIGHLIGHT_COLOR;
		} else {
			this.material.color = GridTile.REGULAR_COLOR;
		}
	}
}
