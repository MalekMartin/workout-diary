import { Component, Input } from '@angular/core';
import { Workout } from '../../../core/workout/workout.interface';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
    selector: 'wd-workout-list',
    templateUrl: 'workout-list.component.html',
    styleUrls: ['./workout-list.component.scss']
})
export class WorkoutListComponent {
    @Input() set workouts(workouts: Workout[]) {
        this.data = workouts;
        this.grouped = [];
        this.groupByDate();
    }

    data: Workout[];
    grouped = [];

    groupByDate() {
        const months = this._getMonths();

        months.forEach(m => {
            const workouts = this.data.filter(w => {
                return moment(w.date).format('MMMM YYYY') === m;
            });

            this.grouped.push({
                name: m,
                workouts
            });
        });
    }

    private _getMonths() {
        const months = [];
        this.data.map(w => {
            months.push(moment(w.date).format('MMMM YYYY'));
        });

        return _.uniq(months);
    }


}
