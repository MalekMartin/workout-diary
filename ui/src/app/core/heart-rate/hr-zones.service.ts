import { Injectable } from '@angular/core';

@Injectable()
export class HrZonesService {

    private _max = 184;

    zones = {
        endurance: {
            name: 'Základní vytrvalost (< 75%)',
            min: 0,
            max: 0,
        },
        stamina: {
            name: 'Tempová vytrvalost (75% - 85%)',
            min: 0,
            max: 0,
        },
        economy: {
            name: 'Speciální vytrvalost (85% - 95%)',
            min: 0,
            max: 0,
        },
        speed: {
            name: 'Rychlostní vytrvalost (> 95%)',
            min: 0,
            max: 0,
        }
    };

    constructor() {
        this.recalculate();
    }

    recalculate(max?: number) {
        if (!!max) { this._max = max; }

        this.zones.endurance.min = Math.round(this._max * 0.6);
        this.zones.endurance.max = Math.round(this._max * 0.75);

        this.zones.stamina.min = Math.round(this._max * 0.75) + 1;
        this.zones.stamina.max = Math.round(this._max * 0.85);

        this.zones.economy.min = Math.round(this._max * 0.85) + 1;
        this.zones.economy.max = Math.round(this._max * 0.95);

        this.zones.speed.min = Math.round(this._max * 0.95) + 1;
        this.zones.speed.max = Math.round(this._max);
    }
}
