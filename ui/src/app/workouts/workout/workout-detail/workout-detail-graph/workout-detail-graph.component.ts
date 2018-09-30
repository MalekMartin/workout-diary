import { Component, OnInit, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { WorkoutService } from '../../../../core/workout/workout.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { WorkoutType, Activity } from '../../../../core/workout/workout.interface';
import { ActivatedRoute } from '@angular/router';
import { ActivitiesService } from '../../../../core/activities/activities.service';


@Component({
    selector: 'wd-workout-detail-graph',
    templateUrl: 'workout-detail-graph.component.html',
    styleUrls: ['./workout-detail-graph.component.scss']
})

export class WorkoutDetailGraphComponent implements OnInit, OnDestroy {

    @Input() id;
    @Input() activity: Activity;

    source = null;
    units: string;
    loading = false;
    selected = null;
    xAxisLabel: string;

    showHr = false;
    showSpeed = false;
    showCad = false;
    showEle = false;

    types = {
        hr: {id: 'HR', name: 'Srdeční frekvence', units: 'bpm', xLabel: 'Čas'},
        speed: {id: 'SPEED', name: 'Rychlost', units: 'km/h', xLabel: 'Čas'},
        cad: {id: 'CAD', name: 'Kadence', units: 'rpm', xLabel: 'Čas'},
        ele: {id: 'ELE', name: 'Výškový profil', units: 'Nadmořská výška [m]', xLabel: 'Vzdálenost [m]'}
    };

    colorScheme = {
        domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    };

    private _onDestroy$ = new Subject();

    constructor(
        private _workouts: WorkoutService,
        private _route: ActivatedRoute,
        private _cd: ChangeDetectorRef,
        private _activityService: ActivitiesService,
    ) { }

    ngOnInit() {
        this._route.params
            .pipe(takeUntil(this._onDestroy$))
            .subscribe(p => {
                this.id = p['id'];
                this.getData(this.types.hr);
            });

        this._activityService.activityStream
            .pipe(takeUntil(this._onDestroy$))
            .subscribe(activity => {
                const match = activity.find(a => {
                    return a.id === this.activity.id;
                });

                this.showHr = match.hr;
                this.showCad = match.cadence;
                this.showEle = match.elevation;
                this.showSpeed = match.speed;
            });
    }

    ngOnDestroy() {
        this._onDestroy$.next();
    }

    getData(type: any) {
        this.loading = true;
        this._workouts
            .getGraphData(this.id, type.id)
            .pipe(takeUntil(this._onDestroy$))
            .subscribe((data: any) => {
                this.source = data;
                this.units = type.units;
                this.loading = false;
                this.selected = type;
                this.xAxisLabel = type.xLabel;
                this._cd.markForCheck();
            });
    }

    hovered(e) {
        // console.log(e);
    }
}
