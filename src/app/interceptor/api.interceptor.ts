import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Constants } from '../helper/constants.helper';
import { CustomUtils } from '../helper/custom-utils.helper';
import { Msg } from '../helper/msg.helper';
import { EncryptionService } from '../service/encryption.service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

    constructor(private encryptionService: EncryptionService, private msg: Msg) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const accessToken = CustomUtils.getAccessToken();

        let headers: any = {
            'Content-Type': 'application/json'
        };
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
            headers['Accept-Language'] = `en`;
        }
        req = req.clone({ setHeaders: headers });

        return next.handle(req).pipe(tap(() => { },
      (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status !== 401 && err.status !== 403) {
            return;
          }
          if (err.error.message) {
            this.msg.showMessage(err.error.message);
          }
        }
        CustomUtils.clearLocalStorage();
      }));
    }    
}