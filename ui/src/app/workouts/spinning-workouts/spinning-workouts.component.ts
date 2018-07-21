import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SpinningWorkoutService } from '../../core/spinning-workout/spinning-workout.service';

@Component({
    selector: 'wd-spinning-workouts',
    templateUrl: 'spinning-workouts.component.html',
    styleUrls: ['./spinning-workouts.component.scss']
})

export class SpinningWokroutsComponent implements OnInit {

    newFormOpened = false;

    name = new FormControl('', Validators.required);

    constructor(private _router: Router,
                private _spinningService: SpinningWorkoutService) { }

    ngOnInit() { }

    create() {
        const workout = this._spinningService.addWorkout(this.name.value);

        this._router.navigate(['workouts', 'spinning', workout.id]);
    }
}
