import { NgModule } from '@angular/core';
import { IllnessFormComponent } from './illness-form.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatButtonModule,
    MatDialogModule
} from '@angular/material';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatOptionModule,
        MatDatepickerModule,
        MatButtonModule,
        MatDialogModule
    ],
    exports: [IllnessFormComponent],
    declarations: [IllnessFormComponent],
    providers: []
})
export class IllnessFormModule {}
