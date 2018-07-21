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
import { WorkoutListComponent } from './workout/workout-list/workout-list.component';
import { PipesModule } from '../shared/pipes/pipes.module';
import { WorkoutChartComponent } from './workout/workout-chart/workout-chart.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { WdFileUploadModule } from '../shared/components/file-upload/file-upload.module';
import { WorkoutListItemComponent } from './workout/workout-list/workout-list-item/workout-list-item.component';
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

const COMP = [
    WorkoutFormComponent,
    WorkoutListComponent,
    WorkoutChartComponent,
    WorkoutListItemComponent,
    WorkoutCalendarComponent,
    WorkoutAddComponent,
    WorkoutEditComponent,
    WorkoutNotFoundComponent,
    WorkoutTypesGroupComponent
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

        WorkoutDetailModule
    ],
    exports: [WorkoutsComponent],
    declarations: [WorkoutsComponent, ...COMP],
    providers: [WorkoutService, GearService, ActivitiesService]
})
export class WorkoutsModule {}
