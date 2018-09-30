import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';

@Injectable()
export class HeartRateService {

    constructor(private _http: HttpService) { }

    addRestingHr(model: {bpm: number, date: string, note: string, activity: string}) {
        return this._http
            .post('/resource/heart/rest/add', model);
    }

    findRestingHrs() {
        return this._http
            .get('/resource/heart/rest/all');
    }

    findWeeklyAverages() {
        return this._http
            .get('/resource/heart/rest/weekly-avg');
    }
}
