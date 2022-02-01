import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WalletActionsRoutingModule } from './wallet-actions-routing.module';
import { WalletActionMethodsComponent } from './wallet-action-methods/wallet-action-methods.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    WalletActionMethodsComponent
  ],
  imports: [
    CommonModule,
    WalletActionsRoutingModule,
    SharedModule,
  ]
})
export class WalletActionsModule { }
