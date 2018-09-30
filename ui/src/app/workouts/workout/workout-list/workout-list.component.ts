import { Component, Input } from '@angular/core';
import { Workout } from '../../../core/workout/workout.interface';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
    selector: 'wd-workout-list',
    styleUrls: ['./workout-list.component.scss'],
    template: `
    <ng-container *ngIf="!!grouped && !!grouped.length">
        <div class="group-wrapper" *ngFor="let group of grouped">
            <div class="group-name">{{group.name}}</div>
            <div class="workout-list-wrapper">
                <div *ngFor="let workout of group.workouts" class="card-wrapper">
                    <wd-workout-list-item [workout]="workout"></wd-workout-list-item>
                </div>
            </div>
        </div>
    </ng-container>
    `
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
