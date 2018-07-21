import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { Activity } from '../workout/workout.interface';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ActivitiesService {
    activityStream = new ReplaySubject<Activity[]>(1);

    constructor(private _http: HttpService) {
        this.getActivities().subscribe((a: Activity[]) => {
            this.activityStream.next(a);
        });
    }

    addActivity(a: Activity) {
        return this._http.post('/resource/activity/add', a);
    }

    updateActivity(a: Activity) {
        return this._http.post(`/resource/activity/${a.id}/update`, a);
    }

    getActivities(): Observable<Activity[]> {
        return this._http.get('/resource/activity/all');
    }

    deleteActivity(id: string) {
        return this._http.delete(`/resource/activity/${id}/delete`);
    }
}
