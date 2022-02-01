import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '',
    children: [
      { path: '', loadChildren: () => import('./module/home/home.module').then(m => m.HomeModule) }
    ]
  },
  { path: 'wallet-actions', loadChildren: () => import('./module/wallet-actions/wallet-actions.module').then(m => m.WalletActionsModule) },
  { path: 'stats', loadChildren: () => import('./module/stats/stats.module').then(m => m.StatsModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
