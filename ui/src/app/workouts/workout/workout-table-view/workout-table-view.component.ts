import { Component, OnInit, Input } from '@angular/core';
import { Workout } from '../../../core/workout/workout.interface';

@Component({
    selector: 'wd-workout-table-view',
    templateUrl: 'workout-table-view.component.html',
    styleUrls: ['./workout-table-view.component.scss']
})
export class WorkoutTableViewComponent implements OnInit {

    @Input() workouts: Workout[];

    displayedColumns = [
        'date',
        'name',
        'duration',
        'distance',
        'energy',
        'hr',
        'speed',
        'cadence'
    ];

    constructor() {}

    ngOnInit() {
    }
}
