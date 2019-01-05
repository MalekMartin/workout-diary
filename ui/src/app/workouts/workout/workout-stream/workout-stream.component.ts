import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { WorkoutService } from '../../../core/workout/workout.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import { FormControl, FormBuilder } from '@angular/forms';
import { ActivitiesService } from '../../../core/activities/activities.service';
import { MatDialog } from '@angular/material';
import { WorkoutAddComponent } from '../workout-add/workout-add.component';

@Component({
    selector: 'wd-workout-stream',
    templateUrl: 'workout-stream.component.html',
    styleUrls: ['./workout-stream.component.scss']
})
export class WorkoutStreamComponent implements OnInit, OnDestroy {
    workouts;
    totalDuration = 0;
    totalDistance = 0;
    totalCalories = 0;
    types: any[];
    isLoading = false;
    range = null;

    form = this._fb.group({
        range: ['30_DAYS']
    });

    view = new FormControl(JSON.parse(localStorage.getItem('wd.workouts.view')) || 'list');

    private _onDestroy$ = new Subject();

    constructor(
        private _workouts: WorkoutService,
        private _cd: ChangeDetectorRef,
        private _activities: ActivitiesService,
        private _fb: FormBuilder,
        public dialog: MatDialog
    ) {}

    ngOnInit() {
        this._activities.activityStream.pipe(takeUntil(this._onDestroy$)).subscribe(a => {
            this.types = a;
        });

        this.findWorkouts()
            .pipe(takeUntil(this._onDestroy$))
            .subscribe(this._onWorkoutsSuccess);

        moment.locale('cz');
        moment.updateLocale('cz', {
            months: {
                format: [
                    'ledna',
                    'února',
                    'března',
                    'dubna',
                    'května',
                    'června',
                    'července',
                    'sprna',
                    'září',
                    'října',
                    'listopadu',
                    'prosince'
                ],
                standalone: [
                    'Leden',
                    'Únor',
                    'Březen',
                    'Duben',
                    'Květen',
                    'Červen',
                    'Červenec',
                    'Srpen',
                    'Září',
                    'Říjen',
                    'Listopad',
                    'Prosinec'
                ],
                isFormat: /D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?|MMMM?(\[[^\[\]]*\]|\s+)+D[oD]?/ // from 2.14.0
            }
        });

        this.form.valueChanges.pipe(takeUntil(this._onDestroy$)).subscribe(val => {
            this.range = val.range;
            this.findWorkouts()
                .pipe(takeUntil(this._onDestroy$))
                .subscribe(this._onWorkoutsSuccess);
        });

        this.view.valueChanges.pipe(takeUntil(this._onDestroy$)).subscribe(val => {
            localStorage.setItem('wd.workouts.view', JSON.stringify(val));
        });
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
                  from:
                      moment()
                          .subtract(30, 'day')
                          .set('hour', 0)
                          .set('minute', 0)
                          .format('YYYY-MM-DDTHH:mm:ss') + 'Z',
                  to: null
              };

        return this._workouts.workoutsByDateRange(range.from, range.to, types);
    }

    typesChanged() {
        this.findWorkouts()
            .pipe(takeUntil(this._onDestroy$))
            .subscribe(this._onWorkoutsSuccess);
    }

    addWorkout() {
        this.dialog.open(WorkoutAddComponent, {
            width: '500px'
        });
    }

    private _getTotalValues() {
        let duration = 0;
        let distance = 0;
        let calories = 0;
        for (let i = 0; i < this.workouts.length; i++) {
            duration += this.workouts[i].duration;
            distance += this.workouts[i].distance;
            calories += this.workouts[i].energy;
        }
        this.totalDuration = duration;
        this.totalDistance = distance;
        this.totalCalories = calories;
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

export type WorkoutListViewType = 'list' | 'table' | 'calendar';
