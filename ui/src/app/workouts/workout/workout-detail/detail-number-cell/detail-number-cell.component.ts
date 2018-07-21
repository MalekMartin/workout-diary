import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'wd-detail-number-cell',
    template: `
    <div class="cell">
        <div class="value">
            {{value}}
            <span *ngIf="units" class="units">{{units}}</span>
        </div>
        <div class="note">{{description}}</div>
    </div>`,
    styleUrls: ['./detail-number-cell.component.scss']
})

export class DetailNumberCellComponent implements OnInit {
    @Input() value: string;
    @Input() units;
    @Input() description: string;

    constructor() { }

    ngOnInit() { }
}
