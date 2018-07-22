import { Injectable } from '@angular/core';
import { RequestOptionsArgs, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class HttpService {
    constructor(private _http: HttpClient) {}

    post<IN, OUT>(url: string, body: IN): Observable<OUT> {
        return this._http.post(this.buildUrl(url), JSON.stringify(body), this.createHeaders).pipe(map(response => <OUT>response));
    }

    get<T>(url: string): Observable<T> {
        return this._http.get(this.buildUrl(url), this.createHeaders).pipe(
            map(response => {
                try {
                    return <T>response;
                } catch (error) {
                    console.warn('GET: Response JSON is broken!');
                    return <any>response;
                }
            })
        );
    }

    delete<T>(url: string): Observable<T> {
        return this._http.delete(this.buildUrl(url), this.createHeaders).pipe(map(response => <T>response));
    }

    saveFileAs(url: string) {
        return this._http.get(url, this.createHeaders).pipe(map(response => response));
    }

    get createHeaders() {
        const headers = { 'Content-Type': 'text/plain;charset=UTF-8' };
        return { headers: new HttpHeaders(headers) };
    }

    get createBlobHeaders(): RequestOptionsArgs {
        return { responseType: 3 };
    }

    private buildUrl(url: string) {
        if (url.startsWith('/')) {
            return url.substr(1);
        } else {
            return url;
        }
    }
}
