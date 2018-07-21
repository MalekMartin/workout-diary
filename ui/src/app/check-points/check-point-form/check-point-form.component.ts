import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'wd-check-point-form',
    templateUrl: 'check-point-form.component.html',
    styleUrls: ['./check-point-form.component.scss']
})

export class CheckPointFormComponent implements OnInit {

    @Output() saved = new EventEmitter();

    form = this._fb.group({
        id: [''],
        name: ['', Validators.required],
        lat: ['', Validators.required],
        lon: ['', Validators.required]
    });

    constructor(
        private _fb: FormBuilder,
    ) { }

    ngOnInit() { }

    save() {
        this.saved.emit(this.form.value);
    }
}
