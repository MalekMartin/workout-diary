import { Component, OnInit, Input } from '@angular/core';
import { Illness } from '../../../core/health/health.interface';

@Component({
    selector: 'wd-illness-preview-item',
    styleUrls: ['./illness-preview-item.component.scss'],
    template: `
        <label>{{label}}</label>
        <div class="value">{{value}}</div>
    `
})
export class IllnessPreviewItemComponent implements OnInit {

    @Input() label: string;
    @Input() value: string;

    constructor() {}

    ngOnInit() {}
}
