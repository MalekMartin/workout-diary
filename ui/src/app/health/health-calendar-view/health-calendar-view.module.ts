import { NgModule } from '@angular/core';
import { HealthCalendarViewComponent } from './health-calendar-view.component';
import { CommonModule } from '@angular/common';
import { PipesModule } from '../../shared/pipes/pipes.module';
import { MatButtonModule, MatProgressSpinnerModule } from '@angular/material';

@NgModule({
    imports: [CommonModule, PipesModule, MatButtonModule],
    exports: [HealthCalendarViewComponent],
    declarations: [HealthCalendarViewComponent],
    providers: []
})
export class HealthCalendarViewModule {}
