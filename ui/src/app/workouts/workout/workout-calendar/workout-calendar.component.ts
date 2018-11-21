import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import * as moment from 'moment';
import { WorkoutService } from '../../../core/workout/workout.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'wd-workout-calendar',
    templateUrl: 'workout-calendar.component.html',
    styleUrls: ['./workout-calendar.component.scss']
})

export class WorkoutCalendarComponent implements OnInit, OnDestroy {

    @Input() set workoutsData(d) {
        this.workouts = d;
        this._createRangeArray();
    }

    from = moment()
        .hours(0)
        .minute(0)
        .second(0)
        .subtract(30, 'days')
        .format('YYYY-MM-DDTHH:mm:ss') + 'Z';
    to = moment()
        .hours(23)
        .minutes(59)
        .seconds(59)
        .format('YYYY-MM-DDTHH:mm:ss') + 'Z';
    workouts = [];

    firstDate = null;
    lastDate = null;

    data = null;

    private _onDestroy$ = new Subject();

    constructor(private _workouts: WorkoutService) { }

    ngOnInit() {}

    ngOnDestroy() {
        this._onDestroy$.next();
    }

    private _createRangeArray() {
        const today = moment().hour(0).minute(0).second(0);
        this._firstDateOfRange();
        this._lastDateOfRange();
        const arr = [];
        const diff = Math.floor(this.lastDate.diff(this.firstDate) / (60 * 60 * 24 * 1000));
        const current = this.firstDate.subtract(1, 'days');
        for (let i = 0; i < diff; i++) {
            arr.push({
                date: current.add(1, 'days').format('YYYY-MM-DD'),
                today: current.format('YYYY-MM-DD') === today.format('YYYY-MM-DD'),
                inRange: current.isBefore(moment(this.from)) || current.isAfter(moment()) ? false : true,
                workouts: this.workouts.filter(w => {
                    const date = moment(w.date).format('YYYY-MM-DD');
                    return date === current.format('YYYY-MM-DD');
                })
            });
        }
        const toWeeks = this._splitDaysIntoWeeks(arr);
        this.data = toWeeks;
    }

    private _splitDaysIntoWeeks(days: any[]) {
        let i, j;
        const temparray = [];
        const chunk = 7;

        for (i = 0, j = days.length; i < j; i += chunk) {
            temparray.push(days.slice(i, i + chunk));
        }

        return temparray;
    }

    private _firstDateOfRange() {
        const date = moment(this.from).hours(0).minutes(0).seconds(0);
        const d = date.isoWeekday();
        const dayOfWeek = d === 0 ? 7 : d - 1;

        const firstDate = dayOfWeek > 1 ? date.subtract(dayOfWeek, 'days') : date;
        this.firstDate = date;
    }

    private _lastDateOfRange() {
        const date = moment(this.to).hours(23).minutes(59).seconds(59);
        const d = date.isoWeekday();
        const dayOfWeek = d === 0 ? 7 : d - 1;

        const lastDate = dayOfWeek < 7 ? date.add(7 - (dayOfWeek + 1), 'days') : date;
        this.lastDate = date;
    }
}

