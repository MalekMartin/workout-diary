import { Component, OnInit, OnDestroy } from '@angular/core';
import { SpinningWorkout, SpinningSection } from '../../../core/spinning-workout/spinning-workout.interface';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { SpinningWorkoutService } from '../../../core/spinning-workout/spinning-workout.service';
import { interval } from 'rxjs/observable/interval';
import * as _ from 'lodash';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'wd-spinning-work',
    templateUrl: 'spinning-work.component.html',
    styleUrls: ['./spinning-work.component.scss']
})

export class SpinningWorkComponent implements OnInit, OnDestroy {

    workout: SpinningWorkout;
    totalDuration = 0;

    currentSection: SpinningSection;
    sectionType: string;
    currentDuration = 0;
    index = 0;
    strokesDuration = 0;

    status: 'COUNTDOWN' | 'SPINNING' | 'FINISHED' | 'STOPPED' | null = null;
    counter: number;
    peddal = false;

    private _counterInt: Subscription = null;
    private _beatsInt = null;
    private _timeInt = null;
    private _onDestroy$ = new Subject();
    private _intDestroy$ = new Subject();

    constructor(private _route: ActivatedRoute,
                private _spinningService: SpinningWorkoutService) { }

    ngOnInit() {
        this._route.params
            .pipe(takeUntil(this._onDestroy$))
            .subscribe(p => {
                if (p['id']) {
                    this.workout = this._spinningService.getOneById(p['id']);
                    this._totalDuration();
                }
            });
    }

    ngOnDestroy() {
        this._onDestroy$.next();
        this._intDestroy$.next();
    }

    get workoutProgress() {
        const rest = (this.totalDuration - this.currentDuration);
        return ((rest / this.totalDuration) * 100).toFixed(2) + '%';
    }

    start() {
        this.status = 'COUNTDOWN';
        this._intDestroy$.next();
        this._countDown();
        this.status = null;
    }

    stop() {
        this._intDestroy$.next();
        this.currentSection = null;
        this.status = 'STOPPED';
    }

    finish() {
        this._intDestroy$.next();
        // this.currentSection = null;
        this.status = 'FINISHED';
    }

    startWorkout() {
        this.status = 'SPINNING';
        this.index = 0;
        this.currentSection = _.clone(this.workout.sections[this.index]);
        this.currentDuration = this.totalDuration;
        this._getSectionType();

        if (this.currentSection.rpm > 0) {
            this._startBeats(this.currentSection.rpm);
        }

        this._timeInt = interval(1000)
            .pipe(takeUntil(this._intDestroy$))
            .subscribe(() => {
                this.currentSection.duration -= 1;
                this.currentDuration -= 1;

                if (this.currentSection.duration < 1) {
                    this.index += 1;

                    if (!!this.workout.sections[this.index]) {
                        this.currentSection = _.clone(this.workout.sections[this.index]);
                        this._getSectionType();
                        if (this.currentSection.rpm > 0) {
                            this._startBeats(this.currentSection.rpm);
                        }
                    } else {
                        this.finish();
                        this.index -= 1;
                    }
                }
            });
    }

    private _countDown() {
        this.counter = 3;

        this._counterInt = interval(1000)
            .pipe(takeUntil(this._intDestroy$))
            .subscribe(() => {
                this.counter -= 1;
                if (this.counter < 1) {
                    this._counterInt.unsubscribe();
                    this.startWorkout();
                }
            });
    }


    private _startBeats(rpm: number) {
        if (this._beatsInt) {
            this._beatsInt.unsubscribe();
        }
        this._beatsInt = interval(this._calculatePeddaling(rpm))
            .pipe(takeUntil(this._intDestroy$))
            .subscribe(() => {
                this.peddal = !this.peddal;
            });
    }

    private _calculatePeddaling(rpm) {
        this.strokesDuration = Math.ceil((1 / (rpm * 2)) * 60000);
        return this.strokesDuration;
    }

    private _totalDuration() {
        this.totalDuration = 0;
        this.workout.sections.forEach(s => {
            this.totalDuration += s.duration;
        });
    }

    private _getSectionType() {
        const type = this.currentSection.type;
        if (type === 'WARM_UP') {
            this.sectionType = 'Warm up';
        } else if (type === 'WORK') {
            this.sectionType = 'Sprint';
        } else if (type === 'REST') {
            this.sectionType = 'Odpočinek';
        } else if (type === 'COOL_DOWN') {
            this.sectionType = 'Cooldown';
        }
    }
}
