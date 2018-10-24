import { Component, OnInit, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { WorkoutListViewType } from '../workout-stream/workout-stream.component';

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => WorkoutViewSelectorComponent),
    multi: true
};

@Component({
    selector: 'wd-workout-view-selector',
    styleUrls: ['./workout-view-selector.component.scss'],
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR],
    template: `
    <div class="view-selector">
        <i class="icon-list" [class.active]="view === 'list'" (click)="switchView('list')"></i>
        <i class="icon-table" [class.active]="view === 'table'" (click)="switchView('table')"></i>
        <i class="icon-calendar" [class.active]="view === 'calendar'" (click)="switchView('calendar')"></i>
    </div>
    `
})
export class WorkoutViewSelectorComponent implements OnInit, ControlValueAccessor {

    view: WorkoutListViewType = 'list';

    constructor() {}

    ngOnInit() {}

    switchView(value: WorkoutListViewType) {
        this.view = value;
        this._onChange(value);
    }

    writeValue(v: WorkoutListViewType) {
        this.view = v;
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
