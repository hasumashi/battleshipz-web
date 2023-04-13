import { Component } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	title = 'battleshipz-web';

	constructor(socket: Socket) {
		socket.on('connect', () => {
			console.log('[socket.io] Connected')
		})
	}
}
