import { NgModule } from '@angular/core';
import { HealthComponent } from './health.component';
import { RouterModule } from '@angular/router';
import { healthRoutes } from './health.routes';
import { HealthService } from '../core/health/health.service';
import { CommonModule } from '@angular/common';
import { HealthCalendarViewModule } from './health-calendar-view/health-calendar-view.module';
import { IllnessFormModule } from './illness-form/illness-form.module';
import { MatButtonModule, MatDialogModule, MatProgressSpinnerModule } from '@angular/material';
import { IllnessAddModule } from './illness-add/illness-add.module';
import { IllnessEditModule } from './illness-edit/illness-edit.module';
import { IllnessPreviewModule } from './illness-preview/illness-preview.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(healthRoutes),
        HealthCalendarViewModule,
        IllnessFormModule,
        MatButtonModule,
        MatDialogModule,
        IllnessAddModule,
        IllnessEditModule,
        IllnessPreviewModule,
        MatProgressSpinnerModule
    ],
    exports: [],
    declarations: [HealthComponent],
    providers: [HealthService]
})
export class HealthModule {}
