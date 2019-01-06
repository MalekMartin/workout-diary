import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { HeartRateService } from '../../../core/heart-rate/heart-rate.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HeartRate } from '../../../core/heart-rate/hr.interface';

@Component({
    selector: 'wd-resting-hr-delete',
    styleUrls: ['./resting-hr-delete.component.scss'],
    template: `
        <h1 mat-dialog-title>Smazat záznam</h1>
        <div mat-dialog-content class="content">
            <ng-container *ngIf="!!data">
                <div class="row">
                    <div class="label">Datum</div>
                    <div class="value">{{ data.date | moment }}</div>
                </div>
                <div class="row">
                    <div class="label">Srdeční frekvence</div>
                    <div class="value">{{ data.bpm }} bpm</div>
                </div>
                <div *ngIf="!!data.activity" class="row">
                    <div class="label">Jiné</div>
                    <div class="value">{{ data.activity.name }}</div>
                </div>
                <div *ngIf="!!data.note" class="row">
                    <div class="label">Poznámka</div>
                    <div class="value">{{ data.note }}</div>
                </div>
            </ng-container>
        </div>
        <div mat-dialog-actions class="actions" align="end">
            <button mat-button color="primary" mat-dialog-close>Zrušit</button>
            <button mat-raised-button color="primary" (click)="delete()">Smazat</button>
        </div>
    `
})
export class RestingHrDeleteComponent implements OnInit, OnDestroy {

    private _onDestroy$ = new Subject();

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: HeartRate,
        private _dialogRef: MatDialogRef<RestingHrDeleteComponent>,
        private _hrService: HeartRateService
    ) {}

    ngOnInit() {}

    ngOnDestroy() {
        this._onDestroy$.next();
    }

    delete() {
        this._hrService
            .deleteHRrecord(this.data.id)
            .pipe(takeUntil(this._onDestroy$))
            .subscribe(() => {
                this._dialogRef.close('DELETED');
            });
    }
}
