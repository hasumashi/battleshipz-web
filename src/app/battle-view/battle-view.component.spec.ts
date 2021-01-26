import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleViewComponent } from './battle-view.component';

describe('BattleViewComponent', () => {
  let component: BattleViewComponent;
  let fixture: ComponentFixture<BattleViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BattleViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BattleViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
