import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { CountdownModule } from 'ngx-countdown';
import { MaterialModule } from '../shared/material/material.module';
import { SocketModule } from '../socket/socket.module';
import { BidSuccessDialogComponent } from './bid-success-dialog/bid-success-dialog.component';

@NgModule({
  declarations: [
    HomeComponent,
    BidSuccessDialogComponent
  ],
  imports: [
    CommonModule,
    CountdownModule,
    HomeRoutingModule,
    MaterialModule
  ]
})
export class HomeModule { }
