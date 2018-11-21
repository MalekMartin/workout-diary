import { NgModule } from '@angular/core';
import { GpxComponent } from './gpx.component';
import { ChartComponent } from './chart/chart.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { gpxRoutes } from './gpx.routes';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    MatOptionModule
} from '@angular/material';
import { FileUploadModule } from 'ng2-file-upload';
import { GpxFormModule } from './gpx-form/gpx-form.module';
import { GpxService } from '../../core/gpx/gpx.service';

@NgModule({
    imports: [
        CommonModule,
        NgxChartsModule,
        RouterModule.forChild(gpxRoutes),
        FormsModule,
        ReactiveFormsModule,

        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatCheckboxModule,
        MatRadioModule,
        MatSelectModule,
        MatOptionModule,

        FileUploadModule,
        GpxFormModule
    ],
    exports: [GpxComponent, ChartComponent],
    declarations: [GpxComponent, ChartComponent],
    providers: [GpxService]
})
export class GpxModule {}
