import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { HeartRate } from './hr.interface';

@Injectable()
export class HeartRateService {

    constructor(private _http: HttpService) { }

    addRestingHr(model: {bpm: number, date: string, note: string, activity: string}) {
        return this._http
            .post('/resource/heart/rest/add', model);
    }

    findRestingHrs() {
        return this._http
            .get('/resource/heart/rest/30');
    }

    findWeeklyAverages() {
        return this._http
            .get('/resource/heart/rest/weekly-avg');
    }

    deleteHRrecord(id: string) {
        return this._http
            .delete(`/resource/heart/rest/${id}/delete`);
    }

    updateHRRecord(value: HeartRate) {
        return this._http
            .post('/resource/heart/rest/update', value);
    }
}
