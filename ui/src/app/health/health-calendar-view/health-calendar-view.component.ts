import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Moment } from 'moment';
import * as moment from 'moment';
import { Illness, IllnessWithType } from '../../core/health/health.interface';

export interface HealthDay {
    date: string;
    day: string;
    today: boolean;
    illnesses: IllnessWithType[];
}

export interface DateRange {
    from: string;
    to: string;
}

export const WEEKDAYS = ['Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota', 'Neděle'];

@Component({
    selector: 'wd-health-calendar-view',
    templateUrl: 'health-calendar-view.component.html',
    styleUrls: ['./health-calendar-view.component.scss']
})
export class HealthCalendarViewComponent implements OnInit {

    @Input() set illnesses(i: IllnessWithType[]) {
        this._illnesses = !!i ? i : [];

        if (!!this.weeks.length) {
            this.weeks = this._addIllnessesToDays(this.weeks);
        }
    }

    @Input() set date(d: string) {
        this._date = d;
        this.month = moment(this.date).month() + 1;
        this.year = moment(this.date).year();
        this.calendarToWeeks(this._setCalendar(this.month, this.year));
    }

    @Output() editClicked = new EventEmitter<IllnessWithType>();
    @Output() previewClicked = new EventEmitter<IllnessWithType>();
    @Output() prevMonth = new EventEmitter();
    @Output() nextMonth = new EventEmitter();

    weeks: HealthDay[][] = [];
    weekdays = WEEKDAYS;
    month: number;
    year: number;

    private _illnesses: IllnessWithType[];
    private _date: string;

    constructor() {}

    ngOnInit() {
        this.month = moment(this.date).month() + 1;
        this.year = moment(this.date).year();
        this.calendarToWeeks(this._setCalendar(this.month, this.year));
    }

    get date(): string {
        return this._date;
    }

    calendarToWeeks(data: HealthDay[]) {
        const calendar = [];
        let week = [];
        let i = 0;
        for (let j = 0; j < data.length; j++) {
            if (i < 7) {
                week.push(data[j]);
            } else {
                i = 0;
                calendar.push(week);
                week = [];
                week.push(data[j]);
            }
            i += 1;
        }
        calendar.push(week);
        this.weeks = calendar;
    }

    edit(value: IllnessWithType) {
        this.editClicked.emit(value);
    }

    preview(value: IllnessWithType) {
        this.previewClicked.emit(value);
    }

    private _setCalendar(month: number, year: number) {
        const numberOfDays = moment(`${year}-${month}`, 'YYYY-MM').daysInMonth();
        const date = moment(`${year}-${month}-01`);
        const firstDay = date.isoWeekday();
        const lastDay = moment(year + '-' + month + '-' + numberOfDays).isoWeekday();
        const data: HealthDay[] = [];
        const totalViewDays = firstDay + (7 - lastDay) + numberOfDays;
        const today = moment().format('YYYY-MM-DD');

        for (let i = 1; i < firstDay; i++) {
            data.push({
                date: null,
                day: '',
                today: false,
                illnesses: []
            });
        }

        for (let i = 1; i <= numberOfDays; i++) {
            const item = i === 1 ? date : date.add(1, 'day');
            data.push({
                date: item.format('YYYY-MM-DD'),
                day: item.format('D'),
                today: item.format('YYYY-MM-DD') === today,
                illnesses: []
            });
        }

        for (let i = lastDay; i < 7; i++) {
            data.push({
                date: null,
                day: '',
                today: false,
                illnesses: []
            });
        }
        return data;
    }

    private _addIllnessesToDays(data: HealthDay[][]) {
        return data.map(w => {

            return w.map((d: HealthDay) => {
                return {
                        ...d,
                        illnesses: !!d.date
                            ? this._illnesses.filter(i => {
                                const day = d.date;
                                const illness = moment(i.date).format('YYYY-MM-DD');
                                return  day === illness;
                            })
                            : []
                    };
                });
        });
    }

}
