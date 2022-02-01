import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { Constants } from 'src/app/helper/constants.helper';

const config: SocketIoConfig = { url: Constants.SOCKET_SERVER, options: {} };

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SocketIoModule.forRoot(config)
  ]
})
export class SocketModule { }
