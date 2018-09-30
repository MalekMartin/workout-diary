import { NgModule } from '@angular/core';
import { WorkoutListComponent } from './workout-list.component';
import { WorkoutListItemComponent } from './workout-list-item/workout-list-item.component';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatGridListModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { PipesModule } from '../../../shared/pipes/pipes.module';

@NgModule({
    imports: [CommonModule, MatCardModule, MatGridListModule, RouterModule, PipesModule],
    exports: [WorkoutListComponent],
    declarations: [WorkoutListComponent, WorkoutListItemComponent],
    providers: []
})
export class WorkoutListModule {}
