import { NgModule } from '@angular/core';
import { WorkoutChartComponent } from './workout-chart.component';
import { CommonModule } from '@angular/common';
import { PipesModule } from '../../../shared/pipes/pipes.module';
import { MatTooltipModule } from '@angular/material';

@NgModule({
    imports: [
        CommonModule,
        PipesModule,
        MatTooltipModule
    ],
    exports: [WorkoutChartComponent],
    declarations: [WorkoutChartComponent],
    providers: [],
})
export class WorkoutChartModule { }
