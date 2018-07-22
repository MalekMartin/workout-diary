import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { WorkoutService } from '../../../core/workout/workout.service';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, switchMap } from 'rxjs/operators';
import * as moment from 'moment';
import { FormControl } from '@angular/forms';
import { ActivitiesService } from '../../../core/activities/activities.service';

@Component({
    selector: 'wd-workout-list',
    templateUrl: 'workout-list.component.html',
    styleUrls: ['./workout-list.component.scss']
})
export class WorkoutListComponent implements OnInit, OnDestroy {
    workouts;
    totalDuration = 0;
    totalDistance = 0;
    types: any[];

    isLoading = false;

    view: 'calendar' | 'list' = 'list';
    range = null;

    private _onDestroy$ = new Subject();

    constructor(private _workouts: WorkoutService, private _cd: ChangeDetectorRef, private _activities: ActivitiesService) {}

    ngOnInit() {
        this._activities.activityStream.pipe(takeUntil(this._onDestroy$)).subscribe(a => {
            this.types = a;
        });

        this.findWorkouts()
            .pipe(takeUntil(this._onDestroy$))
            .subscribe(this._onWorkoutsSuccess);
    }

    ngOnDestroy() {
        this._onDestroy$.next();
    }

    trackByFn = (item, i) => item.id;

    findWorkouts() {
        const types = this._typesFromLocalStorage();
        this.isLoading = true;
        const range = !!this.range
            ? this.range
            : {
                from: moment().subtract(30, 'day')
                    .set('hour', 1)
                    .set('minute', 0)
                    .format('YYYY-MM-DDThh:mm:ss') + 'Z',
                to: moment()
                    .format('YYYY-MM-DDThh:mm:ss') + 'Z'
            };

        return this._workouts.workoutsByDateRange(
            range.from,
            range.to,
            types
        );
    }

    typesChanged() {
        this.findWorkouts()
            .pipe(takeUntil(this._onDestroy$))
            .subscribe(this._onWorkoutsSuccess);
    }

    rangeChanged(val) {
        this.range = val;
        this.findWorkouts()
            .pipe(takeUntil(this._onDestroy$))
            .subscribe(this._onWorkoutsSuccess);
    }

    toggleView(value: 'calendar' | 'list') {
        this.view = value;
    }

    private _getTotalValues() {
        let duration = 0;
        let distance = 0;
        for (let i = 0; i < this.workouts.length; i++) {
            duration += this.workouts[i].duration;
            distance += this.workouts[i].distance;
        }
        this.totalDuration = duration;
        this.totalDistance = distance;
    }

    private _typesFromLocalStorage() {
        const types = localStorage.getItem('wd.filter.types');
        return !!types ? JSON.parse(types) : [];
    }

    private _onWorkoutsSuccess = w => {
        this.workouts = w;
        this._getTotalValues();
        this.isLoading = false;
        this._cd.markForCheck();
    }
}
