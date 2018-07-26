import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { HrZonesService } from '../../../../core/heart-rate/hr-zones.service';
import { WorkoutService } from '../../../../core/workout/workout.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Workout } from '../../../../core/workout/workout.interface';

@Component({
    selector: 'wd-workout-detail-hr',
    templateUrl: 'workout-detail-hr.component.html',
    styleUrls: ['./workout-detail-hr.component.scss']
})

export class WorkoutDetailHrComponent implements OnInit, OnDestroy {

    @Input() id: string;
    @Input() set analyzed(a: any) {
        this.hrs = a.zones;
        this.keys = Object.keys(a.zones);
        this.maxDuration = a.maxDuration;
        this.workoutTime = a.workoutTime;
    }
    @Input() workout: Workout;

    private _onDestroy$ = new Subject();

    hrs: any;
    keys: string[];
    maxDuration: number;
    workoutTime: number;

    constructor(
        private _zones: HrZonesService,
        private _workout: WorkoutService,
    ) { }

    ngOnInit() {
        // this.analyzeHr(this.id);
    }

    ngOnDestroy() {
        this._onDestroy$.next();
    }

    // analyzeHr(workoutId: string) {
    //     this._workout
    //         .analyzeHr(workoutId, this._zones.hrMax)
    //         .pipe(takeUntil(this._onDestroy$))
    //         .subscribe((val:any) => {
    //             this.hrs = val.zones;
    //             this.keys = Object.keys(val.zones);
    //             this.maxDuration = val.maxDuration;
    //         });
    // }

    getWidth(value) {
        return ((value / this.maxDuration) * 100) + '%';
    }
}
