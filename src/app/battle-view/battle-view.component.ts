import { Component, OnInit } from '@angular/core';
import { BoardType } from '../shared/game-board/game-board.component';

@Component({
	selector: 'app-battle-view',
	templateUrl: './battle-view.component.html',
	styleUrls: ['./battle-view.component.scss']
})
export class BattleViewComponent implements OnInit {

	headline = 'Battle!';
	BoardType = BoardType;

	constructor() { }

	ngOnInit(): void { }

}
