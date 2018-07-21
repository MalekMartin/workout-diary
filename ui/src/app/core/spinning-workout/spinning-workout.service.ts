import { Injectable } from '@angular/core';
import { SpinningWorkout } from './spinning-workout.interface';

@Injectable()
export class SpinningWorkoutService {

    constructor() { }

    addWorkout(name: string) {
        const w = this._createWorkout(name);
        this._addItem(w);
        return w;
    }

    update(workout: SpinningWorkout) {
        const data = this._get()
            .map(w => {
                if (w.id === workout.id) {
                    w = {...workout};
                }
                return w;
            });
        this._replace(data);
    }

    getAllWorkouts(): SpinningWorkout[] {
        return this._get();
    }

    getOneById(id: string): SpinningWorkout {
        return this._get()
            .find(w => {
                return w.id === id;
            });
    }

    deleteOneById(id: string) {
        const data = this._get()
            .filter(w => {
                return w.id !== id;
            });

        this._replace(data);
    }

    recalculateToSecs(min: number, sec: number): number {

        if (!min) { return sec; }

        return (min * 60) + sec;
    }

    private _createWorkout(name: string): SpinningWorkout {
        return {
            id: Math.ceil((Math.random() * 10000)).toString(),
            name: name,
            sections: []
        };
    }

    private _get() {
        return JSON.parse(localStorage.getItem('wd.spinning')) || [];
    }

    private _replace(data) {
        localStorage.setItem('wd.spinning', JSON.stringify(data));
    }

    private _addItem(item: SpinningWorkout) {
        if (!!item) {
            const all = this._get();
            all.push(item);
            this._replace(all);
        }
    }
}
