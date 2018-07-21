import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

@Injectable()
export class HttpService {

    constructor(private _http: Http) { }

    post<IN, OUT>(url: string, body: IN): Observable<OUT> {
        return this._http
            .post(this.buildUrl(url), JSON.stringify(body), this.createHeaders)
            .pipe(
                map((response) => <OUT>response.json())
            );
    }

    get<T>(url: string): Observable<T> {
        return this._http
            .get(this.buildUrl(url), this.createHeaders)
            .pipe(
                map((response) => {
                    try {
                        return <T>response.json();
                    } catch (error) {
                        console.warn('GET: Response JSON is broken!');
                        return <any>response;
                    }
                })
            );
    }

    delete<T>(url: string): Observable<T> {
        return this._http
            .delete(this.buildUrl(url), this.createHeaders)
            .pipe(
                map((response) => <T>response.json())
            );
    }

    saveFileAs(url: string) {
        return this._http.get(url, this.createHeaders)
        .pipe(
            map((response) => response.text())
        );
    }

    get createHeaders(): RequestOptionsArgs {
        const headers = new Headers();
        headers.append('Content-Type', 'text/plain;charset=UTF-8');
        return {headers: headers};
    }

    get createBlobHeaders(): RequestOptionsArgs {
        return {responseType: 3};
    }

    private buildUrl(url: string) {
        if (url.startsWith('/')) {
            return url.substr(1);
        } else {
            return url;
        }
    }
}
