import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';

@Component({
	selector: 'app-main-view',
	templateUrl: './main-view.component.html',
	styleUrls: ['./main-view.component.scss']
})
export class MainViewComponent implements OnInit {

	panelTitle = '';
	baseRoutePath = this.route.snapshot.routeConfig?.path;

	isPanelOpen = () => !!this.panelTitle;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private socket: Socket,
	) {
		// socket.on('playersOnline', (online) => {
		// 	console.log('[socket.io] Players online:', online);
		// })
	}

	ngOnInit(): void {
		this.panelTitle = this.route.firstChild?.snapshot.data.title;

		this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				this.panelTitle = this.route.snapshot.firstChild?.data.title;
			}
		});

		// this.socket.on('connected', () => {
		// 	console.log('Socket.io connected');
		// })

	}

}
