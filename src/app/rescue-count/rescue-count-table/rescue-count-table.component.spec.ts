import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RescueCountTableComponent } from './rescue-count-table.component';

describe('RescueCountTableComponent', () => {
  let component: RescueCountTableComponent;
  let fixture: ComponentFixture<RescueCountTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RescueCountTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RescueCountTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
