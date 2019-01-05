import { NgModule } from '@angular/core';
import { WorkoutCalendarComponent } from './workout-calendar.component';
import { CommonModule } from '@angular/common';
import { PipesModule } from '../../../shared/pipes/pipes.module';
import { MatTooltipModule } from '@angular/material';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        PipesModule,
        MatTooltipModule
    ],
    exports: [WorkoutCalendarComponent],
    declarations: [WorkoutCalendarComponent],
    providers: [],
})
export class WorkoutCalendarModule { }

