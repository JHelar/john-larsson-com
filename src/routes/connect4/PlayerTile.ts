import { CircleGeometry, Color, CylinderGeometry, MeshBasicMaterial, Vector3 } from 'three';
import { Tile } from './Tile';
import { Timer } from './Timer';

export type PlayerNumber = number;
const PLAYER_TILE_Z = 0.5;

export type PlayerTileState = 'idle' | 'falling' | 'settled' | 'winner';

export type PlayerTileOptions = {
	boardSize: number;
	tileSize: number;

	player: PlayerNumber;
	column: number;
	toRow: number;
};

export class PlayerTile extends Tile {
	public static GRAVITY = 10;
	public static DEPTH = 10;

	private static FALL_DIRECTION = new Vector3(0, -1, 0);
	private static P1_COLOR = new Color(Color.NAMES.gold);
	private static P2_COLOR = new Color(Color.NAMES.firebrick);
	private static WINNER_COLOR = new Color(Color.NAMES.white);

	public player!: PlayerNumber;
	public state: PlayerTileState;

	private velocity: Vector3;
	private destination: Vector3;
	private isWinner: boolean;

	constructor({ boardSize, column, player, tileSize, toRow }: PlayerTileOptions) {
		super({
			boardSize,
			tileSize,
			column,
			row: Tile.TILES_PER_ROW
		});
		this.updatePosition();

		this.player = player;
		this.velocity = new Vector3(0, 0, 0);
		this.state = 'falling';
		this.isWinner = false;

		this._boardPosition.y = toRow;
		this.position.setZ(PLAYER_TILE_Z);
		this.rotateOnAxis(new Vector3(1, 0, 0), Math.PI / 2);

		this.destination = new Vector3(
			this.toCanvasCoordinate(column),
			this.toCanvasCoordinate(toRow),
			0
		);

		this.initializeMaterial();
		this.initializeGeometry();
	}

	private initializeMaterial() {
		this.material = new MeshBasicMaterial();
		this.material.color = this.getPlayerColor();
	}

	private initializeGeometry() {
		this.geometry = new CylinderGeometry(
			this.tileSize / 2,
			this.tileSize / 2,
			PlayerTile.DEPTH,
			25
		);
	}

	private pingPong(time: number, length: number) {
		// Triangular Wave, oscillate between 0 -> length. Period: length, Amplitude: length * 2
		return Math.abs((time % (length * 2)) - length);
	}

	private getPlayerColor() {
		if (this.player === 1) {
			return PlayerTile.P1_COLOR.clone();
		} else {
			return PlayerTile.P2_COLOR.clone();
		}
	}

	public setWinner() {
		this.isWinner = true;
	}

	public update(delta: number) {
		if (this.state === 'falling') {
			this.velocity.add(
				PlayerTile.FALL_DIRECTION.clone().multiplyScalar(PlayerTile.GRAVITY * delta)
			);
			this.position.add(this.velocity);
			if (Math.abs(this.destination.y - this.position.y) <= PlayerTile.GRAVITY) {
				this.position.copy(this.destination);
				this.state = 'settled';
			}
		}

		if (this.isWinner) {
			this.material.color = this.getPlayerColor().lerp(
				PlayerTile.WINNER_COLOR,
				this.pingPong(Timer.time, 0.5)
			);
		}
	}
}
