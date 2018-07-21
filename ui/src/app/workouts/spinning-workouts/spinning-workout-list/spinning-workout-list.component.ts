import { Component, OnInit } from '@angular/core';
import { SpinningWorkoutService } from '../../../core/spinning-workout/spinning-workout.service';
import { SpinningWorkout } from '../../../core/spinning-workout/spinning-workout.interface';

@Component({
    selector: 'wd-spinning-workout-list',
    templateUrl: 'spinning-workout-list.component.html',
    styleUrls: ['./spinning-workout-list.component.scss']
})

export class SpinningWorkoutListComponent implements OnInit {

    workouts: SpinningWorkout[];

    constructor(private _spinningService: SpinningWorkoutService) { }

    ngOnInit() {
        this.workouts = this._spinningService.getAllWorkouts();
    }
}
