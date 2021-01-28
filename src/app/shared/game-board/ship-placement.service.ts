import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, Subject } from 'rxjs';

export type ShipPlacement = {[field: string]: ShipConfig}; //Map<string, ShipConfig>;

export interface ShipConfig {
	field: string,
	size: number,
	horizontal: boolean,
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
			console.log(field)

			const availableShip = this.getRandomAvailableShip(shipsAvailable);
			if (!availableShip)
				break;

			const newShipConfig: ShipConfig = {
				field,
				horizontal: (Math.random() > 0.5),
				size: availableShip?.size,
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
