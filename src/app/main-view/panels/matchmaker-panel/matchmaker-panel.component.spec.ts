import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchmakerPanelComponent } from './matchmaker-panel.component';

describe('MatchmakerPanelComponent', () => {
  let component: MatchmakerPanelComponent;
  let fixture: ComponentFixture<MatchmakerPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatchmakerPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchmakerPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
