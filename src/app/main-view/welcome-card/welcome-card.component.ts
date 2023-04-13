import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-welcome-card',
	templateUrl: './welcome-card.component.html',
	styleUrls: ['./welcome-card.component.scss'] // TODO unnecessary?
})
export class WelcomeCardComponent implements OnInit {

	@Input('img') img = 'assets/board-perspective.png';
	@Input('title') title = 'Welcome';
	@Input('content') content = 'Ad magna cillum do consequat veniam ad laboris.'; // TODO accept template in body

	constructor() { }

	ngOnInit(): void {
	}

}
