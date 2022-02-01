import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Constants } from '../helper/constants.helper';
import { CommonResponse } from '../model/common-response.model';
import { ProductDetails } from '../model/product-details.model';
import { Product } from '../model/product.model';
import { GenericApiService } from './generic-api.service'

@Injectable({providedIn: 'root'})
export class ProductService extends GenericApiService {

    private ngUnsubscribe = new Subject();
    pageSize: number = Constants.PAGE_SIZE;
    currentPage: number = Constants.CURRENT_PAGE;
    storeId: number = Constants.STORE_ID;
    currencyCode: string = Constants.CURRENCY_CODE;

    constructor(
        private httpClient: HttpClient
        ) { super(httpClient); }

    public getProductDetails(): Observable<ProductItemsResponse> {
        const productRequest = {    
            'searchCriteria[pageSize]': this.pageSize,
            'searchCriteria[currentPage]': this.currentPage,
            storeId: this.storeId,
            currencyCode: this.currencyCode
        };
        return this.get<ProductItemsResponse>(Constants.PRODUCT_LIST_API, productRequest)
        .pipe(takeUntil(this.ngUnsubscribe));
    }

    public getProductDetailsById(productSKU: string): Observable<ProductDetails> {
        // const productRequest = {    
        //     'searchCriteria[pageSize]': this.pageSize,
        //     'searchCriteria[currentPage]': this.currentPage,
        //     storeId: this.storeId,
        //     currencyCode: this.currencyCode
        // };
        // const productRequest = {    
        //     'searchCriteria[filterGroups][0][filters][0][field]': 'entity_id',
        //     'searchCriteria[filterGroups][0][filters][0][value]': productSKU,
        //     'searchCriteria[filterGroups][0][filters][0][condition_type]': 'eq'
        // };
        return this.get<ProductDetails>(Constants.PRODUCT_DETAIL_API.replace(':sku', productSKU))
        .pipe(takeUntil(this.ngUnsubscribe));
    }

    public unsubscribe() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}

export class ProductItemsResponse {
    items!: Product[]
}