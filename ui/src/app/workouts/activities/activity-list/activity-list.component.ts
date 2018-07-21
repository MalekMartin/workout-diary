import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Activity } from '../../../core/workout/workout.interface';

@Component({
    selector: 'wd-activity-list',
    templateUrl: 'activity-list.component.html',
    styleUrls: ['./activity-list.component.scss']
})
export class ActivityLisComponent implements OnInit {
    @Input() activities: Activity[];

    @Output() edited = new EventEmitter<Activity>();
    @Output() deleted = new EventEmitter<Activity>();

    constructor() {}

    ngOnInit() {}
}
