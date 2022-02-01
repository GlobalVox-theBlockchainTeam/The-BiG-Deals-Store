import { CurrencyPipe } from '@angular/common';
import { Constants } from './constants.helper';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { EncryptionService } from '../service/encryption.service';
import { Customer } from '../model/customer.model';
import { deserialize, serialize } from "class-transformer";

export class CustomUtils {
    public static priceFormat(price: number) :string {
        const currencyPipe = new CurrencyPipe(Constants.LOCALE_ID);
        return currencyPipe.transform(price) + '';
        // return Constants.CURRENCY_CODE_SIGN + price;
    }

    public static getAccessToken(): string {
        const encryptionService = new EncryptionService();
        return encryptionService.getSessionData(Constants.CUSTOMER_SESSION_TOKEN_KEY);
    }

    public static progressButtonOptions(): MatProgressButtonOptions {
        const buttonOptions: MatProgressButtonOptions = {
            active: false,
            text: 'Button',
            spinnerSize: 21,
            raised: true,
            stroked: true,
            flat: false,
            fab: false,
            buttonColor: 'primary',
            spinnerColor: 'warn',
            fullWidth: false,
            disabled: false,
            mode: 'indeterminate',
            customClass: '',
            // add an icon to the button
            // buttonIcon: {
            //     fontSet: 'fa',
            //     fontIcon: 'fa-heart',
            //     inline: true
            // }
        };
        return buttonOptions;
    }

    public static serializeClass(obj: any): string {
        return serialize(obj);
    }

    public static deserializeClass<T>(T:any , data: string): T {
        return deserialize(T, data);
    }

    public static isLoggedIn(): boolean {
        return this.getAccessToken() !== undefined;
    }

    public static clearLocalStorage(): void {
        return window.localStorage.clear();
    }

    public static getCurrentCustomer(): Customer {
        if (this.isLoggedIn()) {
            const encryptionService = new EncryptionService();
            const customerJson  = encryptionService.getSessionData(Constants.CUSTOMER_DATA_KEY);
            return this.deserializeClass<Customer>(Customer, customerJson);
        } else {
            return new Customer;
        }
    }

    public static secondToHourMinSec(secs: number) {
        var minutes = Math.floor(secs / 60);
        secs = secs%60;
        var hours = Math.floor(minutes/60)
        minutes = minutes%60;
        return `${hours < 10 ? '0'+hours : hours}:${minutes < 10 ? '0'+minutes : minutes}:${secs < 10 ? '0'+secs : secs}`;
    }
}