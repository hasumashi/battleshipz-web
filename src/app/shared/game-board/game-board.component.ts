import { CdkDrag, CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';

type ShipPlacement = {[field: string]: ShipConfig}; //Map<string, ShipConfig>;

interface ShipConfig {
	field: string,
	size: number,
	horizontal: boolean,
}

@Component({
	selector: 'app-game-board',
	templateUrl: './game-board.component.html',
	styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit {

	@Input() size = 10;

	shipsPlaced: ShipPlacement = {}; // = new Map();

	constructor() { }

	ngOnInit(): void { }

	generateArray(length: number, from: number = 0) {
		return Array(length).fill(0).map((_,i) => from + i);
	}

	generateFieldsArray(length: number, rowChar: string, from: number = 0) {
		return Array(length).fill(rowChar).map((x,i) => x + (from + i));
	}

	generateCharArray(length: number, startingChar: string): string[] {
		return Array(length).fill(startingChar).map((char, i) =>
			String.fromCharCode(char.charCodeAt(0) + i)
		);
	}

	shipDropped(event: CdkDragDrop<string[]>) {
		console.log('GameBoard:DROP', event);

		const availableShips = event.item.data;
		console.log(availableShips);

		if (event.container !== event.previousContainer) {
			const targetField = event.container.id;
			const newShipConfig: ShipConfig = {
				field: targetField,
				size: availableShips.size,
				horizontal: true,
			};

			if (!this.checkCollisions(newShipConfig)) {
				availableShips.count -= 1;
				this.shipsPlaced[targetField] = newShipConfig;
			}
		}
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

	private checkCollisions(shipConfig: ShipConfig): boolean {
		const { field } = shipConfig;
		const row = field[0].charCodeAt(0) - 'A'.charCodeAt(0);
		const col = parseInt(field[1]);

		if (shipConfig.horizontal && col + shipConfig.size > this.size)
			return true;

		if (!shipConfig.horizontal && row + shipConfig.size > this.size)
			return true;

		for (let i = 0; i < shipConfig.size; i++) {
			const offset: [number, number] = shipConfig.horizontal ? [0,i] : [i,0]
			if (this.checkCollidingFields(this.getOffsetField(field, offset))) {
				return true;
			}
		}

		return false;
	}

	// TODO unused
	canDropPredicate(item: CdkDrag<any>) {
		return this.checkCollisions({
			field: '??',
			size: item.data.size,
			horizontal: true,
		});
	  }
}
