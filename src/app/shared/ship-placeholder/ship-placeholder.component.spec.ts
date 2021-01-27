import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipPlaceholderComponent } from './ship-placeholder.component';

describe('ShipPlaceholderComponent', () => {
	let component: ShipPlaceholderComponent;
	let fixture: ComponentFixture<ShipPlaceholderComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ShipPlaceholderComponent]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ShipPlaceholderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
