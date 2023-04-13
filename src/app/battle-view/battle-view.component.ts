import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BoardType } from '../shared/game-board/game-board.component';
import { ShipPlacementService } from '../shared/game-board/ship-placement.service';

@Component({
	selector: 'app-battle-view',
	templateUrl: './battle-view.component.html',
	styleUrls: ['./battle-view.component.scss']
})
export class BattleViewComponent implements OnInit {

	myTurn = false;
	headline = 'Battle!';
	BoardType = BoardType;

	constructor(
		private placementService: ShipPlacementService,
	) { }

	ngOnInit(): void {
		this.placementService.myTurn$.subscribe((myTurn) => {
			this.myTurn = myTurn;
			this.headline = myTurn ? "Your turn" : "Opponent's turn";
		});
	}

}
