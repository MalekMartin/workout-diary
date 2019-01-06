import { Injectable } from '@angular/core';

@Injectable()
export class HrZonesService {

    private _max: number;

    zones = [];

    constructor() {
        this._max = Number(this._getHrMaxFromLocalStorage()) || 190;
        this.recalculate();
    }
    get hrMax() {
        return this._max;
    }

    recalculate(max?: number) {
        let startHr = 60;
        do {
            this.zones.push({
                name: startHr + '% - ' + (startHr + 5) + '%',
                min: this._max * (startHr / 100),
                max: this._max * ((startHr + 5) / 100)
            });
            startHr += 5;
        }
        while (startHr < 100);
        this.zones.reverse();
    }

    updateHrMax(max: number) {
        this._max = max;
        localStorage.setItem('wd.hr.max', max.toString());
    }

    private _getHrMaxFromLocalStorage() {
        return JSON.parse(localStorage.getItem('wd.hr.max'));
    }
}
