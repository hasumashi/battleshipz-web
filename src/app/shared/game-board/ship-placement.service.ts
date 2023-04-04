import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, Subject } from 'rxjs';

export type ShipPlacement = {[field: string]: ShipConfig}; //Map<string, ShipConfig>;

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

@Injectable({
	providedIn: 'root'
})
export class ShipPlacementService {

	shipsPlaced: ShipPlacement = {};
	boardSize: number = 10;
	playingFirst = false;

	private placementChangedSource = new BehaviorSubject<ShipPlacement>({});
	placementChanged$ = this.placementChangedSource.asObservable();

	private opponentPlacementSource = new BehaviorSubject<ShipPlacement>({});
	opponentPlacement$ = this.opponentPlacementSource.asObservable();

	setPlayingFirst(isFirst: boolean) {
		this.playingFirst = isFirst;
	}

	onOpponentShot() {
		return this.socket.fromEvent<any>('opponent:shot');
	}

	onHit() {
		return this.socket.fromEvent<any>('player:hit');
	}

	onGameEnd() {
		return this.socket.fromEvent<any>('game:end');
	}

	constructor(private socket: Socket) {
		// this.socket.fromEvent('playersOnline').subscribe(playersOnline => console.log(`There are ${playersOnline} players online`));
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
		console.log(coords.flat());
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

	private generateBoardGrid() {
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
