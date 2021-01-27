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

	private getOffsetField(field: string, y: number, x: number) {
		const firstLetter = 'A'.charCodeAt(0);
		const row = field[0].charCodeAt(0) - firstLetter;
		const col = parseInt(field[1]);
		return String.fromCharCode(row + y + firstLetter) + (col + x).toString();
	}

	private checkCollidingFields(field: string) {
		const collidingFields = [
			field,
			this.getOffsetField(field, -1, -1),
			this.getOffsetField(field, -1,  0),
			this.getOffsetField(field, -1,  1),
			this.getOffsetField(field,  0, -1),
			this.getOffsetField(field,  0,  1),
			this.getOffsetField(field,  1, -1),
			this.getOffsetField(field,  1,  0),
			this.getOffsetField(field,  1,  1),
		];
		return collidingFields.some(cf => this.shipsPlaced[cf]);
	}

	private checkCollisions(shipConfig: ShipConfig): boolean {
		const { field } = shipConfig;
		const row = field[0];
		const col = field[1];

		if (parseInt(col) + shipConfig.size > 10)
			return true;

		for (let i = 0; i < shipConfig.size; i++) {
			if (this.checkCollidingFields(this.getOffsetField(field, 0, i))) {
				return true;
			}
		}

		return false;
	}

	canDropPredicate(item: CdkDrag<any>) {
		return this.checkCollisions({
			field: '??',
			size: item.data.size,
			horizontal: true,
		});
	  }
}
