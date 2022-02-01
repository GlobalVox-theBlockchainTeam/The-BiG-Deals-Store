import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Constants } from '../helper/constants.helper';
import { AddressPostInterface } from '../interface/address-post.interface';
import { Country } from '../model/address.model';
import { GenericApiService } from './generic-api.service'

@Injectable({providedIn: 'root'})
export class AddressService extends GenericApiService {

    private ngUnsubscribe = new Subject();

    constructor(
        private httpClient: HttpClient
        ) { super(httpClient); }

    public getCountries(): Observable<Country[]> {
        return this.get<Country[]>(Constants.GET_COUNTRIES_API)
        .pipe(takeUntil(this.ngUnsubscribe));
    }

    public getRegionsByCountry(countryID: string): Observable<Country> {
        return this.get<Country>(Constants.GET_REGIONS_API.replace(':countryID', countryID))
        .pipe(takeUntil(this.ngUnsubscribe));
    }

    public saveCustomerAddress(address: AddressPostInterface): Observable<any> {
        return this.post<any>(Constants.SAVE_ADDRESS_API, address)
        .pipe(takeUntil(this.ngUnsubscribe));
    }

    public unsubscribe() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}