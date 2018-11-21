import { NgModule } from '@angular/core';
import { GpxFormComponent } from './gpx-form.component';
import { MatInputModule, MatFormFieldModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule
    ],
    exports: [GpxFormComponent],
    declarations: [GpxFormComponent],
    providers: [],
})
export class GpxFormModule { }
