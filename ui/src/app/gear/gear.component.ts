import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Gear } from '../core/gear/gear.interface';
import { GearService } from '../core/gear/gear.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'wd-gear',
    templateUrl: 'gear.component.html',
    styleUrls: ['./gear.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class GearComponent implements OnInit, OnDestroy {

    gears: Gear[];

    private _onDestroy$ = new Subject();

    constructor(
        private _gearService: GearService,
        private _cd: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.getAllGears();
    }

    ngOnDestroy() {
        this._onDestroy$.next();
    }

    getAllGears() {
        this._gearService.getGears()
            .pipe(takeUntil(this._onDestroy$))
            .subscribe((gears: Gear[]) => {
                this.gears = gears;
                this._cd.markForCheck();
            });
    }

    onDelete(id: string) {
        this._gearService.deleteGear(id)
            .pipe(takeUntil(this._onDestroy$))
            .subscribe(() => {
                this.getAllGears();
            });
    }
}
