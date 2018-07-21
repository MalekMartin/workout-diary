import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { WorkoutService } from '../../../../core/workout/workout.service';
import { CheckPointService } from '../../../../core/check-point/check-point.service';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { CheckPoint } from '../../../../core/check-point/check-point.interface';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'wd-workout-checkpoint-form',
    templateUrl: 'workout-check-point-form.component.html'
})

export class WorkoutCheckPointFormComponent implements OnInit, OnDestroy {

    @Input() workoutId: string;

    @Output() saved = new EventEmitter();

    checkPoints: CheckPoint[];

    form = this._fb.group({
        checkPoint: ['', Validators.required]
    });

    private _onDestroy$ = new Subject();

    constructor(
        private _workoutService: WorkoutService,
        private _checkPointService: CheckPointService,
        private _fb: FormBuilder,
    ) { }

    ngOnInit() {
        this._checkPointService.getAllCheckPoints()
            .pipe(takeUntil(this._onDestroy$))
            .subscribe(this._onCheckPointsSuccess, this._onCheckPointsError);
    }

    ngOnDestroy() {
        this._onDestroy$.next();
    }

    save() {
        this._workoutService.addCheckPoint(this.workoutId, this.form.value.checkPoint)
            .subscribe(this._onSaveSuccess, this._onSaveError);
    }

    private _onSaveSuccess = () => {
        this.saved.emit();
    }

    private _onSaveError = () => {
    }

    private _onCheckPointsSuccess = (cp: CheckPoint[]) => {
        this.checkPoints = cp;
    }

    private _onCheckPointsError = () => {
    }
}
