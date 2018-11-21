import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { IllnessFormComponent } from '../illness-form/illness-form.component';
import { MAT_DIALOG_DATA } from '@angular/material';
import { IllnessWithType } from '../../core/health/health.interface';

@Component({
    selector: 'wd-illness-edit',
    templateUrl: 'illness-edit.component.html',
    styleUrls: ['./illness-edit.component.scss']
})
export class IllnessEditComponent implements OnInit {
    @ViewChild(IllnessFormComponent) formRef: IllnessFormComponent;

    constructor(
        // dialogRef: MatDialogRef<ComponentName>,
        @Inject(MAT_DIALOG_DATA) public data: IllnessWithType
    ) {}

    ngOnInit() {
        this.formRef.form.setValue({
            ...this.data,
            type: this.data.type.id
        });
    }
}
