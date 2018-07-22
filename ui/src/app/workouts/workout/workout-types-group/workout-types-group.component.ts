import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormArray, FormControl } from '@angular/forms';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'wd-workout-types-group',
    styleUrls: ['./workout-types-group.component.scss'],
    template: `
    <form [formGroup]="form" *ngIf="types">
        <ul formArrayName="items">
            <li *ngFor="let item of types; index as i; trackBy: trackByFn">
                <mat-checkbox [formControlName]="i">{{item.name}}</mat-checkbox>
            </li>
        </ul>
    </form>`
})

export class WorkoutTypesGroupComponent implements OnInit, OnDestroy {

    @Input() types: any[];

    @Output() changed = new EventEmitter();

    form = this._fb.group({
        items: this._fb.array([])
    });

    formItems = this.form.get('items') as FormArray;

    private _onDestroy$ = new Subject();

    constructor(
        private _fb: FormBuilder,
    ) { }

    ngOnInit() {
        this.prepareArray();
        this.setFormValues(this._typesFromLocalStorage());

        this.form.valueChanges
            .pipe(
                debounceTime(300),
                takeUntil(this._onDestroy$),
            )
            .subscribe(value => {
                const types = value.items.map((i, index) => (i ? this.types[index].id : false)).filter(i => !!i);
                this._typesToLocalStorage(types);
                this.changed.emit();
            });
    }

    ngOnDestroy() {
        this._onDestroy$.next();
    }

    prepareArray() {
        this.types.forEach((item, index) => {
            this.formItems.push(new FormControl(item.id));
        });
    }

    setFormValues(types: number[]) {
        this.types.forEach((item, index) => {
            const found = types.find(i => i === item.id);
            if (this.formItems.at(index)) {
                this.formItems
                    .at(index)
                    .setValue(!!found, { emitEvent: false });
            }
        });
    }

    private _typesToLocalStorage(types: number[]) {
        localStorage.setItem('wd.filter.types', JSON.stringify(types));
    }

    private _typesFromLocalStorage() {
        const types = localStorage.getItem('wd.filter.types');
        return !!types
            ? JSON.parse(types)
            : [];
    }
}
