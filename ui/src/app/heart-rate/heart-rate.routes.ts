import { Routes } from '@angular/router';
import { HeartRateComponent } from './heart-rate.component';
import { RestingHrComponent } from './resting-hr/resting-hr.component';
import { HrZonesComponent } from './hr-zones/hr-zones.component';

export const heartRateRoutes: Routes = [
    {
        path: '',
        component: HeartRateComponent,
        children: [
            {
                path: 'resting',
                component: RestingHrComponent
            },
            {
                path: 'zones',
                component: HrZonesComponent
            }
        ]
    },
];
