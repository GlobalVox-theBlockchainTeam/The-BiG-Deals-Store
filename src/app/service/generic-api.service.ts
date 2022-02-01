import { Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpEvent, HttpHeaders, HttpParams } from '@angular/common/http';
import { Constants } from '../helper/constants.helper';
import { Observable } from 'rxjs';
import { CommonResponse } from '../model/common-response.model';

@Injectable()
export class GenericApiService {

    apiUrl: string = Constants.API_SERVER + Constants.API_PREFIX;
    nodeApiUrl: string = Constants.SOCKET_SERVER;
    options = { 
        headers: new HttpHeaders().set('Accept', 'application/json')
    };

    constructor(private http: HttpClient) {}

    public get<T>(url: string, params: any = null): Observable<T> {
        const options: GetRequestOptions = new GetRequestOptions();
        options.headers = this.options.headers;
        options.params = params;
        return this.http.get<T>(this.apiUrl + url, options);
    } 
        
    public post<T>(url: string, data: any): Observable<T> { 
        return this.http.post<T>(this.apiUrl + url, data, this.options); 
    } 

    public put<T>(url: string, data: any): Observable<CommonResponse<T>> { 
        return this.http.put<CommonResponse<T>>(this.apiUrl + url, data, this.options); 
    }

    public delete<T>(url: string): Observable<CommonResponse<T>> { 
        return this.http.delete<CommonResponse<T>>(this.apiUrl + url, this.options); 
    } 

    public nodePost<T>(url: string, data: any): Observable<T> { 
        return this.http.post<T>(this.nodeApiUrl + url, data, this.options); 
    } 

    public nodeGet<T>(url: string, params: any = null): Observable<T> {
        const options: GetRequestOptions = new GetRequestOptions();
        options.headers = this.options.headers;
        options.params = params;
        return this.http.get<T>(this.nodeApiUrl + url, options);
    } 
}

class GetRequestOptions {
    headers?: HttpHeaders | {
        [header: string]: string | string[];
    };
    context?: HttpContext;
    observe?: 'body';
    params?: HttpParams | {
        [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
    };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
}