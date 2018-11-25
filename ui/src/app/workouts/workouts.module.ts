import { NgModule } from '@angular/core';
import { WorkoutsComponent } from './workouts.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WorkoutFormComponent } from './workout/workout-form/workout-form.component';
import {
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDatepickerModule,
    MatSelectModule,
    MatCardModule,
    MatTooltipModule,
    MatGridListModule,
    MatMenuModule,
    MatIconModule,
    MatButtonToggleModule
} from '@angular/material';
import { WorkoutService } from '../core/workout/workout.service';
import { WorkoutStreamComponent } from './workout/workout-stream/workout-stream.component';
import { PipesModule } from '../shared/pipes/pipes.module';
import { WorkoutChartComponent } from './workout/workout-chart/workout-chart.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { WdFileUploadModule } from '../shared/components/file-upload/file-upload.module';
import { MatCheckboxModule } from '@angular/material';
import { WorkoutCalendarComponent } from './workout/workout-calendar/workout-calendar.component';
import { FileUploadModule } from 'ng2-file-upload';
import { WorkoutAddComponent } from './workout/workout-add/workout-add.component';
import { WorkoutDetailModule } from './workout/workout-detail/workout-detail.module';
import { WorkoutEditComponent } from './workout/workout-edit/workout-edit.component';
import { WorkoutNotFoundComponent } from './workout/workout-not-found/workout-not-found.component';
import { WorkoutTypesGroupComponent } from './workout/workout-types-group/workout-types-group.component';
import { GearService } from '../core/gear/gear.service';
import { ActivitiesService } from '../core/activities/activities.service';
import {
    WorkoutRangeSelectorComponent
} from './workout/workout-range-selector/workout-range-selector.component';
import { WorkoutTableViewModule } from './workout/workout-table-view/workout-table-view.module';
import { WorkoutListModule } from './workout/workout-list/workout-list.module';
import { WorkoutViewSelectorModule } from './workout/workout-view-selector/workout-view-selector.module';

const COMP = [
    WorkoutFormComponent,
    WorkoutStreamComponent,
    WorkoutChartComponent,
    WorkoutCalendarComponent,
    WorkoutAddComponent,
    WorkoutEditComponent,
    WorkoutNotFoundComponent,
    WorkoutTypesGroupComponent,
    WorkoutRangeSelectorComponent
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        FormsModule,
        NgxChartsModule,

        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatDatepickerModule,
        MatSelectModule,
        MatCardModule,
        MatTooltipModule,
        MatGridListModule,
        MatCheckboxModule,
        MatMenuModule,
        MatIconModule,
        MatButtonToggleModule,

        PipesModule,
        WdFileUploadModule,
        FileUploadModule,

        WorkoutDetailModule,
        WorkoutTableViewModule,
        WorkoutListModule,
        WorkoutViewSelectorModule,
    ],
    exports: [WorkoutsComponent],
    declarations: [WorkoutsComponent, ...COMP],
    providers: [WorkoutService, GearService, ActivitiesService]
})
export class WorkoutsModule {}
