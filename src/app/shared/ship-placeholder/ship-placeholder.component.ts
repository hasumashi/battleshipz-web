import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-ship-placeholder',
	templateUrl: './ship-placeholder.component.html',
	styleUrls: ['./ship-placeholder.component.scss']
})
export class ShipPlaceholderComponent implements OnInit {

	@Input() size = 1;
	@Input() content = '';

	constructor() { }

	ngOnInit(): void { }

}
