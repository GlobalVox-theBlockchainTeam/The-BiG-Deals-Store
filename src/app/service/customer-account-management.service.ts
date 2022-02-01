import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PubsubService } from '@fsms/angular-pubsub';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Constants } from '../helper/constants.helper';
import { CustomUtils } from '../helper/custom-utils.helper';
import { CustomerTokenPostBody } from '../interface/customer-token-post-body.interface';
import { CustomerCreate } from '../model/customer-create.model';
import { Customer } from '../model/customer.model';
import { CustomerLoginMessage } from '../pub_sub/customer-login-message';
import { EncryptionService } from './encryption.service';
import { GenericApiService } from './generic-api.service';

@Injectable({providedIn: 'root'})
export class CustomerAccountManagementService extends GenericApiService {

    private ngUnsubscribe = new Subject();

    constructor(
        private httpClient: HttpClient,
        private encryptionService: EncryptionService,
        private pubsubService: PubsubService
        ) { super(httpClient); }

    public createCustomer(customerRequest: CustomerCreate): Observable<Customer> {
        return this.post<Customer>(Constants.CUSTOMER_CREATE_API, customerRequest)
        .pipe(takeUntil(this.ngUnsubscribe));
    }

    public getCustomer(): Observable<Customer> {
        return this.get<Customer>(Constants.CUSTOMER_DETAILS_API)
        .pipe(takeUntil(this.ngUnsubscribe));
    }

    public getCustomerToken(customerTokenPostBody: CustomerTokenPostBody): Observable<string> {
        return this.post<string>(Constants.CUSTOMER_GET_TOKEN_API, customerTokenPostBody).pipe(takeUntil(this.ngUnsubscribe));
    }

    public setCustomerToken(token: string): void {
        this.encryptionService.setSessionData(Constants.CUSTOMER_SESSION_TOKEN_KEY, token);
        this.setCustomer();
    }

    public setCustomer() {
        if (this.isLoggedIn()) {
            this.getCustomer().subscribe((customer: Customer) => {
                this.pubsubService.publish(
                    new CustomerLoginMessage({
                      customer: customer
                    })
                  );
                this.encryptionService.setSessionData(Constants.CUSTOMER_DATA_KEY, CustomUtils.serializeClass(customer));
            });
        }
    }

    public isLoggedIn(): boolean {
        return CustomUtils.isLoggedIn();
    }

    public unsubscribe() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}