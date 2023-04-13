import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { PlayersService } from '../shared/services/players.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

	playersOnline: number = 0;

	constructor(private playersService: PlayersService) {}

	ngOnInit(): void {
		this.playersService.playersOnline$.subscribe((playersOnline) => {
			this.playersOnline = playersOnline;
		});
	}

}
