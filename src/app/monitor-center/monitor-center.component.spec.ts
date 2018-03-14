import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorCenterComponent } from './monitor-center.component';

describe('MonitorCenterComponent', () => {
  let component: MonitorCenterComponent;
  let fixture: ComponentFixture<MonitorCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitorCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
