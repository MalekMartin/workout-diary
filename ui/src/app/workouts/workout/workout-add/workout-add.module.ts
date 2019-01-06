import { NgModule } from '@angular/core';
import { WorkoutAddComponent } from './workout-add.component';
import { WorkoutFormModule } from '../workout-form/workout-form.module';
import { FileUploadModule } from 'ng2-file-upload';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatButtonModule, MatSnackBarModule } from '@angular/material';

@NgModule({
    imports: [
        CommonModule,
        WorkoutFormModule,
        FileUploadModule,
        MatDialogModule,
        MatButtonModule,
        MatSnackBarModule
    ],
    exports: [WorkoutAddComponent],
    declarations: [WorkoutAddComponent],
    entryComponents: [WorkoutAddComponent]
})
export class WorkoutAddModule { }
