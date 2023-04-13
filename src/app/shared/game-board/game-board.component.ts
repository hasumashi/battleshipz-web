import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { FieldsMap, ShipConfig, ShipPlacementService } from './ship-placement.service';

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
	@Input() enabled = true;

	shipsPlaced: FieldsMap<ShipConfig> = {};

	private fieldStates: { [field: string]: number } = {};

	readonly boardFiledIds = this.placementService.generateFieldCoords(10);

	boardHits(field: string) {
		return this.fieldStates[field] === 1;
	}

	boardMises(field: string) {
		return this.fieldStates[field] === 2;
	}

	constructor(
		private socket: Socket,
		private placementService: ShipPlacementService,
	) { }

	ngOnInit(): void {
		this.placementService.setBoardSize(this.size);

		const placement$ = (this.type === BoardType.Player) ?
			this.placementService.placementChanged$ :
			this.placementService.opponentPlacement$;
		placement$.subscribe(placement => this.shipsPlaced = placement);

		if (this.type === BoardType.Opponent) {
			this.placementService.fieldStates$.subscribe((states) => this.fieldStates = states);
		} else if (this.type === BoardType.Player) {
			this.placementService.onOpponentShot().subscribe((shot) => {
				console.log(`[${this.type}] onOpponentShot`, shot);
				this.setFieldState(shot.hit, shot.field);
			});
		}
	}

	private setFieldState(hit: any, field: string) {
		console.log(`[${this.type}] #setFieldState`, hit, field);
		this.fieldStates[field] = 1 - hit + 1; // FIXME enum hack
	}

	hit(field: string) {
		if (this.battle && this.type === BoardType.Opponent && this.enabled) {
			this.socket.emit('player:shoot', field, (data: any) => {
				console.log(`[${this.type}] SHOOT callback data:`, data);
				const { hit } = data;
				this.setFieldState(hit, field);
				if (!hit) {
					this.placementService.setPlayersTurn(false);
				}
			});
		}
	}

	generateArray(length: number, from: number = 0) {
		return Array(length).fill(0).map((_, i) => from + i);
	}

	generateFieldsArray(length: number, rowChar: string, from: number = 0) {
		return Array(length).fill(rowChar).map((x, i) => x + (from + i));
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
			this.placementService.removeShip(oldShipConfig.field);
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

	rotateShip(field: string, event: any) {
		if (this.battle) {
			return;
		}
		const target = event.currentTarget;
		target.classList.remove('anim-shake-rotate');
		setTimeout(() => {
			if (this.placementService.rotateShip(field) === false) {
				target.classList.add('anim-shake-rotate')
			}
		});
	}
}
