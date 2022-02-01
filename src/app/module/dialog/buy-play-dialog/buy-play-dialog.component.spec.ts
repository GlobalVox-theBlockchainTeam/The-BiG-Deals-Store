import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyPlayDialogComponent } from './buy-play-dialog.component';

describe('BuyPlayDialogComponent', () => {
  let component: BuyPlayDialogComponent;
  let fixture: ComponentFixture<BuyPlayDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyPlayDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyPlayDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
