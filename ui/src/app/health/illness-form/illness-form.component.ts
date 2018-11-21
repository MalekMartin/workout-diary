import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

export const ILLNESS_TYPE = [
    { id: 'STOMACH_ACHE', name: 'Břichabol' },
    { id: 'FLU', name: 'Chřipka' },
    { id: 'COLD', name: 'Nachlazení' },
    { id: 'DIARRHEA', name: 'Průjem' }
];

@Component({
    selector: 'wd-illness-form',
    templateUrl: 'illness-form.component.html',
    styleUrls: ['./illness-form.component.scss']
})
export class IllnessFormComponent implements OnInit {
    form = this._fb.group({
        id: [''],
        date: ['', Validators.required],
        time: [''],
        type: ['', Validators.required],
        note: [''],
        course: ['']
    });

    illnesses = ILLNESS_TYPE;

    constructor(private _fb: FormBuilder) {}

    ngOnInit() {}
}
