import { Component, OnInit } from '@angular/core';
import { HrZonesService } from '../../core/heart-rate/hr-zones.service';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'wd-hr-zones',
    templateUrl: 'hr-zones.component.html',
    styleUrls: ['./hr-zones.component.scss']
})

export class HrZonesComponent implements OnInit {

    maxHr = new FormControl(this._zones.hrMax);

    zones = this._zones.zones;

    constructor(
        private _zones: HrZonesService,
    ) { }

    ngOnInit() { }

    save() {
        this._zones.updateHrMax(this.maxHr.value);
    }
}
