import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { Gear } from './gear.interface';
import { Observable } from 'rxjs';

@Injectable()
export class GearService {

    constructor(private _http: HttpService) { }

    getGears(): Observable<Gear[]> {
        return this._http
            .get('/resource/gear/all');
    }

    addGear(model) {
        return this._http
            .post('/resource/gear/add', model);
    }

    deleteGear(id: string) {
        return this._http
            .delete(`/resource/gear/${id}/delete`);
    }

    updateGear(gear: Gear) {
        return this._http
            .post(`/resource/gear/${gear.id}/update`, gear);
    }
}
