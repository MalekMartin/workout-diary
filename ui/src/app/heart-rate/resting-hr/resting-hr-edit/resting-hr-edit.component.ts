import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { HeartRateService } from '../../../core/heart-rate/heart-rate.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HeartRate } from '../../../core/heart-rate/hr.interface';
import { FormBuilder, Validators } from '@angular/forms';
import { HR_ACTIVITIES } from '../resting-hr-table/resting-hr-table.component';
import * as moment from 'moment';

@Component({
    selector: 'wd-resting-hr-edit',
    styleUrls: ['./resting-hr-edit.component.scss'],
    template: `
        <h1 mat-dialog-title>Upravit záznam</h1>
        <div mat-dialog-content class="content">
            <ng-container *ngIf="!!data">
                <form [formGroup]="form">
                    <mat-form-field>
                        <input matInput [matDatepicker]="picker" formControlName="date" placeholder="Datum">
                        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                        <mat-datepicker #picker></mat-datepicker>
                    </mat-form-field>
                    <mat-form-field>
                        <input matInput formControlName="bpm" placeholder="BPM" type="number">
                    </mat-form-field>

                    <mat-form-field>
                        <mat-select formControlName="activity" placeholder="Vyber aktivitu">
                            <mat-option *ngFor="let item of activities" [value]="item.id">
                            {{ item.name }}
                            </mat-option>
                        </mat-select>
                    </mat-form-field>
                    <mat-form-field>
                        <textarea matInput
                            formControlName="note"
                            placeholder="Poznámka"
                            matTextareaAutosize
                            matAutosizeMinRows="2"
                            matAutosizeMaxRows="5"></textarea>
                    </mat-form-field>
                </form>
            </ng-container>
        </div>
        <div mat-dialog-actions class="actions" align="end">
            <button mat-button color="primary" mat-dialog-close>Zrušit</button>
            <button mat-raised-button color="primary" (click)="save()">Uložit</button>
        </div>
    `
})
export class RestingHrEditComponent implements OnInit, OnDestroy {

    form = this._fb.group({
        id: [''],
        activity: [''],
        date: [new Date(), Validators.required],
        bpm: ['', Validators.required],
        note: ['']
    });

    activities = HR_ACTIVITIES;

    private _onDestroy$ = new Subject();

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: HeartRate,
        private _dialogRef: MatDialogRef<RestingHrEditComponent>,
        private _hrService: HeartRateService,
        private _fb: FormBuilder
    ) {}

    ngOnInit() {
        if (!!this.data) {
            this.form.setValue({
                id: this.data.id,
                activity: this.data.activity ? this.data.activity.id : null,
                date: '',
                bpm: this.data.bpm,
                note: this.data.note
            });
        }
    }

    ngOnDestroy() {
        this._onDestroy$.next();
    }

    save() {
        this._hrService
            .updateHRRecord({
                ...this.form.value,
                date: moment(this.form.get('date').value).format('YYYY-MM-DD') + 'T00:00:00.000Z'
            })
            .pipe(takeUntil(this._onDestroy$))
            .subscribe(() => {
                this._dialogRef.close('EDITED');
            });
    }
}
