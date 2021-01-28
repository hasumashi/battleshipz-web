import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

	playersOnline: number = 0;

	constructor(private socket: Socket) {
		socket.on('playersOnline', (online: number) => {
			console.log('[socket.io] Players online:', online);
			this.playersOnline = online;
		});
	}

	ngOnInit(): void {
	}

}
