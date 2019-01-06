import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Workout } from '../../../../core/workout/workout.interface';
import { Router } from '@angular/router';

@Component({
    selector: 'wd-workout-detail-header',
    templateUrl: 'workout-detail-header.component.html',
    styleUrls: ['./workout-detail-header.component.scss']
})

export class WorkoutDetailHeaderComponent implements OnInit {

    @Input() workout: Workout;
    @Input() prev: string;
    @Input() next: string;

    @Output() edit = new EventEmitter<string>();
    @Output() delete = new EventEmitter<string>();
    @Output() findSame = new EventEmitter();

    constructor(
        private _router: Router,
    ) { }

    ngOnInit() { }

}
