import { Component, OnInit, Output, EventEmitter, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Gear } from '../../core/gear/gear.interface';
import { GearService } from '../../core/gear/gear.service';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { GearFormComponent } from '../gear-form/gear-form.component';

@Component({
    selector: 'wd-gear-add',
    templateUrl: 'gear-add.component.html'
})

export class GearAddComponent implements OnInit, OnDestroy {

    @Output() saved = new EventEmitter();

    @ViewChild(GearFormComponent) gearForm: GearFormComponent;

    private _onDestroy$ = new Subject();

    constructor(
        private _gearService: GearService,
        private _cd: ChangeDetectorRef,
    ) { }

    ngOnInit() { }

    ngOnDestroy() {
        this._onDestroy$.next();
    }

    save(gear: Gear) {
        this._gearService.addGear(gear)
            .pipe(takeUntil(this._onDestroy$))
            .subscribe(() => {
                this.saved.emit();
                this.gearForm.form.reset();
                this._cd.markForCheck();
            });
    }
}
