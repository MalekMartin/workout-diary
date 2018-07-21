import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Gear } from '../../core/gear/gear.interface';

@Component({
    selector: 'wd-gear-list',
    templateUrl: 'gear-list.component.html',
    styleUrls: ['./gear-list.component.scss']
})

export class GearListComponent implements OnInit {

    @Input() gears: Gear[];

    @Output() deleted = new EventEmitter<string>();

    constructor() { }

    ngOnInit() { }

    delete(id: string) {
        this.deleted.emit(id);
    }
}
