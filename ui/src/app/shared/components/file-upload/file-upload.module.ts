import { NgModule } from '@angular/core';
import { FileUploadComponent } from './file-upload.component';
import { FileUploadModule } from 'ng2-file-upload';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        FileUploadModule,
        CommonModule,
    ],
    exports: [FileUploadComponent],
    declarations: [FileUploadComponent],
    providers: [],
})
export class WdFileUploadModule { }
