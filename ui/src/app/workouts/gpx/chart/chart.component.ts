import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'wd-chart',
    template: `
    <div style="width: 100%; height: 300px;">
        <ngx-charts-line-chart
            *ngIf="!!source && !!source.length"
            [scheme]="colorScheme"
            [results]="source"
            [gradient]="gradient"
            [xAxis]="true"
            [yAxis]="true"
            [legend]="true"
            [showXAxisLabel]="true"
            [showYAxisLabel]="true"
            xAxisLabel="Čas"
            yAxisLabel="BPM"
            [autoScale]="true"
            [yScaleMin]="0"
            (select)="onSelect($event)">
        </ngx-charts-line-chart>
    </div>`
})

export class ChartComponent implements OnInit {

    @Input() data: any;
    @Input() set hrData(d: {time: string, value: number}[]) {
        const aggr = d.length > 500 ? Math.round(d.length / 400) : 1;

        const newArr = [];
        let sumHr = 0;
        let counter = 0;
        for (let i = 0; i < d.length; i++) {
            sumHr += d[i].value;
            counter += 1;
            if (counter > aggr) {
                newArr.push({
                    time: d[i].time,
                    value: Math.round(sumHr / aggr)
                });
                counter = 0;
                sumHr = 0;
            }
        }

        const stats = [
            {
                'name': 'HR',
                'series': []
            }
        ];

        for (let i = 0; i < newArr.length; i++) {
            stats[0].series = [...stats[0].series, {
                'name': newArr[i].time,
                'value': newArr[i].value
            }];
        }

        this.source = [...stats];
        console.log('chart data length: ', newArr.length);
    }

    source;

    colorScheme = {
        domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    };

    constructor() { }

    ngOnInit() { }

    onSelect(d) {
        console.log(d);
    }
}
