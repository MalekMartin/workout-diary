import { Component, OnInit } from '@angular/core';
import { SpinningWorkout } from '../../../core/spinning-workout/spinning-workout.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinningWorkoutService } from '../../../core/spinning-workout/spinning-workout.service';

@Component({
    selector: 'wd-spinning-workout-detail',
    templateUrl: 'spinning-workout-detail.component.html',
    styleUrls: ['./spinning-workout-detail.component.scss']
})
export class SpinningWorkoutDetailComponent implements OnInit {

    workout: SpinningWorkout;
    totalDuration: number;

    constructor(private _route: ActivatedRoute,
                private _spinningService: SpinningWorkoutService,
                private _router: Router) { }

    ngOnInit() {
        this._route.params
            .subscribe(p => {
                if (p['id']) {
                    this.workout = this._spinningService.getOneById(p['id']);
                    this._calcDuration();
                }
            });
    }

    onSave(data) {
        this.workout.sections.push(data);
        this._spinningService.update(this.workout);
        this._calcDuration();
    }

    onDelete() {
        this._spinningService.deleteOneById(this.workout.id);
        this._router.navigate(['workouts', 'spinning']);
    }

    private _calcDuration() {
        this.totalDuration = 0;
        this.workout.sections.forEach(s => {
            this.totalDuration += s.duration;
        });
    }
}
