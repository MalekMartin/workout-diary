import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { WorkoutService } from '../../../../core/workout/workout.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Workout } from '../../../../core/workout/workout.interface';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GpxCoordinates, GpxService } from '../../../../core/gpx/gpx.service';
import { FormBuilder } from '@angular/forms';
import { GpxExportParams } from '../../../../core/gpx/gpx.interface';

declare var require: any;
const FileSaver = require('file-saver');

@Component({
    selector: 'wd-export-to-gpx',
    templateUrl: 'export-to-gpx.component.html',
    styleUrls: ['./export-to-gpx.component.scss']
})
export class ExportToGpxComponent implements OnInit, OnDestroy {
    downloading = false;
    coordinates: GpxCoordinates[] = [];

    form = this._fb.group({
        coordinates: [null],
        options: ['REMOVE_EMPTY']
    });

    private _onDestroy$ = new Subject();

    constructor(
        private _workout: WorkoutService,
        @Inject(MAT_DIALOG_DATA) public workout: Workout,
        private _dialogRef: MatDialogRef<ExportToGpxComponent>,
        private _fb: FormBuilder,
        private _gpxService: GpxService
    ) {}


    ngOnInit() {
        this.getCoordinates();
    }

    ngOnDestroy() {
        this._onDestroy$.next();
    }

    download() {
        const opt = this.form.get('options').value;
        const c = this.form.get('coordinates').value;

        const coords = this.coordinates.find(co => co.id === c);

        const options: GpxExportParams = {
            action: opt,
            lat: coords ? coords.lat : null,
            lon: coords ? coords.lon : null,
            ele: coords ? coords.ele : null
        };

        this._workout
            .convertWorkoutCsvToGpx(this.workout.id, options)
            .pipe(takeUntil(this._onDestroy$))
            .subscribe(
                blob => {
                    const file = new Blob([blob]);
                    FileSaver.saveAs(file, this.workout.log.name.replace('.csv', '.gpx'));
                    this.downloading = false;
                    this._dialogRef.close();
                },
                () => {
                    console.warn('Nepodařilo se stáhnout soubor!');
                    this.downloading = false;
                }
            );
    }

    getCoordinates() {
        this._gpxService
            .findCoordinates()
            .pipe(takeUntil(this._onDestroy$))
            .subscribe((c: GpxCoordinates[]) => {
                this.coordinates = c;
            });
    }
}
