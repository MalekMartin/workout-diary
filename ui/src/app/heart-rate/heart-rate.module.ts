import { NgModule } from '@angular/core';
import { HeartRateComponent } from './heart-rate.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { heartRateRoutes } from './heart-rate.routes';
import { HeartRateService } from '../core/heart-rate/heart-rate.service';
import {
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSnackBarModule,
    MatTableModule,
    MatSelectModule
} from '@angular/material';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { RestingHrComponent } from './resting-hr/resting-hr.component';
import { HrZonesComponent } from './hr-zones/hr-zones.component';
import { HrZonesService } from '../core/heart-rate/hr-zones.service';
import { PipesModule } from '../shared/pipes/pipes.module';
import { RestingHrTableComponent } from './resting-hr/resting-hr-table/resting-hr-table.component';
import { RestingHrWeekAvgComponent } from './resting-hr/resting-hr-week-avg/resting-hr-week-avg.component';
import { MatDialogModule } from '@angular/material';
import { RestingHrDeleteComponent } from './resting-hr/resting-hr-delete/resting-hr-delete.component';
import { RestingHrEditComponent } from './resting-hr/resting-hr-edit/resting-hr-edit.component';

const COMPONENTS = [
    RestingHrComponent,
    HrZonesComponent,
    RestingHrTableComponent,
    RestingHrWeekAvgComponent,
    RestingHrDeleteComponent,
    RestingHrEditComponent
];

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule.forChild(heartRateRoutes),
        PipesModule,

        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatSnackBarModule,
        MatTableModule,
        MatSelectModule,
        MatDialogModule,

        NgxChartsModule,
    ],
    exports: [HeartRateComponent],
    declarations: [
        HeartRateComponent,
        ...COMPONENTS
    ],
    entryComponents: [RestingHrDeleteComponent, RestingHrEditComponent],
    providers: [HeartRateService, HrZonesService],
})
export class HeartRateModule { }
