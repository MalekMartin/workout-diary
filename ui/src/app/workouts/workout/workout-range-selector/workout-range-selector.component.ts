import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { FormControl } from '@angular/forms';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'wd-workout-range-selector',
    templateUrl: 'workout-range-selector.component.html'
})

export class WorkoutRangeSelectorComponent implements OnInit, OnDestroy {

    @Output() changed = new EventEmitter();

    fromDate =
        moment()
            .subtract(30, 'days')
            .set('hour', 1)
            .set('minute', 0)
            .format('YYYY-MM-DDThh:mm:ss') + 'Z';

    ranges = [
        { id: 1, name: 'Posledních 30 dní', value: { from: this.fromDate, to: null } },
        {
            id: 2,
            name: 'Tento měsíc',
            value: {
                from:
                    moment()
                        .set('date', 1)
                        .set('hour', 1)
                        .set('minute', 0)
                        .set('second', 0)
                        .format('YYYY-MM-DDThh:mm:ss') + 'Z',
                to:
                    moment()
                        .set('date', moment().daysInMonth())
                        .format('YYYY-MM-DDThh:mm:ss') + 'Z'
            }
        },
        {
            id: 3,
            name: 'Tento rok',
            value: {
                from:
                    moment()
                        .set('date', 1)
                        .set('month', 1)
                        .set('hour', 1)
                        .set('minute', 0)
                        .set('second', 0)
                        .format('YYYY-MM-DDThh:mm:ss') + 'Z',
                to:
                    moment()
                        .set('date', 31)
                        .set('month', 12)
                        .format('YYYY-MM-DDThh:mm:ss') + 'Z'
            }
        },
        { id: 4, name: 'Vše', value: { from: null, to: null } }
    ];

    range = new FormControl(this.ranges[0].id);

    private _onDestroy$ = new Subject();

    constructor() { }

    ngOnInit() {
        this.range.valueChanges
            .pipe(takeUntil(this._onDestroy$))
            .pipe(
                takeUntil(this._onDestroy$),
                debounceTime(300),
            )
            .subscribe(val => {
                this.changed.emit(
                    this.ranges.find(r => r.id === val).value
                );
            });
    }

    ngOnDestroy() {
        this._onDestroy$.next();
    }
}
