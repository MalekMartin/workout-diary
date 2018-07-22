import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkoutService } from '../../../core/workout/workout.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Workout } from '../../../core/workout/workout.interface';

@Component({
    selector: 'wd-workout-edit',
    templateUrl: 'workout-edit.component.html',
    styleUrls: ['./workout-edit.component.scss']
})

export class WorkoutEditComponent implements OnInit, OnDestroy {

    workoutId = this._route.snapshot.params['id'];
    workout: Workout;

    private _onDestroy$ = new Subject();

    constructor(
        private _route: ActivatedRoute,
        private _workoutService: WorkoutService,
        private _router: Router,
    ) { }

    ngOnInit() {
        this._workoutService
            .findOneById(this.workoutId)
            .pipe(takeUntil(this._onDestroy$))
            .subscribe(this._onWorkoutSuccess);
    }

    ngOnDestroy() {
        this._onDestroy$.next();
    }

    save(value: any) {
        this._workoutService.updateWorkout(this.workoutId, value)
            .pipe(takeUntil(this._onDestroy$))
            .subscribe(this._onWorkoutUpdateSuccess, this._onWorkoutUpdateError);
    }

    private _onWorkoutSuccess = (workout: Workout) => {
        this.workout = workout;
    }

    private _onWorkoutUpdateSuccess = (workout: Workout) => {
        this._router.navigate(['workouts', this.workoutId]);
    }

    private _onWorkoutUpdateError = (workout: Workout) => {

    }
}
