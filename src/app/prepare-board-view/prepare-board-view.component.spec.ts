import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareBoardViewComponent } from './prepare-board-view.component';

describe('PrepareBoardViewComponent', () => {
  let component: PrepareBoardViewComponent;
  let fixture: ComponentFixture<PrepareBoardViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrepareBoardViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepareBoardViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
