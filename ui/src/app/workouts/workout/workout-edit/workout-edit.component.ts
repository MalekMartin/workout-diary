import { Component, OnInit, OnDestroy, ViewChild, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkoutService } from '../../../core/workout/workout.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Workout } from '../../../core/workout/workout.interface';
import { WorkoutFormComponent } from '../workout-form/workout-form.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';

@Component({
    selector: 'wd-workout-edit',
    templateUrl: 'workout-edit.component.html',
    styleUrls: ['./workout-edit.component.scss']
})
export class WorkoutEditComponent implements OnInit, OnDestroy {
    workout: Workout;

    private _onDestroy$ = new Subject();

    constructor(
        private _route: ActivatedRoute,
        private _workoutService: WorkoutService,
        private _router: Router,
        @Inject(MAT_DIALOG_DATA) public data: Workout,
        private _dialogRef: MatDialogRef<WorkoutEditComponent>,
        private _snackBar: MatSnackBar
    ) {}

    ngOnInit() {
        this.workout = this.data;
    }

    ngOnDestroy() {
        this._onDestroy$.next();
    }

    save(value: any) {
        this._workoutService
            .updateWorkout(this.workout.id, value)
            .pipe(takeUntil(this._onDestroy$))
            .subscribe(this._onWorkoutUpdateSuccess, this._onWorkoutUpdateError);
    }

    private _onWorkoutUpdateSuccess = (workout: Workout) => {
        this._dialogRef.close(workout);
    }

    private _onWorkoutUpdateError = (workout: Workout) => {
        this._snackBar.open('Provedené úravy se nepodařilo uložit', '', {
            duration: 3000
        });
    }
}
