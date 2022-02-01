import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
    providedIn: 'root'
})
export class EncryptionService {

    encryptionKey = 'LycKoRiga7aFTiolQSAaJWwiZW8';

    constructor() { }

    public encryptData(data: any): any {
        try {
          return CryptoJS.AES.encrypt(data, this.encryptionKey).toString();
        } catch (e) {
          console.log(e);
        }
      }
    
      public decryptData(data: any): any {
        try {
          const bytes = CryptoJS.AES.decrypt(data, this.encryptionKey);
          return  bytes.toString(CryptoJS.enc.Utf8);
        } catch (e) {
          // console.log(e);
        }
      }

      public setSessionData(dataKey: string, dataValue: any): void {
        window.localStorage.setItem(dataKey, this.encryptData(dataValue));
      }

      public getSessionData(dataKey: string): any {
        return this.decryptData(window.localStorage.getItem(dataKey));
      }
}