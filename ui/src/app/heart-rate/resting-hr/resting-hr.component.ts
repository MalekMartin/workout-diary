import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { HeartRateService } from '../../core/heart-rate/heart-rate.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBar, MatDialog } from '@angular/material';
import { HR_ACTIVITIES } from './resting-hr-table/resting-hr-table.component';
import { RestingHrDeleteComponent } from './resting-hr-delete/resting-hr-delete.component';
import { HeartRate } from '../../core/heart-rate/hr.interface';
import { RestingHrEditComponent } from './resting-hr-edit/resting-hr-edit.component';

@Component({
    selector: 'wd-resting-hr',
    templateUrl: 'resting-hr.component.html',
    styleUrls: ['./resting-hr.component.scss']
})
export class RestingHrComponent implements OnInit, OnDestroy {
    form = this._fb.group({
        date: [new Date(), Validators.required],
        bpm: [60, [Validators.required, Validators.min(40), Validators.max(250)]],
        note: ['', Validators.maxLength(255)],
        activity: ['']
    });

    colorScheme = {
        domain: ['#c71639', '#00b0bd', '#70b600', '#e6cb00', '#b000d3', '#001fce', '#919191']
    };

    activities = HR_ACTIVITIES;

    data: any;

    restingHrData: HeartRate[];

    minHr = { name: '', value: 300 };
    maxHr = { name: '', value: 0 };
    avgHr = 0;
    maxScale: number;
    minScale: number;
    refLine = null;

    graphLoading = false;
    savingData = false;

    private _onDestroy$ = new Subject();

    constructor(
        private _hr: HeartRateService,
        private _fb: FormBuilder,
        private _snackBar: MatSnackBar,
        private _dialog: MatDialog
    ) {}

    ngOnInit() {
        this.findAll();
    }

    ngOnDestroy() {
        this._onDestroy$.next();
    }

    addHr() {
        this.savingData = true;
        this._hr
            .addRestingHr({
                ...this.form.value,
                date: moment(this.form.get('date').value).format('YYYY-MM-DDTHH:mm:ss.000') + 'Z'
            })
            .pipe(takeUntil(this._onDestroy$))
            .subscribe(this._saveSuccess, this._saveError);
    }

    findAll() {
        this.graphLoading = true;
        this._hr
            .findRestingHrs()
            .pipe(takeUntil(this._onDestroy$))
            .subscribe(
                (res: any) => {
                    const hr = this._replaceData(res.hr);
                    const data = [];
                    data.push({
                        name: 'Klidová SF',
                        series: hr.reverse()
                    });

                    if (!!res.workouts.run) {
                        const run = this._replaceWorkoutdata(res.workouts.run);
                        data.push({
                            name: 'Běh [min]',
                            series: run.reverse()
                        });
                    }
                    if (!!res.workouts.cicle) {
                        const cycle = this._replaceWorkoutdata(res.workouts.cicle);
                        data.push({
                            name: 'Kolo [min]',
                            series: cycle.reverse()
                        });
                    }
                    if (!!res.workouts.spin) {
                        const spin = this._replaceWorkoutdata(res.workouts.spin);
                        data.push({
                            name: 'Spinning [min]',
                            series: spin.reverse()
                        });
                    }
                    if (!!res.workouts.moto) {
                        const moto = this._replaceWorkoutdata(res.workouts.moto);
                        data.push({
                            name: 'Motorka [min]',
                            series: moto.reverse()
                        });
                    }
                    if (!!res.workouts.walk) {
                        const walk = this._replaceWorkoutdata(res.workouts.walk);
                        data.push({
                            name: 'Chůze [min]',
                            series: walk.reverse()
                        });
                    }
                    if (!!res.workouts.gym) {
                        const gym = this._replaceWorkoutdata(res.workouts.gym);
                        data.push({
                            name: 'Posilování [min]',
                            series: gym.reverse()
                        });
                    }
                    if (!!res.workouts.football) {
                        const football = this._replaceWorkoutdata(res.workouts.football);
                        data.push({
                            name: 'Fotbal [min]',
                            series: football.reverse()
                        });
                    }
                    if (!!res.workouts.rollerskates) {
                        const rollers = this._replaceWorkoutdata(res.workouts.rollerskates);
                        data.push({
                            name: 'Kolečkové [min]',
                            series: rollers.reverse()
                        });
                    }
                    if (!!res.workouts.other) {
                        const other = this._replaceWorkoutdata(res.workouts.other);
                        data.push({
                            name: 'Ostatní [min]',
                            series: other.reverse()
                        });
                    }
                    this.data = data;

                    this.restingHrData = res.hr;

                    this.graphLoading = false;
                },
                () => {
                    this.graphLoading = false;
                }
            );
    }

    onDelete(value: HeartRate) {
        this._dialog
            .open(RestingHrDeleteComponent, {
                data: value
            })
            .afterClosed()
            .subscribe(v => {
                if (v === 'DELETED') {
                    this.findAll();
                }
            });
    }

    onEdit(value: HeartRate) {
        this._dialog
            .open(RestingHrEditComponent, {
                data: value,
                width: '300px'
            })
            .afterClosed()
            .pipe(takeUntil(this._onDestroy$))
            .subscribe(v => {
                if (v === 'EDITED') {
                    this.findAll();
                }
            });
    }

    private _createRange() {
        let data = [];
        let actDate = moment();
        for (let i = 0; i < 30; i++) {
            data = [...data, actDate.format('DD.MM.YYYY')];

            actDate = moment(actDate).subtract(1, 'days');
        }

        return data;
    }

    private _replaceData(d) {
        const emptyData = this._createRange();

        let sumHr = 0;
        let hasEmptyItem = false;

        let newArr = [];
        emptyData.forEach((i: any) => {
            const item = d.find(f => moment(f.date).format('DD.MM.YYYY') === i);
            if (!item) {
                hasEmptyItem = true;
            }

            newArr = [
                ...newArr,
                {
                    name: i,
                    value: item ? item.bpm : 0,
                    note: item ? item.note : ''
                }
            ];
        });

        d.forEach(data => {
            sumHr += data.bpm;

            this.minHr =
                data.bpm < this.minHr.value
                    ? { name: moment(data.date).format('DD.MM.YYYY'), value: data.bpm }
                    : this.minHr;
            this.maxHr =
                data.bpm > this.maxHr.value
                    ? { name: moment(data.date).format('DD.MM.YYYY'), value: data.bpm }
                    : this.maxHr;
        });

        // this.maxScale = this.maxHr.value + 5;
        // this.minScale = hasEmptyItem ? 0 : this.minHr.value - 5;
        this.minScale = 0;
        this.avgHr = d.length > 0 ? Math.ceil(sumHr / d.length) : 0;
        this.refLine = { name: 'Průměrná klidová SF', value: this.avgHr };
        return newArr;
    }

    private _replaceWorkoutdata(d: { date: string; duration: number }[]) {
        const emptyData = this._createRange();

        let maxDuration = 0;

        let newArr = [];
        emptyData.forEach((i: any) => {
            const items = d.filter(f => moment(f.date).format('DD.MM.YYYY') === i);
            let duration = 0;
            items.forEach(w => {
                duration += w.duration;
            });

            maxDuration = duration > maxDuration ? duration : maxDuration;
            newArr = [
                ...newArr,
                {
                    name: i,
                    value: duration
                }
            ];
        });

        return maxDuration > 0 ? newArr : null;
    }

    private _saveSuccess = (res: any) => {
        this.savingData = false;
        this.form.reset({
            date: new Date(),
            bpm: 60
        });
        this.findAll();
    }

    private _saveError = () => {
        this.savingData = false;
        this._openSnackBar('Nepodařilo se uložit data!');
    }

    private _openSnackBar(message: string, action = '') {
        this._snackBar.open(message, action, {
            duration: 3000
        });
    }
}
