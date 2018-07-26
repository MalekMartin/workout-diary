import { Component, OnInit, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { WorkoutService } from '../../../../core/workout/workout.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { WorkoutType } from '../../../../core/workout/workout.interface';
import { ActivatedRoute } from '@angular/router';


@Component({
    selector: 'wd-workout-detail-graph',
    templateUrl: 'workout-detail-graph.component.html',
    styleUrls: ['./workout-detail-graph.component.scss']
})

export class WorkoutDetailGraphComponent implements OnInit, OnDestroy {

    @Input() id;

    source = null;
    units: string;
    loading = false;
    selected = null;
    xAxisLabel: string;

    types = {
        hr: {id: 'HR', name: 'Srdeční frekvence', units: 'bpm', xLabel: 'Čas'},
        speed: {id: 'SPEED', name: 'Rychlost', units: 'km/h', xLabel: 'Čas'},
        cad: {id: 'CAD', name: 'Kadence', units: 'rpm', xLabel: 'Čas'},
        ele: {id: 'ELE', name: 'Výškový profil', units: 'm.n.m.', xLabel: 'Vzdálenost [m]'}
    };

    colorScheme = {
        domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    };

    private _onDestroy$ = new Subject();

    constructor(
        private _workouts: WorkoutService,
        private _route: ActivatedRoute,
        private _cd: ChangeDetectorRef,
    ) { }

    ngOnInit() {
        this._route.params
            .pipe(takeUntil(this._onDestroy$))
            .subscribe(p => {
                this.id = p['id'];
                this.getData(this.types.hr);
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
