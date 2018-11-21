import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'wd-gpx-form',
    templateUrl: 'gpx-form.component.html',
    styleUrls: ['./gpx-form.component.scss']
})
export class GpxFormComponent implements OnInit {

    @Output() saved = new EventEmitter();

    form = this._fb.group({
        name: ['', Validators.required],
        ele: ['320.0'],
        lat: ['48.946966', Validators.required],
        lon: ['17.662286', Validators.required],
    });

    constructor(private _fb: FormBuilder) {}

    ngOnInit() {}

    save() {
        this.saved.emit(this.form.value);
    }
}
