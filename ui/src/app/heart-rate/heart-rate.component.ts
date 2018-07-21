import { Component, OnInit } from '@angular/core';
import { HeartRateService } from '../core/heart-rate/heart-rate.service';
import { FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
    selector: 'wd-heart-rate',
    templateUrl: 'heart-rate.component.html',
    styleUrls: ['./heart-rate.component.scss']
})

export class HeartRateComponent implements OnInit {

    ngOnInit() {}
}
