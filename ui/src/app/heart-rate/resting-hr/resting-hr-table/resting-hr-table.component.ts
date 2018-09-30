import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';

@Component({
    selector: 'wd-resting-hr-table',
    templateUrl: 'resting-hr-table.component.html',
    styleUrls: ['./resting-hr-table.component.scss']
})

export class RestingHrTableComponent implements OnInit {

    @Input() set data(data: any) {
        this.tableSource = data.map(r => {
            return {
                date: moment(r.date).format('DD.MM.YYYY'),
                bpm: r.bpm,
                note: r.note,
                activity: !!r.activity ? this.activities.find(a => a.id === r.activity) : null
            };
        }).reverse();
    }

    activities = HR_ACTIVITIES;

    tableSource: any;

    displayedColumns = ['date', 'bpm', 'note', 'activity'];

    constructor() { }

    ngOnInit() { }
}

export const HR_ACTIVITIES = [
    {id: 'ILLNESS', name: 'Nemoc'},
    {id: 'ALCOHOL', name: 'Alkohol'},
    {id: 'WORK', name: 'Těžká práce'}
];
