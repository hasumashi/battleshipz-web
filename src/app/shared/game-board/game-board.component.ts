import { CdkDrag, CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { ShipConfig, ShipPlacement, ShipPlacementService } from './ship-placement.service';


@Component({
	selector: 'app-game-board',
	templateUrl: './game-board.component.html',
	styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit {

	@Input() size = 10;

	shipsPlaced: ShipPlacement = {};

	constructor(private placementService: ShipPlacementService) { }

	ngOnInit(): void {
		this.placementService.setBoardSize(this.size);
		this.placementService.placementChanged$.subscribe(placement => this.shipsPlaced = placement);
	}

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

			if (this.placementService.addShip(newShipConfig)) {
				availableShips.count -= 1;
			}
		}
	}

	rotateShip(field: string) {
		this.placementService.rotateShip(field);
	}


	// TODO unused
	// canDropPredicate(item: CdkDrag<any>) {
	// 	return this.placementService.checkCollisions({
	// 		field: '??',
	// 		size: item.data.size,
	// 		horizontal: true,
	// 	});
	// }
}
