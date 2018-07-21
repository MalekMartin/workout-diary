import { NgModule } from '@angular/core';
import { MatButtonModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatCardModule } from '@angular/material';
import { SpinningWokroutsComponent } from './spinning-workouts.component';
import { RouterModule } from '@angular/router';
import { spinningWorkoutsRoutes } from './spinning-workouts.routes';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SpinningWorkoutFormComponent } from './spinning-workout-form/spinning-worout-form.component';
import { SpinningWorkoutDetailComponent } from './spinning-workout-detail/spinning-workout-detail.component';
import { SpinningWorkoutListComponent } from './spinning-workout-list/spinning-workout-list.component';
import { SpinningSectionItemComponent } from './spinning-workout-detail/spinning-section-item/spinning-section-item.component';
import { SpinningWorkComponent } from './spinning-work/spinning-work.component';
import { PipesModule } from '../../shared/pipes/pipes.module';

const COMPONENTS = [
    SpinningWokroutsComponent,
    SpinningWorkoutDetailComponent,
    SpinningWorkoutFormComponent,
    SpinningWorkoutListComponent,
    SpinningSectionItemComponent,
    SpinningWorkComponent,
];

@NgModule({
  imports: [
      CommonModule,
      ReactiveFormsModule,
      MatButtonModule,
      MatInputModule,
      MatFormFieldModule,
      MatSelectModule,
      MatCardModule,
      RouterModule.forChild(spinningWorkoutsRoutes),
      PipesModule,
    ],
  exports: [...COMPONENTS],
  declarations: [...COMPONENTS],
  providers: []
})
export class SpinningWorkoutsModule {}
