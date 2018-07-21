import { Component, OnInit, Input } from '@angular/core';
import { Workout } from '../../../../core/workout/workout.interface';

@Component({
    selector: 'wd-workout-list-item',
    templateUrl: 'workout-list-item.component.html',
    styleUrls: ['./workout-list-item.component.scss']
})

export class WorkoutListItemComponent implements OnInit {

    @Input() workout: Workout;

    constructor() { }

    ngOnInit() { }
}
