import { NgModule } from '@angular/core';
import { GpxComponent } from './gpx.component';
import { ChartComponent } from './chart/chart.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { gpxRoutes } from './gpx.routes';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule, MatFormFieldModule, MatButtonModule, MatCheckboxModule, MatRadioModule } from '@angular/material';
import { FileUploadModule } from 'ng2-file-upload';

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

        FileUploadModule,
    ],
    exports: [GpxComponent, ChartComponent],
    declarations: [GpxComponent, ChartComponent],
    providers: [],
})
export class GpxModule { }
