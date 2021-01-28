import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type ShipPlacement = {[field: string]: ShipConfig}; //Map<string, ShipConfig>;

export interface ShipConfig {
	field: string,
	size: number,
	horizontal: boolean,
}

export interface AvailableShips {
	size: number,
	count: number,
}

@Injectable({
	providedIn: 'root'
})
export class ShipPlacementService {

	shipsPlaced: ShipPlacement = {};
	boardSize: number = 10;

	private placementChangedSource = new Subject<ShipPlacement>();
	placementChanged$ = this.placementChangedSource.asObservable();

	constructor() { }

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

	addShipsRandomly(shipsAvailable: any) {

	}

	checkCollisions(shipConfig: ShipConfig): boolean {
		const { field } = shipConfig;
		const row = field[0].charCodeAt(0) - 'A'.charCodeAt(0);
		const col = parseInt(field[1]);

		if (shipConfig.horizontal && col + shipConfig.size > this.boardSize)
			return true;

		if (!shipConfig.horizontal && row + shipConfig.size > this.boardSize)
			return true;

		for (let i = 0; i < shipConfig.size; i++) {
			const offset: [number, number] = shipConfig.horizontal ? [0,i] : [i,0]
			if (this.checkCollidingFields(this.getOffsetField(field, offset))) {
				return true;
			}
		}

		return false;
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
		} else {
			this.shipsPlaced[field] = newConfig;
			this.placementChangedSource.next(this.shipsPlaced);
			console.log('rotated')
		}
	}

	private getOffsetField(field: string, offset: [number, number]) {
		const [y, x] = offset;
		const firstLetter = 'A'.charCodeAt(0);
		const row = field[0].charCodeAt(0) - firstLetter;
		const col = parseInt(field[1]);
		return String.fromCharCode(row + y + firstLetter) + (col + x).toString();
	}

	private checkCollidingFields(field: string) {
		const collidingFields = [
			this.getOffsetField(field, [-1, -1]),
			this.getOffsetField(field, [-1,  0]),
			this.getOffsetField(field, [-1,  1]),
			this.getOffsetField(field, [ 0, -1]),
			field,
			this.getOffsetField(field, [ 0,  1]),
			this.getOffsetField(field, [ 1, -1]),
			this.getOffsetField(field, [ 1,  0]),
			this.getOffsetField(field, [ 1,  1]),
		];
		return collidingFields.some(cf => this.shipsPlaced[cf]);
	}
}
