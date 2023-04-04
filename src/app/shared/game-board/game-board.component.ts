import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ShipConfig, ShipPlacement, ShipPlacementService } from './ship-placement.service';

export enum BoardType {
	Player,
	Opponent,
}

@Component({
	selector: 'app-game-board',
	templateUrl: './game-board.component.html',
	styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit {

	@Input() size = 10;
	@Input() type = BoardType.Player;
	@Input() battle = false;

	shipsPlaced: ShipPlacement = {};

	_boardHits: {[field: string]: boolean} = {};
	opponentBoardHits: {[field: string]: boolean} = {};

	boardFiledIds = this.placementService.generateFieldCoords(10);

	boardHits(field: string) {
		return this._boardHits[field];
		// if (this.type === BoardType.Player)
		// 	return this.playerBoardHits[field];
		// else
		// 	return this.opponentBoardHits[field];
	}

	constructor(private placementService: ShipPlacementService, private socket: Socket) {
		this.placementService.onHit().subscribe(shot => {
			if (shot.hit) {
				this._boardHits[shot.field] = true;
			}
		})
	}

	ngOnInit(): void {
		this.placementService.setBoardSize(this.size);
		const placement$ = (this.type === BoardType.Player) ?
			this.placementService.placementChanged$ :
			this.placementService.opponentPlacement$;
		placement$.subscribe(placement => this.shipsPlaced = placement);

		this.placementService.onOpponentShot
	}

	hit(field: string) {
		if (this.battle) {
			this.socket.emit('player:shoot', field);
			// this._boardHits[field] = true;
		}
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
		const eventData = event.item.data;
		console.log('GameBoard:DROP', event);
		console.log(' - eventData:', eventData);

		if (event.container === event.previousContainer) {
			return;
		}
		const targetField = event.container.id;
		if (eventData.placed) {
			// moving already placed ship
			const oldShipConfig = eventData as ShipConfig;
			const movedShipConfig: ShipConfig = {
				...oldShipConfig,
				field: targetField,
			};
			this.placementService.removeShip(oldShipConfig.field);;
			if (!this.placementService.addShip(movedShipConfig))
				this.placementService.addShip(oldShipConfig);
			return;
		} else {
			// adding new ship
			const newShipConfig: ShipConfig = {
				field: targetField,
				size: eventData.size,
				horizontal: true,
				placed: true,
			};

			if (this.placementService.addShip(newShipConfig)) {
				eventData.count -= 1;
			}
		}
	}

	rotateShip(field: string) {
		this.placementService.rotateShip(field);
	}
}
