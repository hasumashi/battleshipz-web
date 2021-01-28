import { TestBed } from '@angular/core/testing';

import { ShipPlacementService } from './ship-placement.service';

describe('ShipPlacementService', () => {
	let service: ShipPlacementService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(ShipPlacementService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
