import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletActionMethodsComponent } from './wallet-action-methods.component';

describe('WalletActionMethodsComponent', () => {
  let component: WalletActionMethodsComponent;
  let fixture: ComponentFixture<WalletActionMethodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalletActionMethodsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletActionMethodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
