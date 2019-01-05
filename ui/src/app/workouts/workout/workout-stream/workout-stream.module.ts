import { NgModule } from '@angular/core';
import { WorkoutStreamComponent } from './workout-stream.component';
import { CommonModule } from '@angular/common';
import { PipesModule } from '../../../shared/pipes/pipes.module';
import { WorkoutViewSelectorModule } from '../workout-view-selector/workout-view-selector.module';
import { WorkoutListModule } from '../workout-list/workout-list.module';
import { WorkoutTableViewModule } from '../workout-table-view/workout-table-view.module';
import { WorkoutRangeSelectorModule } from '../workout-range-selector/workout-range-selector.module';
import { WorkoutChartModule } from '../workout-chart/workout-chart.module';
import { WorkoutTypesGroupModule } from '../workout-types-group/workout-types-group.module';
import { ReactiveFormsModule } from '@angular/forms';
import { WorkoutCalendarModule } from '../workout-calendar/workout-calendar.module';
import { MatButtonModule, MatProgressSpinnerModule } from '@angular/material';

@NgModule({
    imports: [
        CommonModule,
        PipesModule,
        ReactiveFormsModule,
        WorkoutViewSelectorModule,
        WorkoutListModule,
        WorkoutTableViewModule,
        WorkoutRangeSelectorModule,
        WorkoutChartModule,
        WorkoutTypesGroupModule,
        WorkoutCalendarModule,

        MatButtonModule,
        MatProgressSpinnerModule
    ],
    exports: [WorkoutStreamComponent],
    declarations: [WorkoutStreamComponent],
    providers: []
})
export class WorkoutStreamModule {}
