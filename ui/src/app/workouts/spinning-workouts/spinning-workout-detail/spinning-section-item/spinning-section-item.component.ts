import { Component, OnInit, Input } from '@angular/core';
import { SpinningSection } from '../../../../core/spinning-workout/spinning-workout.interface';

@Component({
    selector: 'wd-spinning-section-item',
    templateUrl: 'spinning-section-item.component.html',
    styleUrls: ['./spinning-section-item.component.scss']
})

export class SpinningSectionItemComponent implements OnInit {

    @Input() section: SpinningSection;

    constructor() { }

    ngOnInit() {
    }
}
