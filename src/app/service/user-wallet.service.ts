import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Constants } from '../helper/constants.helper';
import { CustomUtils } from '../helper/custom-utils.helper';
import { BuyPlayPackageInterface } from '../interface/buy-play-package.interface';
import { WalletPairingPostBodyInterface } from '../interface/wallet-pairing-post-body.interface';
import { Customer } from '../model/customer.model';
import { GenericApiService } from './generic-api.service';

@Injectable({providedIn: 'root'})
export class UserWalletService extends GenericApiService {
    private ngUnsubscribe = new Subject();

    constructor(
        private httpClient: HttpClient
        ) { super(httpClient); }

    public getWalletBalance(): Observable<any> {
        const customer: Customer = CustomUtils.getCurrentCustomer();
        const request = {    
            user_id: customer.id
        };
        return this.nodePost<any>(Constants.GET_WALLET_BALANCE_API, request)
        .pipe(takeUntil(this.ngUnsubscribe));
    }

    public pairWallet(data: WalletPairingPostBodyInterface): Observable<any> {
        const customer: Customer = CustomUtils.getCurrentCustomer();
        const request = {
            user_id: customer.id,
            pass: data.pass,
            seed: data.seed,
            wallet: data.wallet
        }
        return this.nodePost<any>(Constants.WALLET_PAIR_API, request)
        .pipe(takeUntil(this.ngUnsubscribe));
    }

    public getPlayPackages(): Observable<any> {
        return this.nodeGet<any>(Constants.PLAY_PACKAGES_API)
        .pipe(takeUntil(this.ngUnsubscribe));
    }

    public getPlayPrice(): Observable<any> {
        return this.nodeGet<any>(Constants.PLAY_PRICE_API)
        .pipe(takeUntil(this.ngUnsubscribe));
    }

    public buyPlayPackage(postData: BuyPlayPackageInterface): Observable<any> {
        return this.nodePost<any>(Constants.BUY_PLAY_PACKAGES_API, postData)
        .pipe(takeUntil(this.ngUnsubscribe));
    }

    public connectWallet(postData: any) {
        return this.nodePost<any>(Constants.CONNECT_WALLET_API, postData)
        .pipe(takeUntil(this.ngUnsubscribe));
    }

    public disconnectWallet(userId: any) {
        return this.nodePost<any>(Constants.DISCONNECT_WALLET_API, {user_id: userId})
        .pipe(takeUntil(this.ngUnsubscribe));
    }

    public getUserWallet(userId: any) {
        return this.nodePost<any>(Constants.GET_USER_WALLET_API, {user_id: userId})
        .pipe(takeUntil(this.ngUnsubscribe));
    }

    public unsubscribe() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}