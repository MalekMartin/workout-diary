import { Component, OnInit, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import { HealthService } from '../core/health/health.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Illness, IllnessWithType } from '../core/health/health.interface';
import { MatDialog } from '@angular/material';
import { IllnessAddComponent } from './illness-add/illness-add.component';
import { ILLNESS_TYPE } from './illness-form/illness-form.component';
import { IllnessEditComponent } from './illness-edit/illness-edit.component';
import { IllnessPreviewComponent } from './illness-preview/illness-preview.component';
import { DateRange } from './health-calendar-view/health-calendar-view.component';

@Component({
    selector: 'wd-health',
    templateUrl: 'health.component.html',
    styleUrls: ['./health.component.scss']
})
export class HealthComponent implements OnInit, OnDestroy {

    weeks = [];
    range: DateRange = {
        from: moment().date(1).format('YYYY-MM-DD'),
        to: moment().date(moment().daysInMonth()).format('YYYY-MM-DD')
    };

    illnesses: IllnessWithType[] = [];

    loading = false;

    private _onDestroy$ = new Subject();
    private _illnessTypes = ILLNESS_TYPE;

    constructor(private _healthService: HealthService, public dialog: MatDialog) {}

    ngOnInit() {
        this.getIllnesses(this.range.from, this.range.to);
    }

    ngOnDestroy() {
        this._onDestroy$.next();
    }

    add() {
        this.dialog.open(IllnessAddComponent, {
            width: '500px',
            data: null
        }).afterClosed().subscribe(result => {
            if (!!result) {
                this.save(result);
            }
        });
    }

    edit(value: IllnessWithType) {
        this.dialog.open(IllnessEditComponent, {
            width: '500px',
            data: value
        }).afterClosed().subscribe(result => {
            if (!!result && result.action === 'SAVE') {
                this.update(result.data);
            }
        });
    }

    preview(value: IllnessWithType) {
        this.dialog.open(IllnessPreviewComponent, {
            width: '500px',
            data: value
        }).afterClosed().subscribe(result => {
            if (!!result && result.action === 'DELETE') {
                this.delete(result.data);
            }
        });
    }

    getIllnesses(from: string, to: string) {
        this.loading = true;
        this._healthService.getIllnessByDate(from, to)
            .pipe(takeUntil(this._onDestroy$))
            .subscribe((i: Illness[]) => {
                this.illnesses = i.map(item => {
                    return {
                        ...item,
                        type: this._illnessTypes.find(t => t.id === item.type)
                    };
                });
                this.loading = false;
            }, () => {
                this.loading = false;
            });
    }

    save(value: Illness) {
        this._healthService.insertIllness(
                {
                    ...value,
                    date: moment(value.date).format('YYYY-MM-DD\THH:mm:ss.000') + 'Z'
                }
            )
            .pipe(takeUntil(this._onDestroy$))
            .subscribe(this._saved, this._notSaved);
    }

    update(value: Illness) {
        this._healthService.updateIllness(
                {
                    ...value,
                    date: moment(value.date).format('YYYY-MM-DD\THH:mm:ss.000') + 'Z'
                }
            )
            .pipe(takeUntil(this._onDestroy$))
            .subscribe(this._saved, this._notSaved);
    }

    delete(value: Illness) {
        this._healthService.deleteIllness(value.id)
            .subscribe();
    }

    prevMonth() {
        const newDate = moment(this.range.from).subtract(1, 'month').date(1).format('YYYY-MM-DD');
        this.range = {
            from: newDate,
            to: moment(newDate).date(moment().daysInMonth()).format('YYYY-MM-DD')
        };
        this.getIllnesses(this.range.from, this.range.to);
    }

    nextMonth() {
        const newDate = moment(this.range.from).add(1, 'month').date(1).format('YYYY-MM-DD');
        this.range = {
            from: newDate,
            to: moment(newDate).date(moment().daysInMonth()).format('YYYY-MM-DD')
        };
        this.getIllnesses(this.range.from, this.range.to);
    }

    private _saved = () => {
    }

    private _notSaved = () => {
        console.log('not saved');
    }
}
