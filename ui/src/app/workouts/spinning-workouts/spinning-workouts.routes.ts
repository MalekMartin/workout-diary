import { Routes } from '@angular/router';
import { SpinningWokroutsComponent } from './spinning-workouts.component';
import { SpinningWorkoutDetailComponent } from './spinning-workout-detail/spinning-workout-detail.component';
import { SpinningWorkComponent } from './spinning-work/spinning-work.component';

export const spinningWorkoutsRoutes: Routes = [
    {
        path: '',
        component: SpinningWokroutsComponent,
    },
    {
        path: 'start/:id',
        component: SpinningWorkComponent
    },
    {
        path: ':id',
        component: SpinningWorkoutDetailComponent
    },
];
