import { NgModule } from '@angular/core';
import { WorkoutTableViewComponent } from './workout-table-view.component';
import { MatTableModule } from '@angular/material';
import { PipesModule } from '../../../shared/pipes/pipes.module';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        MatTableModule,
        RouterModule,
        PipesModule,
    ],
    exports: [WorkoutTableViewComponent],
    declarations: [WorkoutTableViewComponent],
    providers: [],
})
export class WorkoutTableViewModule { }
