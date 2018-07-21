import { Component, OnInit } from '@angular/core';
import { HrZonesService } from '../../core/heart-rate/hr-zones.service';

@Component({
    selector: 'wd-hr-zones',
    templateUrl: 'hr-zones.component.html',
    styleUrls: ['./hr-zones.component.scss']
})

export class HrZonesComponent implements OnInit {

    zones = this._zones.zones;

    constructor(private _zones: HrZonesService) { }

    ngOnInit() { }
}
