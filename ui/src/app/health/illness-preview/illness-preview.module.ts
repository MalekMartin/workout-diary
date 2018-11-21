import { NgModule } from '@angular/core';
import { IllnessPreviewComponent } from './illness-preview.component';
import { IllnessFormModule } from '../illness-form/illness-form.module';
import { MatButtonModule, MatDialogModule } from '@angular/material';
import { PipesModule } from '../../shared/pipes/pipes.module';
import { IllnessPreviewItemComponent } from './illness-preview-item/illness-preview-item.component';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        CommonModule,
        MatButtonModule,
        MatDialogModule,
        IllnessFormModule,
        PipesModule
    ],
    exports: [IllnessPreviewComponent],
    declarations: [IllnessPreviewComponent, IllnessPreviewItemComponent],
    entryComponents: [IllnessPreviewComponent],
    providers: []
})
export class IllnessPreviewModule {}
