import { Component, OnInit, OnDestroy } from '@angular/core';
import { WorkoutService } from '../../../core/workout/workout.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Workout, WorkoutLogFile, TrackPoints, Activity } from '../../../core/workout/workout.interface';
import { takeUntil, map } from 'rxjs/operators';
import { Subject ,  forkJoin } from 'rxjs';
import { CheckPointService } from '../../../core/check-point/check-point.service';
import * as moment from 'moment';
import { ActivitiesService } from '../../../core/activities/activities.service';

declare var require: any;
const FileSaver = require('file-saver');

@Component({
    selector: 'wd-workout-detail',
    templateUrl: 'workout-detail.component.html',
    styleUrls: ['./workout-detail.component.scss']
})
export class WorkoutDetailComponent implements OnInit, OnDestroy {
    id: string;
    workout: Workout;
    downoading = false;
    cadenceUnits: string;
    route: TrackPoints;

    next: string;
    prev: string;

    workoutRoute: any;

    checkPointsLoading = false;

    private _onDestroy$ = new Subject();

    constructor(
        private _workout: WorkoutService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _activity: ActivitiesService
    ) {}

    ngOnInit() {
        this._route.params.pipe(takeUntil(this._onDestroy$)).subscribe(p => {
            this.id = p['id'];
            this.findWorkout();
            this.getCoordinates();
        });
    }

    ngOnDestroy() {
        this._onDestroy$.next();
    }

    findWorkout() {
        this._workout
            .findOneById(this.id)
            .pipe(takeUntil(this._onDestroy$))
            .subscribe((w: Workout) => {
                this.workout = w;

                const a = w.activity.id;
                this.cadenceUnits = a === '1' || a === '5' ? 'spm' : a === '2' || a === '3' ? 'rpm' : null;
                this.id = w.id;

                this.onCheckPointsChanged();
                this.findNextAndPrev();
            }, this._onFindWorkoutError);
    }

    findNextAndPrev() {
        this._workout
            .findNextAndPrev(this.workout.id, this.workout.date, this._workout.getTypesFromLocalStorage())
            .pipe(takeUntil(this._onDestroy$))
            .subscribe((val: any) => {
                this.next = val.next;
                this.prev = val.prev;
            });
    }

    goToEdit() {
        this._router.navigate(['/workouts', this.workout.id, 'edit']);
    }

    delete(id: string) {
        this._workout.deleteWorkout(id).subscribe(() => {
            this._router.navigate(['workouts/all']);
        });
    }

    deleteFileLog() {
        this._workout.deleteWorkoutFileLog(this.workout.log.id).subscribe(() => {
            this.workout.log.id = null;
        });
    }

    uploaded(file: WorkoutLogFile) {
        this.findWorkout();
    }

    export($event: MouseEvent) {
        if (!this.downoading) {
            this.downoading = true;
            this._workout.getLogFile(this.id).subscribe(
                blob => {
                    const file = new Blob([blob], { type: this.workout.log.type });
                    FileSaver.saveAs(file, this.workout.log.name);
                    this.downoading = false;
                },
                () => {
                    console.warn('Nepodařilo se stáhnout soubor!');
                    this.downoading = false;
                }
            );
        }
    }

    onCheckPointsChanged() {
        this.checkPointsLoading = true;
        this._workout
            .getRouteCheckPoints(this.id)
            .pipe(takeUntil(this._onDestroy$))
            .subscribe(
                (route: any) => {
                    this.workoutRoute = route;
                    this.checkPointsLoading = false;
                },
                () => {
                    this.checkPointsLoading = false;
                }
            );
    }

    deleteCheckPoint(id: string) {
        this._workout.deleteCheckPoint(this.id, id).subscribe(this._onDeleteCpSuccess, this._onDeleteCpError);
    }

    getCoordinates() {
        this._workout
            .getRouteCoordinates(this.id)
            .pipe(takeUntil(this._onDestroy$))
            .subscribe((data: TrackPoints) => {
                this.route = data;
            });
    }

    convertWorkoutToGpx() {
        this._workout
            .convertWorkoutCsvToGpx(this.workout.id)
            .pipe(takeUntil(this._onDestroy$))
            .subscribe(
                blob => {
                    const file = new Blob([blob]);
                    FileSaver.saveAs(file, this.workout.log.name.replace('.csv', '.gpx'));
                    this.downoading = false;
                },
                () => {
                    console.warn('Nepodařilo se stáhnout soubor!');
                    this.downoading = false;
                }
            );
    }

    private _onDeleteCpSuccess = () => {
        this.onCheckPointsChanged();
    }

    private _onDeleteCpError = () => {};

    private _onFindWorkoutError = (e: any) => {
        if (e.status === 404) {
            this._router.navigate(['/workouts/not-found']);
        } else {
            this._router.navigate(['/workouts/all']);
        }
    }
}
