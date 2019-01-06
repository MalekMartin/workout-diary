import { NgModule } from '@angular/core';
import { ExportToGpxComponent } from './export-to-gpx.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatRadioModule
} from '@angular/material';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,

        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatRadioModule,
        MatSelectModule,
        MatOptionModule
    ],
    exports: [ExportToGpxComponent],
    declarations: [ExportToGpxComponent],
    entryComponents: [ExportToGpxComponent]
})
export class ExportToGpxModule {}
