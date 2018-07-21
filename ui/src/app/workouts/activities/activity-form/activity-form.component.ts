import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Activity } from '../../../core/workout/workout.interface';

@Component({
    selector: 'wd-activity-form',
    templateUrl: 'activity-form.component.html',
    styleUrls: ['./activity-form.component.scss']
})
export class ActivityFormComponent implements OnInit {
    @Output() saved = new EventEmitter<Activity>();

    form = this._fb.group({
        id: [''],
        name: ['', Validators.required],
        color: [''],
        icon: ['']
    });

    constructor(private _fb: FormBuilder) {}

    ngOnInit() {}

    save() {
        this.saved.emit(this.form.value);
    }
}
