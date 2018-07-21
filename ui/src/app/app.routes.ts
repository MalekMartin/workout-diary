import {Routes} from '@angular/router';
import { workoutsRoutes } from './workouts/workouts.routes';

export const ROUTES: Routes = [
    ...workoutsRoutes,
    {
        path: 'heart',
        loadChildren: 'app/heart-rate/heart-rate.module#HeartRateModule'
    },
    {
        path: 'checkpoints',
        loadChildren: 'app/check-points/check-points.module#CheckPointsModule'
    },
    {
        path: 'gear',
        loadChildren: 'app/gear/gear.module#GearModule'
    },
];
