import { NgModule } from '@angular/core';
import { ActivitiesComponent } from './activities.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule, MatButtonModule, MatIconModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { activitiesRoutes } from './activities.routes';
import { ActivityFormComponent } from './activity-form/activity-form.component';
import { ActivitiesService } from '../../core/activities/activities.service';
import { ActivityLisComponent } from './activity-list/activity-list.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        RouterModule.forChild(activitiesRoutes)
    ],
    exports: [ActivitiesComponent],
    declarations: [ActivitiesComponent, ActivityFormComponent, ActivityLisComponent],
    providers: [ActivitiesService]
})
export class ActivitiesModule {}
