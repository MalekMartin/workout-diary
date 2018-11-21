import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { IllnessWithType } from '../../core/health/health.interface';

@Component({
    selector: 'wd-illness-preview',
    templateUrl: 'illness-preview.component.html',
    styleUrls: ['./illness-preview.component.scss']
})
export class IllnessPreviewComponent implements OnInit {
    constructor(
        // dialogRef: MatDialogRef<ComponentName>,
        @Inject(MAT_DIALOG_DATA) public data: IllnessWithType
    ) {}

    ngOnInit() {}
}
