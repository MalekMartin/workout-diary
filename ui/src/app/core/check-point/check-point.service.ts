import { Injectable } from '@angular/core';
import { CheckPoint } from './check-point.interface';
import { HttpService } from '../http.service';

@Injectable()
export class CheckPointService {

    constructor(
        private _http: HttpService
    ) { }

    newCheckpoint(model: CheckPoint) {
        return this._http
            .post('/resource/check-points/add', model);
    }

    getAllCheckPoints() {
        return this._http
            .get('/resource/check-points/all');
    }

    deleteCheckPoint(id: string) {
        return this._http
            .delete('/resource/check-points/' + id + '/delete');
    }
}
