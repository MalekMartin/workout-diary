import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
    selector: '[wd-workout-check-point-row]',
    templateUrl: 'workout-check-point-row.component.html',
    styleUrls: ['./workout-check-point-row.component.scss'],
})

export class WorkoutCheckPointRowComponent {

    @Input() item: any;

    @Output() deleted = new EventEmitter<string>();
}

