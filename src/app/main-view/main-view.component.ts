import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';

@Component({
	selector: 'app-main-view',
	templateUrl: './main-view.component.html',
	styleUrls: ['./main-view.component.scss']
})
export class MainViewComponent implements OnInit {

	panelTitle = '';
	baseRoutePath = this.route.snapshot.routeConfig?.path;

	isPanelOpen = () => !!this.panelTitle;

	constructor(private router: Router, private route: ActivatedRoute) { }

	ngOnInit(): void {
		this.panelTitle = this.route.firstChild?.snapshot.data.title;

		this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				this.panelTitle = this.route.snapshot.firstChild?.data.title;
			}
		});
	}

}
