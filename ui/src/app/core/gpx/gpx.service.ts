import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';

@Injectable()
export class GpxService {

    constructor(private _http: HttpService) { }

    saveCoordinates(model: GpxCoordinates) {
        return this._http.post('/resource/gpx/coordinates/add', model);
    }

    findCoordinates() {
        return this._http.get('/resource/gpx/coordinates/all');
    }
}

export interface GpxCoordinates {
    id?: string;
    name: string;
    lat: number;
    lon: number;
    ele: number;
}
