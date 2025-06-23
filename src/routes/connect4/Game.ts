import { Vector2, type Vector3 } from 'three';
import type { GridTile } from './GridTile';
import { Tile } from './Tile';
import { PlayerTile, type PlayerNumber } from './PlayerTile';
import { writable, type Writable, get } from 'svelte/store';
import { Timer } from './Timer';

type GameOptions = {
	boardSize: number;
	tileSize: number;
};

const HORIZONTAL_LINE = new Vector2(1, 0);
const VERTICAL_LINE = new Vector2(0, 1);
const DIAGONAL_LINE = new Vector2(1, 1);

const GameState = {
	Running: 'GameState:Running',
	Winner: 'GameState:Winner'
} as const;
type GameState = (typeof GameState)[keyof typeof GameState];

export class Game {
	public gridTiles: GridTile[];
	public board: Writable<PlayerTile[]>;

	public options: GameOptions;

	private highlightColumn: number;
	private currentPlayer: PlayerNumber;
	private state: GameState;

	constructor(gameTiles: GridTile[], options: GameOptions) {
		this.gridTiles = gameTiles;
		this.board = writable(Array.from({ length: gameTiles.length }));
		this.options = options;

		this.highlightColumn = -1;
		this.currentPlayer = 1;
		this.state = GameState.Running;
	}

	private updateHighlight(point: Vector3) {
		this.highlightColumn = point
			.clone()
			.divideScalar(this.options.tileSize)
			.floor()
			.addScalar(Tile.TILES_PER_ROW / 2).x;

		for (const gridTile of this.gridTiles) {
			gridTile.highlight(this.highlightColumn);
		}
	}

	private spawnPlayerTile(): boolean {
		let rowIndex = -1;
		let boardIndex = -1;

		while (rowIndex < Tile.TILES_PER_ROW) {
			rowIndex++;
			boardIndex = this.highlightColumn + rowIndex * Tile.TILES_PER_ROW;

			if (get(this.board)[boardIndex] === undefined) {
				break;
			}
		}

		if (rowIndex >= Tile.TILES_PER_ROW) {
			console.log('Full column');
			return false;
		}

		this.board.update((board) => {
			board[boardIndex] = new PlayerTile({
				...this.options,
				player: this.currentPlayer,
				column: this.highlightColumn,
				toRow: rowIndex
			});
			return board;
		});

		return true;
	}

	private checkLine(from: PlayerTile, direction: Vector2): number[] | null {
		const playersIndices: number[] = [];
		const board = get(this.board);

		for (let step = 0; step < 4; step++) {
			const boardIndex = Tile.boardIndexFromPosition(
				from.boardPosition.clone().add(direction.clone().multiplyScalar(step))
			);
			if (board[boardIndex]?.player !== from.player) return null;
			playersIndices.push(boardIndex);
		}

		return playersIndices;
	}

	private checkPlayer(boardIndex: number) {
		const board = get(this.board);
		const playerTile = board[boardIndex];
		const horizontal = this.checkLine(playerTile, HORIZONTAL_LINE);
		const vertical = this.checkLine(playerTile, VERTICAL_LINE);
		const diagonal = this.checkLine(playerTile, DIAGONAL_LINE);

		const winner = horizontal || vertical || diagonal;
		if (winner) {
			const indices = new Set([...(horizontal ?? []), ...(vertical ?? []), ...(diagonal ?? [])]);
			return Array.from(indices.values());
		}

		return null;
	}

	private checkBoard() {
		for (let boardIndex = 0; boardIndex < get(this.board).length; boardIndex++) {
			if (!get(this.board)[boardIndex]) continue;

			const validLine = this.checkPlayer(boardIndex);
			if (validLine === null) continue;

			return validLine;
		}
		return null;
	}

	private setWinner(indices: number[]) {
		const board = get(this.board);
		for (const index of indices) {
			board[index].setWinner();
		}
	}

	public pointerMove(point: Vector3) {
		this.updateHighlight(point);
	}

	public pointerPress() {
		if (this.state === GameState.Running) {
			if (this.spawnPlayerTile()) {
				const winnerIndices = this.checkBoard();
				if (winnerIndices) {
					this.setWinner(winnerIndices);
				} else {
					this.currentPlayer = (this.currentPlayer + 1) % 2;
				}
			}
		}
	}

	public update(delta: number) {
		Timer.update();

		for (const playerTile of get(this.board)) {
			if (!playerTile) continue;

			playerTile.update(delta);
		}
	}
}
