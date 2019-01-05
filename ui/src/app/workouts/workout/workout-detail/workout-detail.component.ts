import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TrackPoints, Workout, WorkoutLogFile } from '../../../core/workout/workout.interface';
import { WorkoutService } from '../../../core/workout/workout.service';
import { HrZonesService } from '../../../core/heart-rate/hr-zones.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { WorkoutEditComponent } from '../workout-edit/workout-edit.component';

declare var require: any;
const FileSaver = require('file-saver');

@Component({
    selector: 'wd-workout-detail',
    templateUrl: 'workout-detail.component.html',
    styleUrls: ['./workout-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkoutDetailComponent implements OnInit, OnDestroy {
    id: string;
    workout: Workout;
    downoading = false;
    route: TrackPoints;

    next: string;
    prev: string;
    hrAnalyzed: any;

    workoutRoute: any;

    checkPointsLoading = false;
    loading = false;
    loadingCoords = false;

    sameWorkouts = null;

    private _onDestroy$ = new Subject();

    constructor(
        private _workout: WorkoutService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _cd: ChangeDetectorRef,
        private _zones: HrZonesService,
        private _snackBar: MatSnackBar,
        private _dialog: MatDialog
    ) {}

    ngOnInit() {
        this._route.params.pipe(takeUntil(this._onDestroy$)).subscribe(p => {
            this.id = p['id'];
            this.findWorkout();
        });
    }

    ngOnDestroy() {
        this._onDestroy$.next();
    }

    findWorkout() {
        this.loading = true;
        this._workout
            .findOneById(this.id)
            .pipe(takeUntil(this._onDestroy$))
            .subscribe((w: Workout) => {
                this.workout = w;

                const a = w.activity.id;
                this.id = w.id;

                if (!!w.log && !!w.log.id) {
                    this.onCheckPointsChanged();
                    this.analyzeHr(w.id);
                    this.getCoordinates();
                } else {
                    this.route = null;
                }
                this.findNextAndPrev();

                this.loading = false;
                this._cd.markForCheck();
            }, this._onFindWorkoutError);
    }

    findNextAndPrev() {
        this._workout
            .findNextAndPrev(this.workout.id, this.workout.date, this._workout.getTypesFromLocalStorage())
            .pipe(takeUntil(this._onDestroy$))
            .subscribe((val: any) => {
                this.next = val.next;
                this.prev = val.prev;
                this._cd.markForCheck();
            });
    }

    goToEdit() {
        this._dialog
            .open(WorkoutEditComponent, {
                width: '500px',
                data: this.workout
            })
            .afterClosed()
            .pipe(takeUntil(this._onDestroy$))
            .subscribe(res => {
                if (!!res) {
                    this.workout = res;
                    this.findWorkout();
                }
            });
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
                    this._cd.markForCheck();
                },
                () => {
                    this.checkPointsLoading = false;
                    this._cd.markForCheck();
                }
            );
    }

    deleteCheckPoint(id: string) {
        this._workout.deleteCheckPoint(this.id, id).subscribe(this._onDeleteCpSuccess, this._onDeleteCpError);
    }

    getCoordinates() {
        this.loadingCoords = true;
        this._workout
            .getRouteCoordinates(this.id)
            .pipe(takeUntil(this._onDestroy$))
            .subscribe((data: TrackPoints) => {
                this.route = data;
                this.loadingCoords = false;
                this._cd.markForCheck();
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

    analyzeHr(workoutId: string) {
        this._workout
            .analyzeHr(workoutId, this._zones.hrMax)
            .pipe(takeUntil(this._onDestroy$))
            .subscribe((val: any) => {
                this.hrAnalyzed = val;
                this._cd.markForCheck();
            });
    }

    findSame() {
        this._workout
            .findSameRoutes(this.workout)
            .pipe(takeUntil(this._onDestroy$))
            .subscribe((res: any[]) => {
                if (!!res && !!res.length) {
                    this.openSnackBar('Nalezeno ' + res.length + ' tréninků', '');
                } else {
                    this.openSnackBar('Nalezeno 0 tréninků', '');
                }
            });
    }

    openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, {
            duration: 2000
        });
    }

    private _onDeleteCpSuccess = () => {
        this.onCheckPointsChanged();
    }

    private _onDeleteCpError = () => {
        this._cd.markForCheck();
    }

    private _onFindWorkoutError = (e: any) => {
        this.loading = false;
        this._cd.markForCheck();
        if (e.status === 404) {
            this._router.navigate(['/workouts/not-found']);
        } else {
            this._router.navigate(['/workouts/all']);
        }
    }
}
