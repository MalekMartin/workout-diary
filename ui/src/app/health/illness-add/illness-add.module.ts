import { NgModule } from '@angular/core';
import { IllnessAddComponent } from './illness-add.component';
import { IllnessFormModule } from '../illness-form/illness-form.module';
import { MatButtonModule, MatDialogModule } from '@angular/material';

@NgModule({
    imports: [
        MatButtonModule,
        MatDialogModule,
        IllnessFormModule
    ],
    exports: [IllnessAddComponent],
    declarations: [IllnessAddComponent],
    entryComponents: [IllnessAddComponent],
    providers: []
})
export class IllnessAddModule {}
