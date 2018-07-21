import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Activity } from '../../core/workout/workout.interface';
import { ActivitiesService } from '../../core/activities/activities.service';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { ActivityFormComponent } from './activity-form/activity-form.component';

@Component({
    selector: 'wd-activities',
    templateUrl: 'activities.component.html',
    styleUrls: ['./activities.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivitiesComponent implements OnInit, OnDestroy {
    @ViewChild(ActivityFormComponent) activityForm: ActivityFormComponent;

    activities: Activity[];

    private _onDestroy$ = new Subject();

    constructor(private _activity: ActivitiesService, private _cd: ChangeDetectorRef) {}

    ngOnInit() {
        this.findActivities();
    }

    ngOnDestroy() {
        this._onDestroy$.next();
    }

    onEdit(a: Activity) {
        this.activityForm.form.setValue({
            id: a.id,
            name: a.name,
            color: a.color,
            icon: a.icon
        });
    }

    onDelete(a: Activity) {
        this._activity
            .deleteActivity(a.id)
            .pipe(takeUntil(this._onDestroy$))
            .subscribe(() => {
                this.findActivities();
            });
    }

    onSave(a: Activity) {
        if (!!a && !a.id) {
            this._createActivity(a);
        } else if (!!a && !!a.id) {
            this._updateActivity(a);
        }
    }

    findActivities() {
        this._activity.activityStream.pipe(takeUntil(this._onDestroy$)).subscribe(a => {
            this.activities = a;
            this._cd.markForCheck();
        });
    }

    private _createActivity(a: Activity) {
        this._activity
            .addActivity(a)
            .pipe(takeUntil(this._onDestroy$))
            .subscribe(() => {
                this.activityForm.form.reset();
                this.findActivities();
            });
    }

    private _updateActivity(a: Activity) {
        this._activity
            .updateActivity(a)
            .pipe(takeUntil(this._onDestroy$))
            .subscribe(() => {
                this.activityForm.form.reset();
                this.findActivities();
            });
    }
}
