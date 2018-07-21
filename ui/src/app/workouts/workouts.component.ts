import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'wd-workouts',
    styleUrls: ['./workouts.component.scss'],
    template: `
        <div class="submenu">
            <a [routerLink]="['/workouts/all']">Přehled</a>
            <a [routerLink]="['/workouts/new']">Nový</a>
            <a [routerLink]="['/workouts/spinning']">Spinning</a>
        </div>
        <router-outlet></router-outlet>
    `
})

export class WorkoutsComponent implements OnInit {
    constructor() { }

    ngOnInit() { }
}
