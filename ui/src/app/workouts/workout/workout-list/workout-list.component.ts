import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { WorkoutService } from '../../../core/workout/workout.service';
import { Subject } from 'rxjs/Subject';
import { takeUntil, debounceTime, switchMap } from 'rxjs/operators';
import * as moment from 'moment';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'wd-workout-list',
    templateUrl: 'workout-list.component.html',
    styleUrls: ['./workout-list.component.scss']
})

export class WorkoutListComponent implements OnInit, OnDestroy {

    workouts;
    fromDate = moment().subtract(30, 'days').format('YYYY-MM-DDThh:mm:ss') + 'Z';
    totalDuration = 0;
    totalDistance = 0;
    types: any[];

    isLoading = false;

    view: 'calendar' | 'list' = 'list';

    ranges = [
        {id: 1, name: 'Posledních 30 dní', value: {from: this.fromDate, to: null}},
        {id: 2, name: 'Tento měsíc', value: {
            from: moment().set('date', 1).format('YYYY-MM-DDThh:mm:ss') + 'Z',
            to: moment().set('date', moment().daysInMonth()).format('YYYY-MM-DDThh:mm:ss') + 'Z'
        }},
        {id: 3, name: 'Tento rok', value: {
            from: moment().set('date', 1).set('month', 1).format('YYYY-MM-DDThh:mm:ss') + 'Z',
            to: moment().set('date', 31).set('month', 12).format('YYYY-MM-DDThh:mm:ss') + 'Z'}},
        {id: 4, name: 'Vše', value: {from: null, to: null}}
    ];

    range = new FormControl(this.ranges[0].id);

    private _onDestroy$ = new Subject();

    constructor(private _workouts: WorkoutService,
                private _cd: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.types = this._workouts.activities;

        this.findWorkouts()
            .pipe(takeUntil(this._onDestroy$))
            .subscribe(this._onWorkoutsSuccess);

        this.range.valueChanges
            .pipe(takeUntil(this._onDestroy$))
            .pipe(
                debounceTime(300),
                switchMap(value => this.findWorkouts()),
                takeUntil(this._onDestroy$),
            )
            .subscribe(this._onWorkoutsSuccess);
    }

    ngOnDestroy() {
        this._onDestroy$.next();
    }

    trackByFn = (item, i) => item.id;

    findWorkouts() {
        const types = this._typesFromLocalStorage();
        const range = this.range.value;
        this.isLoading = true;
        const r = this.ranges.find(item => item.id === range);
        return this._workouts.workoutsByDateRange(r.value.from, r.value.to, types);
    }

    typesChanged() {
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
        return !!types
            ? JSON.parse(types)
            : [];
    }

    private _onWorkoutsSuccess = w => {
        this.workouts = w;
        this._getTotalValues();
        this.isLoading = false;
        this._cd.markForCheck();
    }
}
