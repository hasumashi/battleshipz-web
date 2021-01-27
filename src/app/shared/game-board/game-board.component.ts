import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-game-board',
	templateUrl: './game-board.component.html',
	styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit {

	@Input() size = 10;

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
		console.log('SHIP DROP', event);
	}
}
