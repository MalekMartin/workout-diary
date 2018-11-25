import { Component, forwardRef, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => WorkoutRangeSelectorComponent),
    multi: true
};

@Component({
    selector: 'wd-workout-range-selector',
    templateUrl: 'workout-range-selector.component.html',
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class WorkoutRangeSelectorComponent implements OnInit, OnDestroy, ControlValueAccessor {
    fromDate =
        moment()
            .subtract(30, 'days')
            .set('hour', 0)
            .set('minute', 0)
            .format('YYYY-MM-DDThh:mm:ss') + 'Z';

    ranges = [
        { id: '30_DAYS', name: 'Posledních 30 dní', value: { from: this.fromDate, to: null } },
        {
            id: 'THIS_MONTH',
            name: 'Tento měsíc',
            value: {
                from:
                    moment()
                        .set('date', 1)
                        .set('hour', 0)
                        .set('minute', 0)
                        .set('second', 0)
                        .format('YYYY-MM-DDTHH:mm:ss') + 'Z',
                to:
                    moment()
                        .set('date', moment().daysInMonth())
                        .format('YYYY-MM-DDTHH:mm:ss') + 'Z'
            }
        },
        {
            id: 'THIS_YEAR',
            name: 'Tento rok',
            value: {
                from:
                    moment()
                        .set('date', 1)
                        .set('month', 1)
                        .set('hour', 0)
                        .set('minute', 0)
                        .set('second', 0)
                        .format('YYYY-MM-DDTHH:mm:ss') + 'Z',
                to:
                    moment()
                        .set('date', 31)
                        .set('month', 12)
                        .format('YYYY-MM-DDTHH:mm:ss') + 'Z'
            }
        },
        { id: 'ALL', name: 'Vše', value: { from: null, to: null } }
    ];

    range = new FormControl(this.ranges[0].id);

    private _onDestroy$ = new Subject();

    constructor() {}

    ngOnInit() {
        this.range.valueChanges
            .pipe(takeUntil(this._onDestroy$))
            .pipe(takeUntil(this._onDestroy$))
            .subscribe(val => {
                this._onChange(this.ranges.find(r => r.id === val).value);
            });
    }

    ngOnDestroy() {
        this._onDestroy$.next();
    }

    writeValue(value) {
        this.range.setValue(this.ranges.find(r => r.id === value).value, { emitEvent: false });
    }

    registerOnChange(fn: (_: any) => void): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this._onTouched = fn;
    }

    private _onTouched: () => void = () => {};
    private _onChange: (_: any) => void = () => {};
}
