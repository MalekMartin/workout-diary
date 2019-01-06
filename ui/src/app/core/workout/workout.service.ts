import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivitiesService } from '../activities/activities.service';
import { HttpService } from '../http.service';
import { Workout, WorkoutType } from './workout.interface';
import { GpxExportParams } from '../gpx/gpx.interface';

@Injectable()
export class WorkoutService {
    constructor(private _http: HttpService, private _activities: ActivitiesService) {}

    addWorkout(data) {
        return this._http.post('resource/workout/add', data);
    }

    updateWorkout(workoutId: string, data) {
        return this._http.post(`/resource/workout/${workoutId}/update`, data);
    }

    findAll(limit?: number): Observable<Workout[]> {
        const arg = !!limit && limit > 0 ? '?limit=' + limit : '';
        return this._http.get('resource/workout/all' + arg);
    }

    workoutsByDateRange(from: string, to: string, types: number[]): Observable<Workout[]> {
        return this._http.post(`/resource/workouts/range?from=${from}&to=${to}`, types);
    }

    findOneById(id): Observable<Workout> {
        return this._http.get(`resource/workout/${id}`);
    }

    findNextAndPrev(id, date, filter) {
        return this._http.post(`/resource/workout/${id}/next-prev`, {
            types: filter,
            date: date
        });
    }

    deleteWorkout(id: string) {
        return this._http.delete(`resource/workout/${id}/delete`);
    }

    deleteWorkoutFileLog(id: string) {
        return this._http.delete(`/resource/workout/file/${id}`);
    }

    getGraphData(id: string, type: WorkoutType) {
        return this._http.get(`/resource/workout/${id}/graph?type=${type}`);
    }

    getLogFile(id: string) {
        return this._http.saveFileAs(`/resource/workout/${id}/logfile`);
    }

    addCheckPoint(workoutId: string, checkPointId: string) {
        return this._http.get(`/resource/workout/${workoutId}/check-point/${checkPointId}/add`);
    }

    deleteCheckPoint(workoutId: string, checkPointId: string) {
        return this._http.delete(`/resource/workout/${workoutId}/check-point/${checkPointId}/delete`);
    }

    getRouteCheckPoints(id: string) {
        return this._http.get(`/resource/workout/${id}/route`);
    }

    getRouteCoordinates(id: string) {
        return this._http.get(`/resource/workout/${id}/route/coordinates`);
    }

    convertWorkoutCsvToGpx(id: string, opt: GpxExportParams) {
        let params = 'id=' + id;
        params += '&action=' + opt.action;

        if (opt.action === 'USE_DEFAULT') {
            params += '&lat=' + opt.lat;
            params += '&lon=' + opt.lon;
            params += '&ele=' + opt.ele;
        }

        return this._http.saveFileAs('/resource/csv/to-gpx?' + params);
    }

    getTypesFromLocalStorage() {
        const types = localStorage.getItem('wd.filter.types');
        return !!types ? JSON.parse(types) : [];
    }

    analyzeHr(id: string, hrMax: number) {
        return this._http.get(`/resource/workout/${id}/analyze-hr?max=${hrMax}`);
    }

    findSameRoutes(workout: Workout) {
        return this._http.post('/resource/workout/find-same-routes', workout);
    }

    getSameWorkouts(id: string) {
        return this._http.get(`/resource/workout/${id}/same-workouts`);
    }

    // One time operation to export all files form DB
    // saveAllFiles() {
    //     return this._http.get('/resource/csv/save-all');
    // }
}
