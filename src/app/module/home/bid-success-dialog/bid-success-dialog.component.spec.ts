import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BidSuccessDialogComponent } from './bid-success-dialog.component';

describe('BidSuccessDialogComponent', () => {
  let component: BidSuccessDialogComponent;
  let fixture: ComponentFixture<BidSuccessDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BidSuccessDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BidSuccessDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
