import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarnDetailComponent } from './warn-detail.component';

describe('WarnDetailComponent', () => {
  let component: WarnDetailComponent;
  let fixture: ComponentFixture<WarnDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarnDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarnDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
