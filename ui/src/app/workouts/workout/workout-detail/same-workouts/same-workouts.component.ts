import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { WorkoutService } from '../../../../core/workout/workout.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Workout } from '../../../../core/workout/workout.interface';

@Component({
    selector: 'wd-same-workouts',
    templateUrl: 'same-workouts.component.html',
    styleUrls: ['./same-workouts.component.scss']
})
export class SameWorkoutsComponent implements OnInit, OnDestroy {
    @Input()
    set workout(workout: Workout) {
        if (!!workout && !!workout.log && !!workout.log.id) {
            this.getSameWorkouts(workout.id);
        }
    }

    sameWorkouts = null;

    displayedColumns = [
        'name',
        'date',
        'duration',
        'distance',
        'energy',
        'avgHr',
        'avgSpeed',
        'avgCadence'
    ];

    private _onDestroy$ = new Subject();

    constructor(private _workout: WorkoutService) {}

    ngOnInit() {
    }

    ngOnDestroy() {
        this._onDestroy$.next();
    }

    getSameWorkouts(id) {
        this._workout
            .getSameWorkouts(id)
            .pipe(takeUntil(this._onDestroy$))
            .subscribe(val => {
                this.sameWorkouts = val;
            });
    }
}
