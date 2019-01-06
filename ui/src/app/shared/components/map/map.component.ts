import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'wd-map',
    templateUrl: 'map.component.html',
    styleUrls: ['./map.component.scss']
})

export class MapComponent {

    zoom = 11;

    @Input() coordinates: any;
    @Input() lat: number;
    @Input() lon: number;
    @Input() loading = false;
}
