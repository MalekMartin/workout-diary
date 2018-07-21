import { NgModule } from '@angular/core';
import { GearComponent } from './gear.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { gearRoutes } from './gear.routes';
import { GearService } from '../core/gear/gear.service';
import { GearListComponent } from './gear-list/gear-list.component';
import { PipesModule } from '../shared/pipes/pipes.module';
import { MatFormFieldModule, MatInputModule, MatButtonModule, MatDatepickerModule } from '@angular/material';
import { GearFormComponent } from './gear-form/gear-form.component';
import { GearAddComponent } from './gear-add/gear-add.component';

@NgModule({
    imports: [
        ReactiveFormsModule,
        CommonModule,
        RouterModule.forChild(gearRoutes),
        PipesModule,

        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDatepickerModule,
    ],
    exports: [GearComponent],
    declarations: [
        GearComponent,
        GearListComponent,
        GearFormComponent,
        GearAddComponent,
    ],
    providers: [GearService],
})
export class GearModule { }
