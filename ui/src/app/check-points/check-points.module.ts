import { NgModule } from '@angular/core';
import { CheckPointsComponent } from './check-points.component';
import { RouterModule } from '@angular/router';
import { checkpointsRoutes } from './check-points.routes';
import { CheckPointFormComponent } from './check-point-form/check-point-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatButtonModule, MatTooltipModule } from '@angular/material';
import { CheckPointService } from '../core/check-point/check-point.service';
import { CheckPointListComponent } from './check-point-list/check-point-list.component';
import { CheckPointListItemComponent } from './check-point-list-item/check-point-list-item.component';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(checkpointsRoutes),
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatTooltipModule,
    ],
    exports: [CheckPointsComponent],
    declarations: [
        CheckPointsComponent,
        CheckPointFormComponent,
        CheckPointListComponent,
        CheckPointListItemComponent,
    ],
    providers: [
        CheckPointService
    ],
})
export class CheckPointsModule { }
