import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletPairingDialogComponent } from './wallet-pairing-dialog.component';

describe('WalletPairingDialogComponent', () => {
  let component: WalletPairingDialogComponent;
  let fixture: ComponentFixture<WalletPairingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalletPairingDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletPairingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
