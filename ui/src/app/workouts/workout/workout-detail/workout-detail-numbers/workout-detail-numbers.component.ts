import { Component, Input } from '@angular/core';
import { Workout } from '../../../../core/workout/workout.interface';

@Component({
    selector: 'wd-workout-detail-numbers',
    templateUrl: 'workout-detail-numbers.component.html',
    styleUrls: ['./workout-detail-numbers.component.scss']
})

export class WorkoutDetailNumbersComponent {

    @Input() workout: Workout;
}
