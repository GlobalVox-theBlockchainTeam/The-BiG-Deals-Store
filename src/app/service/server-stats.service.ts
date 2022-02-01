import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { GenericApiService } from './generic-api.service';
import { Constants } from '../helper/constants.helper';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServerStatsService extends GenericApiService {
  private ngUnsubscribe = new Subject();
  constructor(
    private httpClient: HttpClient
  ) { 
    super(httpClient);
  }

  public unsubscribe() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public getAuctionDetails(productId: any): Observable<any> {
    return this.nodeGet<any>(Constants.GET_AUCTION_DETAILS_API.replace(':productID', productId))
    .pipe(takeUntil(this.ngUnsubscribe));
  }

  public enableViableProduct(productId: any): Observable<any> {
    return this.nodeGet<any>(Constants.ENABLE_PRODUCT_VIABLE_API.replace(':productID', productId))
    .pipe(takeUntil(this.ngUnsubscribe));
  }

  public disableViableProduct(productId: any): Observable<any> {
    return this.nodeGet<any>(Constants.DISABLE_PRODUCT_VIABLE_API.replace(':productID', productId))
    .pipe(takeUntil(this.ngUnsubscribe));
  }

  public resetAuction(productId: any): Observable<any> {
    return this.nodeGet<any>(Constants.RESET_AUCTION_API.replace(':productID', productId))
    .pipe(takeUntil(this.ngUnsubscribe));
  }



}
