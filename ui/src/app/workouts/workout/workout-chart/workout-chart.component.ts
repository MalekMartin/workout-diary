import { Component, OnInit, Input } from '@angular/core';
import { Workout } from '../../../core/workout/workout.interface';
import * as moment from 'moment';

@Component({
    selector: 'wd-workout-chart',
    templateUrl: 'workout-chart.component.html',
    styleUrls: ['./workout-chart.component.scss']
})

export class WorkoutChartComponent implements OnInit {

    @Input() set workouts(w: Workout[]) {
        this.data = this.build(w);
    }

    colMaxHeight = 100;
    maxDuration = 0;

    data;

    constructor() { }

    ngOnInit() { }

    build(w: Workout[]) {
        const range = [];

        const date = moment();

        for (let i = 0; i < 31; i++) {
            const workouts = w.filter(work => {
                return moment(work.date).format('YYYY-MM-DD') === date.format('YYYY-MM-DD');
            });

            let totalDuration = 0;
            let totalDistance = 0;
            let totalCalories = 0;
            // workouts.forEach(item => totalDuration += item.duration);
            for (let j = 0; j < workouts.length; j++) {
                totalDuration += workouts[j].duration;
                totalDistance += workouts[j].distance;
                totalCalories += workouts[j].energy;
            }
            this.maxDuration = totalDuration > this.maxDuration ? totalDuration : this.maxDuration;
            range.push({
                date: date.format('YYYY-MM-DD'),
                day: weekdays[date.day()],
                workouts,
                totalDuration,
                totalDistance,
                totalCalories,
                color: !!workouts && !!workouts.length ? workouts[0].activity.color : ''
            });
            date.subtract(1, 'days');
        }

        range.reverse();
        return range;
    }

    columnHeigh(duration: number) {
        return Math.ceil((duration / this.maxDuration) * this.colMaxHeight);
    }

}


const weekdays = {
    0: 'Neděle',
    1: 'Pondělí',
    2: 'Úterý',
    3: 'Středa',
    4: 'Čtvrtek',
    5: 'Pátek',
    6: 'Sobota'
};

// {
//     "name": "Germany",
//     "series": [
//       {
//         "name": "2010",
//         "value": 7300000
//       },
//       {
//         "name": "2011",
//         "value": 8940000
//       }
//     ]
//   },
