import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';

import { AvailableShip, FieldsMap, ShipConfig, ShipPlacementService } from '../shared/game-board/ship-placement.service';

@Component({
	selector: 'app-prepare-board-view',
	templateUrl: './prepare-board-view.component.html',
	styleUrls: ['./prepare-board-view.component.scss']
})
export class PrepareBoardViewComponent implements OnInit {

	opponentInfo = 'Your opponent is still preparing';
	markedAsReady = false;

	private boardSize = 10;
	boardFiledIds = this.generateFieldCoords(this.boardSize);

	availableShips: AvailableShip[] = this.startingAvailableShips();
	shipsPlaced: FieldsMap<ShipConfig> = {};


	constructor(
		private router: Router,
		private socket: Socket,
		private snackBar: MatSnackBar,
		private placementService: ShipPlacementService,
	) { }

	ngOnInit(): void {
		this.socket.on('opponent:ready', () => {
			this.opponentInfo = 'Your opponent is ready!';
		});

		this.socket.on('game:start', (info: any) => {
			console.log(info.first);
			this.placementService.setPlayersTurn(info.first);
			this.router.navigate(['/battle']);
		});

		this.socket.on('opponent:disconnected', () => {
			this.snackBar.open('Your opponent has disconnected!', undefined, { duration: 5000 });
			this.router.navigate(['/']);
		});

		this.placementService.clearAllShips();
		this.placementService.placementChanged$.subscribe(placement => this.shipsPlaced = placement);
	}

	private startingAvailableShips() {
		return [
			{size: 4, count: 1},
			{size: 3, count: 2},
			{size: 2, count: 3},
			{size: 1, count: 4},
		];
	}

	allShipsUsed() {
		return this.availableShips.every(x => x.count === 0);
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


	resetShips() {
		this.availableShips = this.startingAvailableShips();
		this.placementService.clearAllShips();
	}

	arrangeShipsRandomly() {
		this.resetShips();
		this.placementService.addShipsRandomly(this.availableShips);
	}

	playerReady() {
		console.log('Marked as ready');
		this.opponentInfo = 'Waiting for opponent…';
		this.markedAsReady = true;
		this.socket.emit('player:ready', {
			shipsPlaced: this.shipsPlaced,
			board: this.placementService.generateBoardGrid(),
		});
	}
}
