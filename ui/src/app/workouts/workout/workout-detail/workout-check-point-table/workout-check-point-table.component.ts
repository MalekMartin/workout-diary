import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'wd-workout-check-point-table',
    templateUrl: 'workout-check-point-table.component.html',
    styleUrls: ['workout-check-point-table.component.scss']
})

export class WorkoutCheckPointTableComponent {

    @Input() data: any;
    @Output() deleted = new EventEmitter<string>();
}
