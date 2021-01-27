import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-prepare-board-view',
	templateUrl: './prepare-board-view.component.html',
	styleUrls: ['./prepare-board-view.component.scss']
})
export class PrepareBoardViewComponent implements OnInit {

	opponentInfo = 'Your opponent is still preparing';

	private boardSize = 10;
	boardFiledIds = this.generateFieldCoords(this.boardSize);

	generateFieldCoords(boardSize: number): string[][] {
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

	drop2(event: CdkDragDrop<string[]>) {
		// moveItemInArray(this.ships, event.previousIndex, event.currentIndex);
		console.log('BYE BYE ship', event.previousIndex, event.currentIndex, event);
	}

	exit2(event: CdkDragDrop<string[]>) {
		console.log('EXIT2', event);
	}

	constructor() { }

	ngOnInit(): void { }

	arrangeShipsRandomly() {
		console.log('TODO');
	}
}
