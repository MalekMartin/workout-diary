import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { map } from 'rxjs/operators';
import { WorkoutType } from './workout.interface';

@Injectable()
export class WorkoutService {
    activities = [
        {id: 1, name: 'Běh', icon: 'directions_run', color: '#00b0bd'},
        {id: 2, name: 'Kolo', icon: 'directions_bike', color: '#70b600'},
        {id: 3, name: 'Spinning', icon: 'directions_bike', color: '#e6cb00'},
        {id: 4, name: 'Motorka', icon: 'motorcycle', color: '#b000d3'},
        {id: 5, name: 'Chůze', icon: 'directions_walk', color: '#001fce'},
        {id: 6, name: 'Posilování', icon: 'fitness_center', color: '#919191'},
        {id: 7, name: 'Fotbal', icon: '', color: '#0d9e00'},
        {id: 8, name: 'Kolečkové', icon: '', color: '#CCCCCC'},
    ];

    constructor(private _http: HttpService) { }

    addWorkout(data) {
        return this._http
            .post('resource/workout/add', data);
    }

    updateWorkout(workoutId: string, data) {
        return this._http
            .post(`/resource/workout/${workoutId}/update`, data);
    }

    findAll(limit?: number) {
        const arg = !!limit && limit > 0 ? '?limit=' + limit : '';
        return this._http
            .get('resource/workout/all' + arg)
            .pipe(
                map((items: any[]) => {
                    return items.map(item => {
                        return {
                            ...item,
                            activity: this.activities.find((a) => a.id === item.activity)
                        };
                    });
                })
            );
    }

    workoutsByDateRange(from: string, to: string, types: number[]) {
        return this._http.post(`/resource/workouts/range?from=${from}&to=${to}`, types)
            .pipe(
                map((items: any[]) => {
                    return items.map(item => {
                        return {
                            ...item,
                            activity: this.activities.find((a) => a.id === item.activity)
                        };
                    });
                })
            );
    }

    findOneById(id) {
        return this._http
            .get(`resource/workout/${id}`);
    }

    findNextAndPrev(id, date, filter) {
        return this._http
            .post(
                `/resource/workout/${id}/next-prev`,
                {
                    types: filter,
                    date: date
                }
            );
    }

    deleteWorkout(id: string) {
        return this._http
            .delete(`resource/workout/${id}/delete`);
    }

    deleteWorkoutFileLog(id: string) {
        return this._http
            .delete(`/resource/workout/file/${id}`);
    }

    getGraphData(id: string, type: WorkoutType) {
        return this._http
            .get(`/resource/workout/${id}/graph?type=${type}`);
    }

    getLogFile(id: string) {
        return this._http
            .saveFileAs(`/resource/workout/${id}/logfile`);
    }

    addCheckPoint(workoutId: string, checkPointId: string) {
        return this._http
            .get(`/resource/workout/${workoutId}/check-point/${checkPointId}/add`);
    }

    deleteCheckPoint(workoutId: string, checkPointId: string) {
        return this._http
            .delete(`/resource/workout/${workoutId}/check-point/${checkPointId}/delete`);
    }

    getRouteCheckPoints(id: string) {
        return this._http
            .get(`/resource/workout/${id}/route`);
    }

    getRouteCoordinates(id: string) {
        return this._http
            .get(`/resource/workout/${id}/route/coordinates`);
    }

    convertWorkoutCsvToGpx(id: string) {
        return this._http
            .saveFileAs('/resource/csv/to-gpx?id=' + id);
    }

    getTypesFromLocalStorage() {
        const types = localStorage.getItem('wd.filter.types');
        return !!types
            ? JSON.parse(types)
            : [];
    }
}
