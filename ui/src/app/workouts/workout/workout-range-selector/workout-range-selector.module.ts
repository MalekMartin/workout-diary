import { NgModule } from '@angular/core';
import { WorkoutRangeSelectorComponent } from './workout-range-selector.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule, MatOptionModule, MatFormFieldModule } from '@angular/material';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatOptionModule

    ],
    exports: [WorkoutRangeSelectorComponent],
    declarations: [WorkoutRangeSelectorComponent],
    providers: []
})
export class WorkoutRangeSelectorModule {}
