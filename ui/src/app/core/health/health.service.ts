import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { Illness } from './health.interface';

@Injectable()
export class HealthService {

    constructor(private _http: HttpService) { }

    insertIllness(model: Illness) {
        return this._http.post('/resource/health/illness/add', model);
    }

    updateIllness(model: Illness) {
        return this._http.post(`/resource/health/illness/${model.id}/edit`, model);
    }

    getIllnessByDate(from: string, to: string) {
        return this._http.post('/resource/health/illness/by-date-range', {
            from,
            to
        });
    }

    deleteIllness(id: string) {
        return this._http.delete(`/resource/health/illness/${id}/delete`);
    }
}
