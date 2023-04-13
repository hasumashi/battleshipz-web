import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, ReplaySubject, Subject, tap } from 'rxjs';

export type FieldsMap<T> = {[field: string]: T}; //Map<string, ShipConfig>;

export interface ShipConfig {
	field: string,
	size: number,
	horizontal: boolean,
	placed: true,
}

export interface AvailableShip {
	size: number,
	count: number,
}

export enum FieldState {
	None,
	Hit,
	Miss,
}

@Injectable({
	providedIn: 'root'
})
export class ShipPlacementService {

	shipsPlaced: FieldsMap<ShipConfig> = {};
	fieldStates: FieldsMap<FieldState> = {};

	boardSize: number = 10;
	myTurn = false;

	private placementChangedSource = new BehaviorSubject<FieldsMap<ShipConfig>>({});
	placementChanged$ = this.placementChangedSource.asObservable();

	private opponentPlacementSource = new BehaviorSubject<FieldsMap<ShipConfig>>({});
	opponentPlacement$ = this.opponentPlacementSource.asObservable();

	private fieldStatesSource = new BehaviorSubject<FieldsMap<FieldState>>({});
	fieldStates$ = this.fieldStatesSource.asObservable();

	private myTurnSource = new ReplaySubject<boolean>(1);
	myTurn$ = this.myTurnSource.asObservable();

	setPlayersTurn(playerTurn: boolean) {
		this.myTurn = playerTurn;
		this.myTurnSource.next(this.myTurn);
	}

	onOpponentShot() {
		return this.socket.fromEvent<any>('opponent:shot').pipe(
			tap(() => {
				console.log('TAP', this.myTurn)
				this.setPlayersTurn(true);
			}),
		);
	}

	onGameEnd() {
		return this.socket.fromEvent<any>('game:end');
	}

	constructor(private socket: Socket) {
	}

	setBoardSize(size: number) {
		this.boardSize = size;
	}

	addShip(newShipConfig: ShipConfig): boolean {
		if (!this.checkCollisions(newShipConfig)) {
			this.shipsPlaced[newShipConfig.field] = newShipConfig;
			this.placementChangedSource.next(this.shipsPlaced);
			return true;
		}
		return false;
	}

	// TODO DRY
	private allShipsUsed(availableShips: AvailableShip[]) {
		return availableShips.every(x => x.count === 0);
	}
	private getRandomInt(min: number, max: number): number {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	private getRandomAvailableShip(shipsAvailable: AvailableShip[]): AvailableShip | undefined {
		return shipsAvailable.find(x => x.count !== 0);
	}

	addShipsRandomly(shipsAvailable: AvailableShip[]) {
		while (!this.allShipsUsed(shipsAvailable)) {
			const col = this.getRandomInt(0, 9).toString();
			const row = String.fromCharCode('A'.charCodeAt(0) + this.getRandomInt(0, 9));
			const field = row + col;

			const availableShip = this.getRandomAvailableShip(shipsAvailable);
			if (!availableShip)
				break;

			const newShipConfig: ShipConfig = {
				field,
				horizontal: (Math.random() > 0.5),
				size: availableShip?.size,
				placed: true,
			};
			if (this.addShip(newShipConfig)) {
				availableShip.count -= 1;
			}
		}

		this.placementChangedSource.next(this.shipsPlaced);
	}

	clearAllShips() {
		this.shipsPlaced = {};
		this.placementChangedSource.next(this.shipsPlaced);
	}

	checkCollisions(shipConfig: ShipConfig): boolean {
		const { field } = shipConfig;
		const [row, col] = this.parseFieldString(field);

		if (shipConfig.horizontal && col + shipConfig.size > this.boardSize)
			return true;

		if (!shipConfig.horizontal && row + shipConfig.size > this.boardSize)
			return true;

		const collisionGrid = this.generateBoardGrid();
		if (shipConfig.horizontal) {
			for (let i = 0; i < shipConfig.size; i++) {
				if (this.checkCollidingFields(row, col + i, collisionGrid)) {
					return true;
				}
			}
		} else {
			for (let i = 0; i < shipConfig.size; i++) {
				if (this.checkCollidingFields(row + i, col, collisionGrid)) {
					return true;
				}
			}
		}

		return false;
	}

	removeShip(field: string) {
		const oldConfig = this.shipsPlaced[field];
		delete this.shipsPlaced[field];
		console.log('removed ship:', oldConfig)
		return oldConfig;
	}

	rotateShip(field: string) {
		const oldConfig = this.shipsPlaced[field];
		delete this.shipsPlaced[field];
		const newConfig = {
			...oldConfig,
			horizontal: !oldConfig.horizontal,
		};
		console.log(newConfig);
		if (this.checkCollisions(newConfig)) {
			this.shipsPlaced[field] = oldConfig;
			console.log('cannot rotate - collisions :/')
			return false;
		} else {
			this.shipsPlaced[field] = newConfig;
			this.placementChangedSource.next(this.shipsPlaced);
			console.log('rotated')
		}
		return true;
	}

	generateFieldCoords(boardSize: number): string[] {
		const coords = Array(boardSize).fill('').map((row,y) => {
			return Array(boardSize).fill('').map((col,x) => {
				const rowChar = String.fromCharCode('A'.charCodeAt(0) + y);
				const colChar = x.toString();
				return `${rowChar}${colChar}`;
			})
		})
		return coords.flat();
	}

	private checkCollidingFields(row: number, col: number, grid: number[][]) {
		const collidingFields = [
			[row-1, col-1],
			[row-1, col  ],
			[row-1, col+1],
			[row  , col-1],
			[row  , col],
			[row  , col+1],
			[row+1, col-1],
			[row+1, col  ],
			[row+1, col+1],
		];
		return collidingFields.some(([y,x]) => grid[y]?.[x]);
	}

	private parseFieldString(field: string): [number, number] {
		return [
			field.charCodeAt(0) - 'A'.charCodeAt(0),
			+field.charAt(1),
		];
	}

	generateBoardGrid() {
		const grid = Array(10).fill(null).map(() => Array(10).fill(false));
		for (const shipConfig of Object.values(this.shipsPlaced)) {
			const [row, col] = this.parseFieldString(shipConfig.field);
			if (shipConfig.horizontal) {
				for (let i = 0; i < shipConfig.size; i++) grid[row][col + i] = true;
			} else {
				for (let i = 0; i < shipConfig.size; i++) grid[row + i][col] = true;
			}
		}
		return grid;
	}
}
