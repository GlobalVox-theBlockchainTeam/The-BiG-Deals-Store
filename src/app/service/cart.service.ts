import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Constants } from '../helper/constants.helper';
import { Country, CountryRegion } from '../model/address.model';
import { CartItems } from '../model/cart-items.model';
import { CartItemInterface } from './../interface/cart-item.interface';
import { OrderPlacedInterface } from './../interface/order-placed-interface';
import { GenericApiService } from './generic-api.service'

@Injectable({ providedIn: 'root' })
export class CartService extends GenericApiService {

    private ngUnsubscribe = new Subject();

    constructor(
        private httpClient: HttpClient
    ) { super(httpClient); }

    public getCartQuote(): Observable<number> {
        return this.post<number>(Constants.CART_QUOTE_API, {})
            .pipe(takeUntil(this.ngUnsubscribe));
    }

    public getCartItems(): Observable<CartItems[]> {
        // this.getCartQuote().subscribe(res => {});
        return this.get<CartItems[]>(Constants.CART_DETAILS_API)
            .pipe(takeUntil(this.ngUnsubscribe));
    }

    public getCountries(): Observable<Country[]> {
        return this.get<Country[]>(Constants.GET_COUNTRIES_API)
            .pipe(takeUntil(this.ngUnsubscribe));
    }

    public getRegionsByCountry(countryID: string): Observable<Country> {
        return this.get<Country>(Constants.GET_REGIONS_API.replace('::countryID', countryID))
            .pipe(takeUntil(this.ngUnsubscribe));
    }

    public addToCart(cartItem: CartItemInterface): Observable<any> {
        return this.post<any>(Constants.CART_ADD_API, cartItem)
            .pipe(takeUntil(this.ngUnsubscribe));
    }

    public orderPlaced(order: OrderPlacedInterface): Observable<any> {
        return this.post<any>(Constants.ORDER_PLACED_API, order)
            .pipe(takeUntil(this.ngUnsubscribe));
    }

    public unsubscribe() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}