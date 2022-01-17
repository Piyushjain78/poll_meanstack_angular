import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollcreateComponent } from './pollcreate.component';

describe('PollcreateComponent', () => {
  let component: PollcreateComponent;
  let fixture: ComponentFixture<PollcreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PollcreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PollcreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
