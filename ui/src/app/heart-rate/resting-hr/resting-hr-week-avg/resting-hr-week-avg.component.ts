import { Component, OnInit, OnDestroy } from '@angular/core';
import { HeartRateService } from '../../../core/heart-rate/heart-rate.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'wd-resting-hr-week-avg',
    templateUrl: 'resting-hr-week-avg.component.html',
    styleUrls: ['./resting-hr-week-avg.component.scss']
})
export class RestingHrWeekAvgComponent implements OnInit, OnDestroy {
    graphData = [];
    refLine: any;
    avgHr: number;
    colorScheme = {
        domain: ['#c71639', '#00b0bd', '#70b600', '#e6cb00', '#b000d3', '#001fce', '#919191']
    };
    loading = true;

    private _onDestroy$ = new Subject();

    constructor(private _hr: HeartRateService) {}

    ngOnInit() {
        this._hr
            .findWeeklyAverages()
            .pipe(takeUntil(this._onDestroy$))
            .subscribe(
                (d: any[]) => {
                    this.graphData = [
                        {
                            name: 'Průměrná klidová SF',
                            series: d.map(i => {
                                return {
                                    name: i.week,
                                    value: i.bpm
                                };
                            })
                        }
                    ];
                    this.refLine = {name: 'Průměrná klidová SF', value: this._getAvg(d)};
                    this.loading = false;
                },
                () => {
                    this.loading = false;
                }
            );
    }

    ngOnDestroy() {
        this._onDestroy$.next();
    }

    private _getAvg(data: any) {
        let sum = 0;
        data.forEach(i => {
            sum += i.bpm;
        });

        return sum / data.length;
    }
}
