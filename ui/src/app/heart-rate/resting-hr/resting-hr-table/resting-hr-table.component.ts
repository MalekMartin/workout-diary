import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { HeartRateService } from '../../../core/heart-rate/heart-rate.service';

@Component({
    selector: 'wd-resting-hr-table',
    templateUrl: 'resting-hr-table.component.html',
    styleUrls: ['./resting-hr-table.component.scss']
})
export class RestingHrTableComponent implements OnInit {
    @Input()
    set data(data: any) {
        this.tableSource = data
            .map(r => {
                return {
                    id: r.id,
                    date: moment(r.date).format('DD.MM.YYYY'),
                    bpm: r.bpm,
                    note: r.note,
                    activity: !!r.activity ? this.activities.find(a => a.id === r.activity) : null
                };
            })
            .reverse();
    }

    @Output() delete = new EventEmitter();
    @Output() edit = new EventEmitter();

    activities = HR_ACTIVITIES;

    tableSource: any;

    displayedColumns = ['date', 'bpm', 'note', 'activity', 'actions'];

    constructor() {}

    ngOnInit() {}

    onEdit(value: any) {
        this.edit.emit(value);
    }

    onDelete(value: any) {
        this.delete.emit(value);
    }
}

export const HR_ACTIVITIES = [
    { id: 'ILLNESS', name: 'Nemoc' },
    { id: 'ALCOHOL', name: 'Alkohol' },
    { id: 'WORK', name: 'Těžká práce' },
    { id: 'DIARRHEA', name: 'Břuch' }
];
