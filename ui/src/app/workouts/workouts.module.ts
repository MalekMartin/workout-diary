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
import { PipesModule } from '../shared/pipes/pipes.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { WdFileUploadModule } from '../shared/components/file-upload/file-upload.module';
import { MatCheckboxModule } from '@angular/material';
import { FileUploadModule } from 'ng2-file-upload';
import { WorkoutDetailModule } from './workout/workout-detail/workout-detail.module';
import { WorkoutNotFoundComponent } from './workout/workout-not-found/workout-not-found.component';
import { GearService } from '../core/gear/gear.service';
import { ActivitiesService } from '../core/activities/activities.service';
import { WorkoutTableViewModule } from './workout/workout-table-view/workout-table-view.module';
import { WorkoutListModule } from './workout/workout-list/workout-list.module';
import { WorkoutViewSelectorModule } from './workout/workout-view-selector/workout-view-selector.module';
import { WorkoutFormModule } from './workout/workout-form/workout-form.module';
import { WorkoutAddModule } from './workout/workout-add/workout-add.module';
import { WorkoutStreamModule } from './workout/workout-stream/workout-stream.module';
import { WorkoutEditModule } from './workout/workout-edit/workout-edit.module';

const COMP = [
    WorkoutNotFoundComponent,
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
        WorkoutFormModule,
        WorkoutAddModule,
        WorkoutStreamModule,
        WorkoutEditModule
    ],
    exports: [WorkoutsComponent],
    declarations: [WorkoutsComponent, ...COMP],
    providers: [WorkoutService, GearService, ActivitiesService]
})
export class WorkoutsModule {}
