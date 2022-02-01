import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';
import { Constants } from '../helper/constants.helper';

@Injectable({providedIn: 'root'})
export class SocketService {
    constructor(
        private socket: Socket
    ) {}

    sendMessage(msg: string) {
        this.socket.emit(Constants.SOCKET_BID_SEND_KEY, msg);
    }

    getMessage(productID: any) {
        return this.socket.fromEvent(Constants.SOCKET_BID_RECEIVED_KEY.replace(':productID', productID)).pipe(map((data: any) => data));
    }

    getCountdown(productID: any) {
        return this.socket.fromEvent(Constants.SOCKET_COUNTDOWN_KEY.replace(':productID', productID)).pipe(map((data: any) => data));
    }

    getAuctionRemainingTime(productID: any) {
        return this.socket.fromEvent(Constants.SOCKET_AUCTION_REMAINING_TIME_KEY.replace(':productID', productID)).pipe(map((data: any) => data));
    }

    getBidClose(productID: any) {
        return this.socket.fromEvent(Constants.SOCKET_BID_CLOSE_KEY.replace(':productID', productID)).pipe(map((data: any) => data));
    }

    getBidStatus() {
        return this.socket.fromEvent(Constants.SOCKET_BID_STATUS_KEY).pipe(map((data: any) => data));
    }
}