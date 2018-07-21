import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Gear } from '../../core/gear/gear.interface';
import * as moment from 'moment';

@Component({
    selector: 'wd-gear-form',
    templateUrl: 'gear-form.component.html'
})

export class GearFormComponent implements OnInit {

    @Input() gear: Gear;

    @Output() saved = new EventEmitter();

    form = this._fb.group({
        id: [''],
        brand: ['', Validators.required],
        model: [''],
        purchaseDate: [''],
        manufactureYear: [''],
        price: [''],
    });

    constructor(
        private _fb: FormBuilder
    ) { }

    ngOnInit() {
        if (!!this.gear) {
            this.form.setValue({
                id: this.gear.id,
                brand: this.gear.brand,
                model: this.gear.model,
                purchaseDate: moment(this.gear.purchaseDate).toDate(),
                manufactureYear: this.gear.manufactureYear,
                price: this.gear.price
            });
        }
    }

    save() {
        this.saved.emit(this.form.value);
    }
}
