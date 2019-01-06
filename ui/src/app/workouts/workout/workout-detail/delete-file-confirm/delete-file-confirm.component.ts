import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { WorkoutService } from '../../../../core/workout/workout.service';
import { Subject } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Workout } from '../../../../core/workout/workout.interface';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'wd-delete-file-confirm',
    templateUrl: 'delete-file-confirm.component.html',
    styleUrls: ['./delete-file-confirm.component.scss']
})
export class DeleteFileConfirmComponent implements OnInit, OnDestroy {

    private _onDestroy$ = new Subject();

    constructor(
        private _workout: WorkoutService,
        @Inject(MAT_DIALOG_DATA) public data: Workout,
        private _dialogRef: MatDialogRef<DeleteFileConfirmComponent>
    ) {}

    ngOnInit() {
    }

    ngOnDestroy() {
        this._onDestroy$.next();
    }

    delete() {
        this._workout.deleteWorkoutFileLog(this.data.log.id)
            .pipe(takeUntil(this._onDestroy$))
            .subscribe(() => {
                this._dialogRef.close('DELETED');
            });
    }
}
