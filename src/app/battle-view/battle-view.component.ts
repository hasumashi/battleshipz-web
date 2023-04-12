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

	constructor(private socket: Socket, private placementService: ShipPlacementService) {
		// this.socket.on('')
		this.placementService.onOpponentShot().subscribe((shot) => {
			console.log('onOpponentShot', shot);
		});
	}

	ngOnInit(): void {
		if (this.placementService.playingFirst) {
			this.headline = 'Your turn'
			this.myTurn = true;
		} else {
			this.headline = "Opponent's turn";
			this.myTurn = false;
		}
	}

}
