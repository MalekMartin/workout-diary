import { NgModule } from '@angular/core';
import { IllnessEditComponent } from './illness-edit.component';
import { IllnessFormModule } from '../illness-form/illness-form.module';
import { MatButtonModule, MatDialogModule } from '@angular/material';

@NgModule({
    imports: [
        MatButtonModule,
        MatDialogModule,
        IllnessFormModule
    ],
    exports: [IllnessEditComponent],
    declarations: [IllnessEditComponent],
    entryComponents: [IllnessEditComponent],
    providers: []
})
export class IllnessEditModule {}
