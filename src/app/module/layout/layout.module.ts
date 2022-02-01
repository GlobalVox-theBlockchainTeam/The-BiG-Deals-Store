import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MaterialModule } from '../shared/material/material.module';
import { SharedModule } from '../shared/shared.module';
import { AuthDialogComponent } from '../dialog/auth-dialog/auth-dialog.component';
import { RegisterFormComponent } from '../dialog/inc/register-form/register-form.component';
import { LoginFormComponent } from '../dialog/inc/login-form/login-form.component';
import { WalletPairingDialogComponent } from '../dialog/wallet-pairing-dialog/wallet-pairing-dialog.component';
import { BuyPlayDialogComponent } from '../dialog/buy-play-dialog/buy-play-dialog.component';
import { CheckoutDialogComponent } from '../dialog/checkout-dialog/checkout-dialog.component';
import { CustomerAddressComponent } from '../dialog/inc/customer-address/customer-address.component';
import { OrderPaymentComponent } from '../dialog/inc/order-payment/order-payment.component';
import { OrderSuccessComponent } from '../dialog/inc/order-success/order-success.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    AuthDialogComponent,
    RegisterFormComponent,
    LoginFormComponent,
    WalletPairingDialogComponent,
    CheckoutDialogComponent,
    BuyPlayDialogComponent,
    CustomerAddressComponent,
    OrderPaymentComponent,
    OrderSuccessComponent
  ],
  imports: [
    CommonModule,
    MatSidenavModule,
    MaterialModule,
    SharedModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    CustomerAddressComponent,
    OrderPaymentComponent,
    OrderSuccessComponent
  ]
})
export class LayoutModule { }
