import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RescueCountComponent } from './rescue-count.component';

describe('RescueCountComponent', () => {
  let component: RescueCountComponent;
  let fixture: ComponentFixture<RescueCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RescueCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RescueCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
