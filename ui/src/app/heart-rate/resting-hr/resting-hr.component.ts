import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { HeartRateService } from '../../core/heart-rate/heart-rate.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'wd-resting-hr',
    templateUrl: 'resting-hr.component.html',
    styleUrls: ['./resting-hr.component.scss']
})

export class RestingHrComponent implements OnInit, OnDestroy {

    form = this._fb.group({
        date: [new Date() , Validators.required],
        bpm: [60, [Validators.required, Validators.min(40), Validators.max(250)]],
        note: ['', Validators.maxLength(255)]
    });

    colorScheme = {
        domain: ['#c71639', '#00b0bd', '#70b600', '#e6cb00', '#b000d3', '#001fce', '#919191']
    };

    data: any;
    tableSource: any[];
    displayedColumns = ['date', 'bpm', 'note'];

    minHr = {name: '', value: 300};
    maxHr = {name: '', value: 0};
    avgHr = 0;
    maxScale: number;
    minScale: number;
    refLine = null;

    graphLoading = false;
    savingData = false;

    private _onDestroy$ = new Subject();

    constructor(private _hr: HeartRateService,
                private _fb: FormBuilder,
                private _snackBar: MatSnackBar) { }

    ngOnInit() {
        this.findAll();
    }

    ngOnDestroy() {
        this._onDestroy$.next();
    }

    addHr() {
        this.savingData = true;
        this._hr.addRestingHr(
                this.form.get('bpm').value,
                this.form.get('date').value,
                this.form.get('note').value
            )
            .pipe(takeUntil(this._onDestroy$))
            .subscribe(this._saveSuccess, this._saveError);
    }

    findAll() {
        this.graphLoading = true;
        this._hr.findWeeklyAverages()
            .pipe(takeUntil(this._onDestroy$))
            .subscribe(d => {
                console.log(d);
            });
        this._hr.findRestingHrs()
            .pipe(takeUntil(this._onDestroy$))
            // .subscribe((res: any) => {
            //     this.data = [
            //         {
            //             name: 'Klidova SF',
            //             series: this._prepareAllRestHrs(res.hr)
            //         }
            //     ];
            //     console.log(this.data);
            //     this.graphLoading = false;
            // });
            .subscribe((res: any) => {
                const hr = this._replaceData(res.hr);
                const run = this._replaceWorkoutdata(res.workouts.run);
                const cicle = this._replaceWorkoutdata(res.workouts.cicle);
                const spin = this._replaceWorkoutdata(res.workouts.spin);
                const moto = this._replaceWorkoutdata(res.workouts.moto);
                const walk = this._replaceWorkoutdata(res.workouts.walk);
                const gym = this._replaceWorkoutdata(res.workouts.gym);
                const football = this._replaceWorkoutdata(res.workouts.football);
                const rollers = this._replaceWorkoutdata(res.workouts.rollerskates);
                const other = this._replaceWorkoutdata(res.workouts.other);

                this.data = [
                    {
                        name: 'Klidová SF',
                        series: hr.reverse()
                    },
                    {
                        name: 'Běh [min]',
                        series: run.reverse()
                    },
                    {
                        name: 'Kolo [min]',
                        series: cicle.reverse()
                    },
                    {
                        name: 'Spinning [min]',
                        series: spin.reverse()
                    },
                    {
                        name: 'Motorka [min]',
                        series: moto.reverse()
                    },
                    {
                        name: 'Chůze [min]',
                        series: walk.reverse()
                    },
                    {
                        name: 'Ostatní [min]',
                        series: other.reverse()
                    },
                    {
                        name: 'Posilování [min]',
                        series: gym.reverse(),
                    },
                    {
                        name: 'Fotbal [min]',
                        series: football.reverse()
                    },
                    {
                        name: 'Kolečkové [min]',
                        series: rollers.reverse()
                    }
                ];

                this.graphLoading = false;
                this.tableSource = res.hr.map(r => {
                    return {
                        date: moment(r.date).format('DD.MM.YYYY'),
                        bpm: r.bpm,
                        note: r.note
                    };
                }).reverse();
            }, () => {
                this.graphLoading = false;
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

    private _prepareAllRestHrs(data: any) {
        const arr = [];
        let sumHr = 0;

        for (let i = 0; i < data.length; i++) {
            sumHr += data[i].bpm;

            this.minHr = data.bpm < this.minHr.value
                ? {name: moment(data[i].date).format('DD.MM.YYYY'), value: data[i].bpm}
                : this.minHr;
            this.maxHr = data[i].bpm > this.maxHr.value
                ? {name: moment(data[i].date).format('DD.MM.YYYY'), value: data[i].bpm}
                : this.maxHr;

            arr.push({
                name: moment(data[i].date).format('DD.MM.YYYY'),
                value: data[i].bpm
            });
        }

        this.avgHr = data.length > 0 ? Math.ceil(sumHr / data.length) : 0;
        this.refLine = {name: 'Průměrná klidová SF', value: this.avgHr};
        return arr;
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

            newArr = [...newArr, {
                name: i,
                value: item ? item.bpm : 0,
                note: item ? item.note : ''
            }];
        });

        d.forEach((data) => {
            sumHr += data.bpm;

            this.minHr = data.bpm < this.minHr.value
                ? {name: moment(data.date).format('DD.MM.YYYY'), value: data.bpm}
                : this.minHr;
            this.maxHr = data.bpm > this.maxHr.value
                ? {name: moment(data.date).format('DD.MM.YYYY'), value: data.bpm}
                : this.maxHr;
        });

        // this.maxScale = this.maxHr.value + 5;
        // this.minScale = hasEmptyItem ? 0 : this.minHr.value - 5;
        this.minScale = 0;
        this.avgHr = d.length > 0 ? Math.ceil(sumHr / d.length) : 0;
        this.refLine = {name: 'Průměrná klidová SF', value: this.avgHr};
        return newArr;
    }

    private _replaceWorkoutdata(d: {date: string; duration: number}[]) {
        const emptyData = this._createRange();

        let newArr = [];
        emptyData.forEach((i: any) => {
            const item = d.find(f => moment(f.date).format('DD.MM.YYYY') === i);

            newArr = [...newArr, {
                name: i,
                value: item ? item.duration : 0,
            }];
        });

        return newArr;
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
            duration: 3000,
        });
    }
}
