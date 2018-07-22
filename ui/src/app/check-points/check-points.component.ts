import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CheckPoint } from '../core/check-point/check-point.interface';
import { CheckPointService } from '../core/check-point/check-point.service';
import { CheckPointFormComponent } from './check-point-form/check-point-form.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'wd-check-points',
    templateUrl: 'check-points.component.html',
    styleUrls: ['./check-points.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckPointsComponent implements OnInit, OnDestroy {

    @ViewChild(CheckPointFormComponent) checkPointForm: CheckPointFormComponent;

    checkPoints: CheckPoint[];

    private _onDestroy$ = new Subject();

    constructor(
        private _checkpointService: CheckPointService,
        private _cd: ChangeDetectorRef,
    ) { }

    ngOnInit() {
        this.getAllCheckPoints();
    }

    ngOnDestroy() {
        this._onDestroy$.next();
    }

    save(model: CheckPoint) {
        this._checkpointService.newCheckpoint(model)
            .subscribe(this._onCheckpointAddSuccess, this._onCheckpointAddError);
    }

    getAllCheckPoints() {
        this._checkpointService
            .getAllCheckPoints()
            .pipe(takeUntil(this._onDestroy$))
            .subscribe(this._onCheckPointsSuccess);
    }

    onEdit(item: CheckPoint) {
        // TODO
    }

    onDelete(item: CheckPoint) {
        this._checkpointService
            .deleteCheckPoint(item.id)
            .subscribe(this._onDeleteSuccess, this._onDeleteError);
    }

    showOnMap(item: CheckPoint) {
        // TODO
    }

    private _onCheckPointsSuccess = (cp: CheckPoint[]) => {
        this.checkPoints = cp;
        this._cd.markForCheck();
    }

    private _onCheckpointAddSuccess = () => {
        this.checkPointForm.form.reset();
        this.getAllCheckPoints();
    }

    private _onCheckpointAddError = () => {

    }

    private _onDeleteSuccess = () => {
        this.getAllCheckPoints();
    }

    private _onDeleteError = () => {

    }
}
