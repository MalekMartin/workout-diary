import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HrZones } from '../../../core/hr-zones';
import { SpinningWorkoutService } from '../../../core/spinning-workout/spinning-workout.service';

@Component({
    selector: 'wd-spinning-workout-form',
    templateUrl: 'spinning-worout-form.component.html',
    styleUrls: ['./spinning-worout-form.component.scss']
})

export class SpinningWorkoutFormComponent implements OnInit {

    @Output() save = new EventEmitter();

    form = this._fb.group({
        id: [''],
        type: ['', Validators.required],
        rpm: [0, [Validators.min(0), Validators.max(200)]],
        zone: [''],
        mins: [0, [Validators.min(0), Validators.max(59)]],
        secs: [0, [Validators.min(0), Validators.max(59)]]
    });

    types = [
        {id: 'WARM_UP', name: 'warm up'},
        {id: 'WORK', name: 'work'},
        {id: 'REST', name: 'rest'},
        {id: 'COOL_DOWN', name: 'cool down'}
    ];

    hrZones = new HrZones();

    constructor(private _fb: FormBuilder,
                private _spinninService: SpinningWorkoutService) { }

    ngOnInit() {
    }

    saveData() {
        this.save.emit(this._buildData());
    }

    private _buildData() {
        return {
            id: !!this.form.get('id').value
                    ? this.form.get('id').value
                    : Math.ceil((Math.random() * 10000)).toString(),
            type: this.form.get('type').value,
            rpm: this.form.get('rpm').value,
            zone: this.form.get('zone').value,
            duration: this._spinninService.recalculateToSecs(
                this.form.get('mins').value,
                this.form.get('secs').value
            )
        };
    }
}


