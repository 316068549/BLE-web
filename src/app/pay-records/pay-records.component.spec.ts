import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayRecordsComponent } from './pay-records.component';

describe('PayRecordsComponent', () => {
  let component: PayRecordsComponent;
  let fixture: ComponentFixture<PayRecordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayRecordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
