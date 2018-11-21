import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'wd-top-menu',
    styleUrls: ['./top-menu.component.scss'],
    template: `
    <ul class="menu">
        <li>
            <a [routerLink]="['/workouts/all']" routerLinkActive="active">Workouts</a>
        </li>
        <li>
            <a [routerLink]="['/gpx']" routerLinkActive="active">Gpx</a>
        </li>
        <li>
            <a [routerLink]="['/heart/resting']" routerLinkActive="active">Heart</a>
        </li>
        <li>
            <a [routerLink]="['/checkpoints']" routerLinkActive="active">Check Points</a>
        </li>
        <li>
            <a [routerLink]="['/gear']" routerLinkActive="active">Vybavení</a>
        </li>
        <li>
            <a [routerLink]="['/health']" routerLinkActive="active">Zdraví</a>
        </li>
    </ul>
    `
})

export class TopMenuComponent implements OnInit {
    constructor() { }

    ngOnInit() { }
}
