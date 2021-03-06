import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Workout, Activity } from '../../../core/workout/workout.interface';
import { SecToTimePipe } from '../../../shared/pipes/sec-to-time.pipe';
import * as moment from 'moment';
import { GearService } from '../../../core/gear/gear.service';
import { takeUntil ,  first } from 'rxjs/operators';
import { Subject ,  forkJoin } from 'rxjs';
import { Gear } from '../../../core/gear/gear.interface';
import { ActivitiesService } from '../../../core/activities/activities.service';

@Component({
    selector: 'wd-workout-form',
    templateUrl: 'workout-form.component.html',
    styleUrls: ['./workout-form.component.scss']
})
export class WorkoutFormComponent implements OnInit, OnDestroy {
    @Input() workout: Workout;

    pipe: SecToTimePipe;

    gears: Gear[];
    activities: Activity[];

    form = this._fb.group({
        name: ['', [Validators.required, Validators.maxLength(255)]],
        activity: ['', Validators.required],
        date: [new Date(), Validators.required],
        time: ['12:00', [Validators.maxLength(5), Validators.minLength(5)]],
        hour: ['', [Validators.min(0), Validators.max(24)]],
        min: ['', [Validators.min(0), Validators.max(59)]],
        sec: ['', [Validators.min(0), Validators.max(59)]],
        energy: ['', [Validators.min(0), Validators.max(5000)]],
        distance: ['', Validators.min(0)],
        note: ['', Validators.maxLength(255)],
        gear: [null]
    });

    private _onDestroy$ = new Subject();

    constructor(
        private _fb: FormBuilder,
        private _gearService: GearService,
        private _activities: ActivitiesService,
    ) {
        this.pipe = new SecToTimePipe();
    }

    ngOnInit() {
        this.prepareData();
    }

    ngOnDestroy() {
        this._onDestroy$.next();
    }

    prepareData() {
        forkJoin(this._gearService.getGears(), this._activities.activityStream.pipe(first()))
            .pipe(takeUntil(this._onDestroy$))
            .subscribe(([g, a]) => {
                this.gears = g;
                this.activities = a;
                if (!!this.workout) {
                    this._presetForm();
                }
            });
    }

    findGears() {
        this._gearService
            .getGears()
            .pipe(takeUntil(this._onDestroy$))
            .subscribe((gears: Gear[]) => {
                this.gears = gears;
                if (!!this.workout) {
                    this._presetForm();
                }
            });
    }

    setActivities() {
        this._activities.activityStream.pipe(takeUntil(this._onDestroy$)).subscribe(a => {
            this.activities = a;
        });
    }

    private _presetForm() {
        const time = this._prepareTime(this.workout.duration);
        this.form.setValue({
            name: this.workout.name,
            activity: this.workout.activity.id,
            date: moment(this.workout.date).toDate(),
            time: this.workout.time,
            hour: time.hours,
            min: time.minutes,
            sec: time.seconds,
            energy: this.workout.energy,
            distance: this.workout.distance,
            note: this.workout.note,
            gear: this.workout.gear.id
        });
    }

    private _prepareTime(d: number) {
        const time = this.pipe.transform(d);

        const t = time.split(':');

        return {
            hours: Number(t[0]),
            minutes: Number(t[1]),
            seconds: Number(t[2])
        };
    }
}
