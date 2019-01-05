import { Routes } from '@angular/router';
import { WorkoutsComponent } from './workouts.component';
import { WorkoutStreamComponent } from './workout/workout-stream/workout-stream.component';
import { WorkoutDetailComponent } from './workout/workout-detail/workout-detail.component';
import { WorkoutAddComponent } from './workout/workout-add/workout-add.component';
import { WorkoutEditComponent } from './workout/workout-edit/workout-edit.component';
import { WorkoutNotFoundComponent } from './workout/workout-not-found/workout-not-found.component';

export const workoutsRoutes: Routes = [
    {
        path: '',
        redirectTo: 'workouts/all',
        pathMatch: 'full'
    },
    {
        path: 'workouts',
        component: WorkoutsComponent,
        children: [
            {
                path: 'spinning',
                loadChildren: 'app/workouts/spinning-workouts/spinning-workouts.module#SpinningWorkoutsModule'
            },
            {
                path: 'activities',
                loadChildren: 'app/workouts/activities/activities.module#ActivitiesModule'
            },
            {
                path: 'all',
                component: WorkoutStreamComponent
            },
            {
                path: 'not-found',
                component: WorkoutNotFoundComponent
            },
            {
                path: ':id',
                component: WorkoutDetailComponent
            }
        ]
    },
    {
        path: 'gpx',
        loadChildren: 'app/workouts/gpx/gpx.module#GpxModule'
    }
];
