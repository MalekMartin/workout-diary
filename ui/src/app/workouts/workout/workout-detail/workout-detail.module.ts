import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapModule } from '../../../shared/components/map/map.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {
    MatMenuModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatTabsModule,
    MatProgressSpinnerModule
} from '@angular/material';
import { WorkoutDetailComponent } from './workout-detail.component';
import { WorkoutCheckPointFormComponent } from './workout-check-point-form/workout-check-point-form.component';
import { WorkoutCheckPointTableComponent } from './workout-check-point-table/workout-check-point-table.component';
import { WorkoutCheckPointRowComponent } from './workout-check-point-table/workout-check-point-row/workout-check-point-row.component';
import { DetailNumberCellComponent } from './detail-number-cell/detail-number-cell.component';
import { WorkoutDetailGraphComponent } from './workout-detail-graph/workout-detail-graph.component';
import { CheckPointService } from '../../../core/check-point/check-point.service';
import { PipesModule } from '../../../shared/pipes/pipes.module';
import { WdFileUploadModule } from '../../../shared/components/file-upload/file-upload.module';
import { WorkoutDetailNumbersComponent } from './workout-detail-numbers/workout-detail-numbers.component';
import { WorkoutDetailHeaderComponent } from './workout-detail-header/workout-detail-header.component';
import { WorkoutDetailHrComponent } from './workout-detail-hr/workout-detail-hr.component';
import { HrZonesService } from '../../../core/heart-rate/hr-zones.service';

@NgModule({
    imports: [
        CommonModule,
        MapModule,
        RouterModule,
        ReactiveFormsModule,
        NgxChartsModule,
        PipesModule,
        WdFileUploadModule,

        MatMenuModule,
        MatIconModule,
        MatCardModule,
        MatFormFieldModule,
        MatButtonModule,
        MatSelectModule,
        MatTabsModule,
        MatProgressSpinnerModule,
    ],
    exports: [WorkoutDetailComponent],
    declarations: [
        WorkoutDetailComponent,
        WorkoutCheckPointFormComponent,
        WorkoutCheckPointTableComponent,
        WorkoutCheckPointRowComponent,
        DetailNumberCellComponent,
        WorkoutDetailGraphComponent,
        WorkoutDetailNumbersComponent,
        WorkoutDetailHeaderComponent,
        WorkoutDetailHrComponent,
    ],
    providers: [CheckPointService, HrZonesService]
})
export class WorkoutDetailModule {}
