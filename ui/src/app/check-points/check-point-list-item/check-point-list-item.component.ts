import { Component, Input } from '@angular/core';
import { CheckPoint } from '../../core/check-point/check-point.interface';

@Component({
    selector: 'wd-check-point-list-item',
    templateUrl: 'check-point-list-item.component.html',
    styleUrls: ['./check-point-list-item.component.scss']
})

export class CheckPointListItemComponent {

    @Input() checkPoint: CheckPoint;
}
