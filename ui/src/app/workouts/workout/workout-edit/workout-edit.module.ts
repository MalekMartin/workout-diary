import { NgModule } from '@angular/core';
import { WorkoutEditComponent } from './workout-edit.component';
import { CommonModule } from '@angular/common';
import { WorkoutFormModule } from '../workout-form/workout-form.module';
import { MatButtonModule, MatDialogModule, MatSnackBarModule } from '@angular/material';

@NgModule({
    imports: [
        CommonModule,
        WorkoutFormModule,
        MatButtonModule,
        MatDialogModule,
        MatSnackBarModule
    ],
    exports: [WorkoutEditComponent],
    declarations: [WorkoutEditComponent],
    entryComponents: [WorkoutEditComponent]
})
export class WorkoutEditModule { }
