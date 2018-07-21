import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CheckPoint } from '../../core/check-point/check-point.interface';

@Component({
    selector: 'wd-check-point-list',
    templateUrl: 'check-point-list.component.html',
    styleUrls: ['./check-point-list.component.scss']
})

export class CheckPointListComponent implements OnInit {

    @Input() checkPoints: CheckPoint[];

    @Output() deleted = new EventEmitter();
    @Output() edited = new EventEmitter();

    constructor() { }

    ngOnInit() { }
}
