import { Component, OnInit, Input } from '@angular/core';
import { Workout } from '../../../core/workout/workout.interface';
import * as moment from 'moment';

const WEEKDAYS = {
    0: 'Neděle',
    1: 'Pondělí',
    2: 'Úterý',
    3: 'Středa',
    4: 'Čtvrtek',
    5: 'Pátek',
    6: 'Sobota'
};

@Component({
    selector: 'wd-workout-chart',
    templateUrl: 'workout-chart.component.html',
    styleUrls: ['./workout-chart.component.scss']
})
export class WorkoutChartComponent implements OnInit {
    @Input()
    set workouts(w: Workout[]) {
        this.data = this.build(w);
    }

    colMaxHeight = 126;
    maxDuration = 0;

    data;
    source;

    colorScheme = {
        domain: ['#5AA454']
    };

    constructor() {}

    ngOnInit() {}

    build(w: Workout[]) {
        const range = [];
        const ngxRange = [];

        const date = moment();

        for (let i = 0; i < 31; i++) {
            const workouts = w.filter(work => {
                return moment(work.date).format('YYYY-MM-DD') === date.format('YYYY-MM-DD');
            });

            let totalDuration = 0;
            let totalDistance = 0;
            let totalCalories = 0;

            for (let j = 0; j < workouts.length; j++) {
                totalDuration += workouts[j].duration;
                totalDistance += workouts[j].distance;
                totalCalories += workouts[j].energy;
            }
            this.maxDuration = totalDuration > this.maxDuration ? totalDuration : this.maxDuration;
            range.push({
                date: date.format('YYYY-MM-DD'),
                day: WEEKDAYS[date.day()],
                workouts,
                totalDuration,
                totalDistance,
                totalCalories,
                color: !!workouts && !!workouts.length ? workouts[0].activity.color : ''
            });
            ngxRange.push({
                name: date.format('DD MMM'),
                value: totalDuration / 60
            });
            date.subtract(1, 'days');
        }

        range.reverse();
        ngxRange.reverse();
        this.source = ngxRange;
        return range;
    }

    columnHeigh(duration: number) {
        const max = 2.25 * 60 * 60; // max displayed value is 2:15

        if (duration >= max) { return this.colMaxHeight; }

        return Math.ceil((duration / max) * this.colMaxHeight);
    }
}
