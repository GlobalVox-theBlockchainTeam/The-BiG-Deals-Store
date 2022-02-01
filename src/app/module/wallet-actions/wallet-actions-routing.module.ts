import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WalletActionMethodsComponent } from './wallet-action-methods/wallet-action-methods.component';

const routes: Routes = [
  {path: ':user_id/:wallet_type/:action', component: WalletActionMethodsComponent},
  {path: ':user_id/:wallet_type/:action/:amount', component: WalletActionMethodsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WalletActionsRoutingModule { }
