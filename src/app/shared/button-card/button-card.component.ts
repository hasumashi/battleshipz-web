import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-button-card',
	templateUrl: './button-card.component.html',
	styleUrls: ['./button-card.component.scss']
})
export class ButtonCardComponent {

	@Input() title = '';
	@Input() subtitle = '';
	@Input() buttonText = 'GO';
	@Input() color = '#3f51b5';
	@Input() link = '/'; // routerLink to navigate when button clicked

	constructor() { }

}
