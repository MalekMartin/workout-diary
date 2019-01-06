import { Component, Input, OnInit } from '@angular/core';
import { Workout } from '../../../../core/workout/workout.interface';

@Component({
    selector: 'wd-workout-detail-numbers',
    templateUrl: 'workout-detail-numbers.component.html',
    styleUrls: ['./workout-detail-numbers.component.scss']
})

export class WorkoutDetailNumbersComponent implements OnInit {

    @Input() workout: Workout;

    cadenceUnits: string;

    ngOnInit() {
        if (this.workout) {
            const a = this.workout.activity.id;
            this.cadenceUnits = a === '1' || a === '5' ? 'spm' : a === '2' || a === '3' ? 'rpm' : null;
        }
    }
}
