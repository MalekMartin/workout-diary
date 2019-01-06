import { NgModule } from '@angular/core';
import { WorkoutTypesGroupComponent } from './workout-types-group.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCheckboxModule
    ],
    exports: [WorkoutTypesGroupComponent],
    declarations: [WorkoutTypesGroupComponent],
    providers: [],
})
export class WorkoutTypesGroupModule { }

